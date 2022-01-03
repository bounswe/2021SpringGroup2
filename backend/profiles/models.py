from django.db import models
from authentication.models import User
from datetime import datetime


class FollowRecord(models.Model):
    following_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_following")
    followed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_followed")
    follow_date = models.DateTimeField(default=datetime.now())


class UnfollowRecord(models.Model):
    unfollowing_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_unfollowing")
    unfollowed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_unfollowed")
    unfollow_date = models.DateTimeField(default=datetime.now())


class BlockRecord(models.Model):
    blocking_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_blocking")
    blocked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_blocked")
    block_date = models.DateTimeField(default=datetime.now())


class UnblockRecord(models.Model):
    unblocking_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_unblocking")
    unblocked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_unblocked")
    unblock_date = models.DateTimeField(default=datetime.now())
