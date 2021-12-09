from django.urls import path
from . import views
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'events', views.EventViewSet)
urlpatterns = router.urls