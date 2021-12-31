from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from authentication.models import User
from eventposts.models import EventPost
from .serializers import ProfileSerializer
from eventposts.serializers import SimpleEventSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from django.db.models import Q
from rest_framework.decorators import action
from django.core import serializers


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

    def authenticate(self):
        user, _ = self.JWTauth.authenticate(self.request)
        return user.username == self.kwargs['username']

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
            serializer_class=SimpleEventSerializer)
    def relatedEvents(self, request, *args, **kwargs):
        user, _ = self.JWTauth.authenticate(self.request)
        event_queryset = EventPost.objects.all()
        target_username = kwargs['username']
        offerer_username = user.username
        offerer_id = self.queryset.get(username=offerer_username).id
        target_id = self.queryset.get(username=target_username).id
        related_events = event_queryset.filter((Q(owner=offerer_id) & Q(players__contains=[target_id])) |
                                               (Q(players__contains=[offerer_id]) & Q(players__contains=[target_id])))

        serializer = self.get_serializer(related_events, many=True)
        return Response(serializer.data)



# class ProfileView(generics.RetrieveAPIView):
#     queryset = User.objects.all()
#     serializer_class = ProfileSerializer
#     lookup_field = 'username'
#
# class ProfileUpdateView(generics.RetrieveUpdateAPIView):
#     queryset = User.objects.all()
#     serializer_class = ProfileUpdateSerializer
#     lookup_field = 'username'
#     JWTauth = JWTAuthentication()
#
#     def authenticate(self):
#         user, _ = self.JWTauth.authenticate(self.request)
#         return user.username == self.kwargs['username']
#
#     def put(self, request, *args, **kwargs):
#         if self.authenticate():
#             return self.update(request, *args, **kwargs)
#         else:
#             return JsonResponse(status=401, data={'detail':'Unauthorized.'})
