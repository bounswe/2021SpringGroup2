from django.apps import AppConfig
from actstream import registry


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'
    def ready(self):
        registry.register(self.get_model('User'))