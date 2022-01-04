from django.contrib import admin

# Register your models here.
from .models import  EventPost, User

admin.site.register(User)


admin.site.register(EventPost)
