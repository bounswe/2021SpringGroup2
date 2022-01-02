from rest_framework import serializers
from follow.models import Follow

class EventSerializer(serializers.ModelSeralizer):
    class Meta:
        model = Follow
        fields = "__all__"
