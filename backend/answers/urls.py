from django.urls import path
from . import views


urlpatterns = [
    path('<int:id>/answers/', views.Answers.as_view(), name="AllAnswers"),
]
