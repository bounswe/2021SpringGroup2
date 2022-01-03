from django.db import models
from eventposts.models import Post
from authentication.models import User
from datetime import datetime

# Create your models here.


class EquipmentPost(Post):
    url = models.TextField(default="")
    equipment_type = models.TextField()

    class Meta:
        app_label = 'equipmentposts'


class Comment(models.Model):
    parent_equipment = models.ForeignKey(EquipmentPost, on_delete=models.CASCADE)
    content = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="equipment_comment")
    created_date = models.DateTimeField(default=datetime.now())


class Answer(models.Model):
    parent_comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    content = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="equipment_answer")
    created_date = models.DateTimeField(default=datetime.now())
