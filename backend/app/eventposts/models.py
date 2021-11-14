from django.db import models


class User(models.Model):

    id = models.BigAutoField(primary_key=True)

    username = models.TextField()
    email = models.TextField()
    password = models.CharField(max_length=64)

    first_name = models.TextField()
    last_name = models.TextField()
    bio = models.TextField()

    birthday = models.DateTimeField()

    avatar = models.TextField()
    location = models.TextField()

    fav_sport_1 = models.TextField()
    fav_sport_2 = models.TextField()
    fav_sport_3 = models.TextField()

    badge_1 = models.TextField()
    badge_2 = models.TextField()
    badge_3 = models.TextField()

    privacy = models.BooleanField()


class Post(models.Model):

    id = models.BigAutoField(primary_key=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    content = models.TextField()
    title = models.TextField()

    creation_date = models.DateTimeField()
    location = models.TextField()

    class Meta:
        abstract = True


class EventPost(Post):
    date = models.DateTimeField()
    duration = models.TimeField()

    sport = models.CharField(max_length=30)
    age_group = models.IntegerField()

    player_capacity = models.IntegerField()
    spec_capacity = models.IntegerField()
    players = models.IntegerField()
    spectators = models.IntegerField()

    skill_level = models.TextChoices('skill_level', 'Beginner Preintermediate Intermediate Advanced Expert')

    latitude = models.FloatField()
    longitude = models.FloatField()