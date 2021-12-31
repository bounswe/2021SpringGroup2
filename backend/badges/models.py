from django.db import models
from authentication.models import User
from eventposts.models import EventPost

# Create your models here.


class Badge(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField()
    icon = models.TextField()
    url = models.TextField()


class BadgeRecord(models.Model):
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    offerer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="badge_offerer")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="badge_receiver")
    event = models.ForeignKey(EventPost, on_delete=models.CASCADE)