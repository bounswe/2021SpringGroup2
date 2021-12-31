from . import views
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'equipments', views.EquipmentViewSet)
urlpatterns = router.urls