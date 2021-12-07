from rest_framework import generics
from .models import EventPost, Post
from .serializers import EventSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from actstream import action



class EventView(generics.RetrieveAPIView):
    queryset = EventPost.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'id'

class EventCreateView(generics.CreateAPIView):
    queryset = EventPost.objects.all()
    serializer_class = EventSerializer
    JWTauth = JWTAuthentication()

    def authenticate(self):
        user, _ = self.JWTauth.authenticate(self.request)
        return user.id == self.request.data["owner"]

    def create(self, request, *args, **kwargs):
        if self.authenticate():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            action.send(self.request.user, verb='created', target=self.request.data["title"])
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return JsonResponse(status=401, data={'detail':'Unauthorized.'})




