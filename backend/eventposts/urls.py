from django.urls import path
from . import views
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'posts', views.EventViewSet)
router.register(r'equipments', views.EquipmentViewSet)
urlpatterns = router.urls