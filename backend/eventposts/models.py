from django.db import models
from authentication.models import User

class Post(models.Model):

    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    content = models.TextField(default="")
    title = models.TextField(default="")

    creation_date = models.DateTimeField(auto_now_add=True)
    location = models.TextField(default="")

    class Meta:
        abstract = True


class EventPost(Post):
    date = models.DateTimeField(auto_now_add=True)
    duration = models.TimeField(auto_now_add=True)

    sport = models.CharField(max_length=30)
    age_group = models.IntegerField(default=-1)

    player_capacity = models.IntegerField(default=-1)
    spec_capacity = models.IntegerField(default=-1)
    players = models.IntegerField(default=-1)
    spectators = models.IntegerField(default=-1)

    skill_level = models.TextChoices('skill_level', 'Beginner Preintermediate Intermediate Advanced Expert')

    latitude = models.FloatField(default=-1.0)
    longitude = models.FloatField(default=-1.0)