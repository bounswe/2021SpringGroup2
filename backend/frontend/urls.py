from django.urls import path, re_path
from . import views


urlpatterns = [
    path('', views.index ),
    # match the root
    re_path(r'^$', views.index),
    # match all other pages
    re_path(r'^(?:.*)/?$', views.index),
    re_path(r'^(?:.*)/(?:.*)/?$', views.index),
]
