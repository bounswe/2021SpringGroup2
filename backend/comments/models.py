from django.db import models
from django.db import models
from authentication.models import User
from eventposts.models import EventPost,Post
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField



class Comment(models.Model):
    eventid=models.ForeignKey(EventPost, on_delete=models.CASCADE)

    comment = models.TextField(default="")
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    creationDate=models.DateTimeField( default=timezone.now)




class Answer(models.Model):
    commentid=models.ForeignKey(Comment, on_delete=models.CASCADE)
    answer = models.TextField(default="")
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    creationDate = models.DateTimeField( default=timezone.now)




# Create your models here.
