from rest_framework import generics
from .models import EventPost, Post
from .serializers import EventSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse




class EventView(generics.RetrieveAPIView):
    queryset = EventPost.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'id'