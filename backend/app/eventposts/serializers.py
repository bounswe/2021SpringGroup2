from rest_framework import serializers
from .models import EventPost,Post
"""
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPost
        fields = ['date', 'duration', 'sport', 'age_group','player_capacity','spec_capacity']
"""
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class EventPostSerializer(PostSerializer):
    class Meta:
        model = EventPost
        fields = '__all__'