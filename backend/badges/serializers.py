from rest_framework import serializers
from badges.models import Badge


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = "__all__"