from django.apps import AppConfig
from actstream import registry


class EventpostsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'eventposts'
    def ready(self):
        registry.register(self.get_model('EventPost'))