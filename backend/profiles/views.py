from authentication.models import User
from .models import FollowRecord, BlockRecord
from eventposts.models import EventPost
from .serializers import ProfileSerializer, PrivateProfileSerializer, FollowRecordSerializer, BlockRecordSerializer
from eventposts.serializers import SimpleEventSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from badges.models import BadgeRecord, Badge
from django.db.models import Q
from rest_framework.decorators import action
from datetime import datetime


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

    def wrap_all(self, objects, summary_msg="Event list"):
        response = \
            {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": summary_msg,
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

    def wrap_follow_block(self, data, type, actor_name, object_name, summary_msg):
        response = \
            {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": summary_msg,
                "type": type,
                "actor": {
                    "type": "Person",
                    "name": actor_name
                },
                "object":
                    {
                        "type": "Person",
                        "identifier": object_name
                    }
            }
        return response

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def follow_user(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        other_username = kwargs['pk']
        other_user = self.queryset.get(username=other_username)
        FollowRecord.objects.create(following_user=user.id, followed_user=other_user.id, follow_date=datetime.now())
        other_users.followers.append(user)
        user.followings.append(other_user)
        return Response(data={"message": "Successfully followed user."}, status=200)

    @action(detail=True, methods=['delete'], permission_classes=[permissions.IsAuthenticated])
    def unfollow_user(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        other_username = kwargs['pk']
        follow_queryset = FollowRecord.objects.all()
        other_user = self.queryset.get(username=other_username)
        follow_record_instance = follow_queryset.filter(following_user=user.id, followed_user=other_user.id)[0]
        follow_record_instance.delete()
        other_users.followers.remove(user)
        user.followings.remove(other_user)
        return Response(data={"message": "Successfully unfollowed user."}, status=200)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def get_followings(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        user_name = user.username
        followings = user.followings.all()
        serializer = self.get_serializer(followings, many=True)
        objects = []
        for data in serializer.data:
            followed_username = data["following_user"]
            summary_msg = user_name + " followed " + followed_username
            objects.append(self.wrap_follow_block(data, "Follow", user_name, followed_username, summary_msg))
        return Response(self.wrap_all(objects, "Users " + user_name + " follows."))

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def get_followers(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        followers = user.followers.all()
        serializer = self.get_serializer(followers, many=True)
        objects = []
        for data in serializer.data:
            following_username = data["followed_user"]
            summary_msg = following_username + " followed " + user_name
            objects.append(self.wrap_follow_block(data, "Follow", followed_username, user_name, summary_msg))
        return Response(self.wrap_all(objects, "Users following " + user_name + "."))

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def block_user(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        other_username = kwargs['pk']
        other_user = self.queryset.get(username=other_username)
        BlockRecord.objects.create(blocking_user=user.id, blocked_user=other_user.id, block_date=datetime.now())
        other_users.blocked_by.append(user)
        user.blocked.append(other_user)
        return Response(data={"message": "Successfully blocked user."}, status=200)

    @action(detail=True, methods=['delete'], permission_classes=[permissions.IsAuthenticated])
    def unblock_user(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        other_username = kwargs['pk']
        block_queryset = BlockRecord.objects.all()
        other_user = self.queryset.get(username=other_username)
        block_record_instance = block_queryset.filter(blocking_user=user.id, blocked_user=other_user.id)[0]
        block_record_instance.delete()
        other_users.blocked_by.remove(user)
        user.blocked.remove(other_user)
        return Response(data={"message": "Successfully unblocked user."}, status=200)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def get_blockings(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        user_name = user.username
        blocked = user.blocked.all()
        serializer = self.get_serializer(blocked, many=True)
        objects = []
        for data in serializer.data:
            blocked_username = data["blocking_user"]
            summary_msg = user_name + " blocked " + blocked_username
            objects.append(self.wrap_follow_block(data, "Block", user_name, blocked_username, summary_msg))
        return Response(self.wrap_all(objects, "Users " + user_name + " blocked."))

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def get_blockers(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        blockers = user.blocked_by.all()
        serializer = self.get_serializer(blockers, many=True)
        objects = []
        for data in serializer.data:
            blocking_username = data["blocked_user"]
            summary_msg = blocking_username + " blocked " + user_name
            objects.append(self.wrap_follow_block(data, "Block", blocking_username, user_name, summary_msg))
        return Response(self.wrap_all(objects, "Users blocked " + user_name + "."))
