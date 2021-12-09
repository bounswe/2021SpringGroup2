from django.db import models
from authentication.models import User
from django.contrib.postgres.fields import ArrayField

def empty_list():
    return list([])

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
    duration = models.IntegerField(default=60)

    sport = models.CharField(max_length=30)
    min_age = models.IntegerField(default=18)
    max_age = models.IntegerField(default=75)

    player_capacity = models.IntegerField(default=10)
    spec_capacity = models.IntegerField(default=0)
    players = ArrayField(models.IntegerField(), default=empty_list)
    applicants = ArrayField(models.IntegerField(), default=empty_list)
    spectators = ArrayField(models.IntegerField(), default=empty_list)

    min_skill_level = models.IntegerField(default=0)
    max_skill_level = models.IntegerField(default=0)

    latitude = models.FloatField(default=1.0)
    longitude = models.FloatField(default=1.0)