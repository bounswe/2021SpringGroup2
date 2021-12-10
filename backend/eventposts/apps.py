from django.apps import AppConfig


class EventpostsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'eventposts'
    def ready(self):
        from actstream import registry
        registry.register(self.get_model('EventPost'))