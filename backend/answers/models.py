from django.db import models
from comments.models import Comment
from authentication.models import User
from django.utils import timezone


class Answer(models.Model):
    comment_id = models.ForeignKey(Comment, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    answer = models.TextField(default="")
    creationDate = models.DateTimeField( default=timezone.now)
