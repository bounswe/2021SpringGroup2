from django.urls import path
from . import views
from django.contrib import admin
urlpatterns=[
    
    path('<int:id>/', views.EventPostView.as_view(), name="EventPost"),
    path('all/', views.EventPostViewAll.as_view(), name="EventPostAll"),
    path('', views.EventPostPostView.as_view(), name="EventPostPost"),
]