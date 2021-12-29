from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from badges.models import Badge
from badges.serializers import BadgeSerializer

class BadgeViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    authentication_classes = [JWTAuthentication]
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    lookup_field = 'name'
    JWTauth = JWTAuthentication()
