from rest_framework import serializers
from eventposts.models import EventPost, Comment, Answer


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPost
        fields = "__all__"


class SimpleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPost
        fields = ["id", "title", "sport", "date"]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ["parent_post", "owner", "created_date"]


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"
        read_only_fields = ["parent_comment", "owner", "created_date"]
