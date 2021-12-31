from rest_framework import serializers
from eventposts.models import EventPost, Post

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPost
        fields = "__all__"

class SimpleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPost
        fields = ["id", "title", "sport", "date"]