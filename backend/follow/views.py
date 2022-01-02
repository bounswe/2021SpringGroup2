from django.shortcuts import render
from follow.models import Follow
from follow.serializers import FollowSerializer


class FollowViewSet(viewsets.ModelViewSet):
    pass
