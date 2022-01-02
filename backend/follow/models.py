from django.db import models
from authentication.models import User
from datetime import datetime


class Follow(models.Model):
    following_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_follower")
    followed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_following")
    followed_date = models.DateTimeField(default=datetime.now())
