from rest_framework import serializers
from eventposts.models import EventPost, Post, EquipmentPost


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPost
        fields = "__all__"


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentPost
        fields = "__all__"
