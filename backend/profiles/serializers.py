from rest_framework import serializers
from authentication.models import User
from .models import FollowRecord, BlockRecord


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username',
                  'bio', 'fav_sport_1', 'fav_sport_2', 'fav_sport_3',
                  'location', 'avatar', 'privacy', 'badges', 'birthday')
        read_only_fields = ('id', 'username', 'badges')


class PrivateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'avatar', 'privacy')
        read_only_fields = ('id', 'username', 'avatar', 'privacy')


class FollowRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowRecord
        field = "__all__"
        read_only_fields = ("following_user", "followed_user", "follow_date")


class BlockRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockRecord
        field = "__all__"
        read_only_fields = ("blocking_user", "blocked_user", "block_date")
