from django.urls import path
from . import views

urlpatterns = [
    path('<int:id>/', views.ProfileView.as_view(), name="EventPost"),
]