from rest_framework import serializers
from authentication.models import User

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name',
                  'bio', 'fav_sport_1', 'fav_sport_2', 'fav_sport_3',
                  'location')