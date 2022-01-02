from rest_framework import serializers
from equipmentposts.models import EquipmentPost, Comment, Answer


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentPost
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ["parent_equipment", "owner", "created_date"]


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"
        read_only_fields = ["parent_comment", "owner", "created_date"]
