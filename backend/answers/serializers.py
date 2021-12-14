from comments.serializers import PostSerializer, CommentSerializer
from .models import Answer


class AnswerSerializer(PostSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
        