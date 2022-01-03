from rest_framework import serializers
from follow.models import Follow


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = "__all__"
        read_only_fields = ["following_user", "followed_user", "followed_date"]