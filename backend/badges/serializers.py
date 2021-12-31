from rest_framework import serializers
from badges.models import Badge, BadgeRecord


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = "__all__"

class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = BadgeRecord
        fields = "event"