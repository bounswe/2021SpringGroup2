from rest_framework import serializers
from equipmentposts.models import EquipmentPost

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentPost
        fields = "__all__"