from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from authentication.models import User
from .serializers import ProfileSerializer, ProfileUpdateSerializer
from rest_framework import status, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication


class ProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'username'

class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ProfileUpdateSerializer
    lookup_field = 'username'

    def authenticate(self):
        username, _ = JWTAuthentication.authenticate(self.request)
        return username == self.request.username

    def get(self, request, *args, **kwargs):
        if authenticate():
            super.get(request, *args, **kwargs)
        else:
            raise Exception("Wrong")
