from django.db import models
from eventposts.models import Post
# Create your models here.


class EquipmentPost(Post):
    url = models.TextField(default="")
    equipment_type = models.TextField()