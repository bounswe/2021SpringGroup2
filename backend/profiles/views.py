from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from authentication.models import User
from .serializers import ProfileSerializer


class ProfileView(APIView):

    def get(self, request, username):
        try:
            profile = User.objects.get(username=username)
        except:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(ProfileSerializer(profile).data)