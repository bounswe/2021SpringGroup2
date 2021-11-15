from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.db import models
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

    email_plaintext_message = "Here's your token: {}".format(reset_password_token.key)

    send_mail(
        # title:
        "Password Reset for {title}".format(title="Rebound"),
        # message:
        email_plaintext_message,
        # from:
        "Rebound App",
        # to:
        [reset_password_token.user.email]
    )

class User(AbstractUser):
    bio = models.TextField(default="")

    birthday = models.DateTimeField(auto_now_add=True, blank=True)

    avatar = models.TextField(default="")
    location = models.TextField(default="")

    fav_sport_1 = models.TextField(default="")
    fav_sport_2 = models.TextField(default="")
    fav_sport_3 = models.TextField(default="")

    badge_1 = models.TextField(default="")
    badge_2 = models.TextField(default="")
    badge_3 = models.TextField(default="")

    privacy = models.BooleanField(default=True)

    class Meta:
        app_label = 'authentication'
