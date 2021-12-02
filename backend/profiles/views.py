from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from authentication.models import User
from .serializers import ProfileSerializer, ProfileUpdateSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse




class ProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'username'

class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ProfileUpdateSerializer
    lookup_field = 'username'
    JWTauth = JWTAuthentication()

    def authenticate(self):
        user, _ = self.JWTauth.authenticate(self.request)
        return user.username == self.kwargs['username']

    def put(self, request, *args, **kwargs):
        if self.authenticate():
            return self.update(request, *args, **kwargs)
        else:
            return JsonResponse(status=401, data={'detail':'Unauthorized.'})
