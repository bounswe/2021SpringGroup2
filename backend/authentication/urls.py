from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from .views import UserCreate

urlpatterns = [
    path('user/create/', UserCreate.as_view(), name="create_user"),
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('password/reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]