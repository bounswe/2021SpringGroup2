from django.db import models
from authentication.models import User


class FollowRecord(models.Model):
    following_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_following")
    followed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_followed")
    follow_date = models.DateTimeField(auto_now_add=True)


class BlockRecord(models.Model):
    blocking_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_blocking")
    blocked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_blocked")
    block_date = models.DateTimeField(auto_now_add=True)
