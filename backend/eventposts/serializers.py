from rest_framework import serializers
from .models import EventPost, Post

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPost
        fields = "__all__"