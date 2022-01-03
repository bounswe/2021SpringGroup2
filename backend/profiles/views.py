from authentication.models import User
from .models import FollowRecord, BlockRecord, UnfollowRecord, UnblockRecord
from eventposts.models import EventPost
from .serializers import ProfileSerializer, PrivateProfileSerializer, FollowRecordSerializer, BlockRecordSerializer, UnfollowRecordSerializer, UnblockRecordSerializer
from eventposts.serializers import SimpleEventSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from badges.models import BadgeRecord, Badge
from django.db.models import Q
from rest_framework.decorators import action


class MultipleFieldsLookupMixin(object):
    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        field = self.kwargs.get(self.lookup_field)
        filters = {}
        if field.isdigit():
            filters['id'] = field
        else:
            filters['username'] = field
        obj = get_object_or_404(queryset, **filters)
        return obj


class ProfileViewSet(MultipleFieldsLookupMixin, viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    authentication_classes = [JWTAuthentication]
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    lookup_fields = ('username', 'id')
    JWTauth = JWTAuthentication()

    def get_serializer_class(self):
        if self.action == 'list':
            return PrivateProfileSerializer
        target = self.kwargs['pk']
        if target.isdigit():
            target = self.queryset.get(id=target).username

        if self.action == 'retrieve':
            private = self.queryset.get(username=target).privacy
            if "HTTP_AUTHORIZATION" not in self.request.META:
                if private:
                    return PrivateProfileSerializer
                else:
                    return ProfileSerializer
            user, _ = self.JWTauth.authenticate(self.request)
            if target == user.username:
                return ProfileSerializer
            else:
                if private:
                    return PrivateProfileSerializer

        return ProfileSerializer

    def wrap_all(self, objects):
        response = \
            {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": "Event list",
                "type": "Collection",
                "totalItems": len(objects),
                "items": objects
            }

        return response

    def wrap(self, data):
        response = \
            {
                "object":
                    {
                        "type": "Event",
                        "postId": data["id"],
                        "title": data["title"],
                        "eventSport": data["sport"],
                        "eventDate": data["date"]
                    }
            }

        return response

    def authenticate(self):
        user, _ = self.JWTauth.authenticate(self.request)
        pk = self.kwargs['pk']
        if pk.isdigit():
            pk = self.queryset.get(id=pk).username
        return user.username == pk

    def update(self, request, *args, **kwargs):
        if self.authenticate():
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                # If 'prefetch_related' has been applied to a queryset, we need to
                # forcibly invalidate the prefetch cache on the instance.
                instance._prefetched_objects_cache = {}

            return Response(serializer.data)
        else:
            return JsonResponse(status=401, data={'detail':'Unauthorized.'})

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated],
            serializer_class=SimpleEventSerializer, url_path="related-events")
    def related_events(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        event_queryset = EventPost.objects.all()
        record_queryset = BadgeRecord.objects.all()
        target_username = kwargs['pk']
        offerer_username = user.username
        offerer_id = self.queryset.get(username=offerer_username).id
        target_id = self.queryset.get(username=target_username).id
        given_events = record_queryset.filter(Q(receiver_id=target_id) & Q(offerer_id=offerer_id)).\
            values_list('event_id', flat=True)
        related_events = event_queryset.filter((Q(owner=offerer_id) & Q(players__contains=[target_id])) |
                                               (Q(players__contains=[offerer_id]) & Q(players__contains=[target_id]))).\
            exclude(id__in=given_events)

        serializer = self.get_serializer(related_events, many=True)
        objects = []
        for data in serializer.data:
            objects.append(self.wrap(data))
        return Response(self.wrap_all(objects))

    def wrap_offer(self, data):
        response =\
            {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": data["offerer_username"] + " gave badge to " + data["target_username"],
                "type": "Offer",
                "actor": {
                    "type": "Person",
                    "name": data["offerer_username"],
                    "id": data["offerer_id"]
                },
                "object": {
                    "type": "Badge",
                    "name": data["badge_name"],
                    "attributedTo": [
                        {
                            "type": "Event",
                            "id": data["event_id"]
                        }
                    ]
                },
                "target": {
                    "type": "Person",
                    "name": data["target_username"],
                    "id": data["target_id"]
                }
            }

        return response

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def badges(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        target_username = kwargs['pk']
        badge_name = request.data.get('badge_name')
        event_id = request.data.get('event_id')
        offerer_id = user.id

        badge_queryset = Badge.objects.all()
        user_queryset = User.objects.all()
        badge_id = badge_queryset.get(name=badge_name).id
        target = user_queryset.get(username=target_username)
        BadgeRecord.objects.create(badge_id=badge_id, offerer_id=offerer_id, receiver_id=target.id, event_id=event_id)
        target.badges.append(badge_name)
        data = \
            {
                "badge_name": badge_name,
                "offerer_id": offerer_id,
                "offerer_username": user.username,
                "target_id": target.id,
                "target_username": target_username,
                "event_id": event_id,
            }

        return Response(self.wrap_offer(data))
