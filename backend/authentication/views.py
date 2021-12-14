from rest_framework import status, permissions
from rest_framework import generics
from .models import User

from .serializers import UserSerializer

class UserCreate(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.all()
    serializer_class = UserSerializer