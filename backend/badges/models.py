from django.db import models

# Create your models here.


class Badge(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField("")
    icon = models.TextField(default="")