import datetime
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.dispatch import receiver
from django.db import models
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext_lazy as _


def empty_list():
    return list([])


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
    username_validator = RegexValidator(regex=r'^\w*\D\w*\Z', message='Enter a valid username. This value may contain only '
                                                                 'letters, numbers, and underscores and may not be '
                                                                 'entirely numeric.')
    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and _ only, not entirely numeric.'),
        validators=[username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )

    bio = models.TextField(default="")

    birthday = models.DateField(default=datetime.date(datetime.date.today().year - 18,
                                                      datetime.date.today().month, datetime.date.today().day), blank=True)

    avatar = models.TextField(default="")
    location = models.TextField(default="")

    fav_sport_1 = models.TextField(default="")
    fav_sport_2 = models.TextField(default="")
    fav_sport_3 = models.TextField(default="")

    badges = ArrayField(models.CharField(max_length=30), default=empty_list)

    followings = models.ManyToManyField('self')
    followers = models.ManyToManyField('self')
    blocked = models.ManyToManyField('self')
    blocked_by = models.ManyToManyField('self')

    privacy = models.BooleanField(default=False)

    email = models.EmailField(_('email address'), blank=True, unique=True, error_messages={
            'unique': _("A user with that email address already exists."),
        },)

    class Meta:
        app_label = 'authentication'
