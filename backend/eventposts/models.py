from django.db import models
from authentication.models import User
from django.contrib.postgres.fields import ArrayField
from datetime import datetime


def empty_list():
    return list([])


class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    content = models.TextField()
    title = models.TextField()

    creation_date = models.DateTimeField(default=datetime.now())
    location = models.TextField()

    min_skill_level = models.IntegerField(default=0)
    max_skill_level = models.IntegerField(default=0)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    sport = models.CharField(max_length=30)

    class Meta:
        abstract = True


class EquipmentPost(Post):
    equipment_type = models.TextField()
    url = models.TextField(default="")


class EventPost(Post):
    event_start = models.DateTimeField()
    event_end = models.DateTimeField()

    min_age = models.IntegerField(default=18)
    max_age = models.IntegerField(default=75)

    player_capacity = models.IntegerField(default=10)
    spec_capacity = models.IntegerField(default=0)
    players = ArrayField(models.IntegerField(), default=empty_list)
    player_applicants = ArrayField(models.IntegerField(), default=empty_list)
    spec_applicants = ArrayField(models.IntegerField(), default=empty_list)
    spectators = ArrayField(models.IntegerField(), default=empty_list)
