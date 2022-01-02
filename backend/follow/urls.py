from django.urls import path
from . import views
from rest_framework.routers import SimpleRouter


router = SimpleRouter()
router.register(r'follow', views.FollowViewSet)
urlpatterns = router.urls
