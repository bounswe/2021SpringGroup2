from django.urls import path
from . import views

urlpatterns=[
    
    path('<int:id>/', views.EventView.as_view(), name="EventView"),
    path('create/', views.EventCreateView.as_view(), name="EventCreate"),
]