from rest_framework import serializers
from .models import Comment,Answer, Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class CommentSerializer(PostSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class AnswerSerializer(PostSerializer):
    class Meta:
        model = Answer
        fields = '__all__'