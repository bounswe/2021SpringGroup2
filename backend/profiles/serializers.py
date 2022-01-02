from rest_framework import serializers
from authentication.models import User


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username',
                  'bio', 'fav_sport_1', 'fav_sport_2', 'fav_sport_3',
                  'location', 'avatar', 'privacy', 'badges')
        read_only_fields = ('id', 'username', 'badges')


class PrivateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'avatar', 'privacy')
        read_only_fields = ('id', 'username', 'avatar', 'privacy')
