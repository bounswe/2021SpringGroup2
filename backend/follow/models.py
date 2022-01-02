from django.db import models

class Follow(models.Model):
    # details will be added in later commits
    followingId = models.CharField()
    followerId = models.CharField()
    followingDate = models.DateField()
