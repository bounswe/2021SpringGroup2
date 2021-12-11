
from django.urls import path
from . import views

urlpatterns = [

    #path('<int:postid>/comments/<int:commentid>', views.GetCommentById.as_view(), name="GetCommentById"),
    path('<int:id>/comments/', views.Comments.as_view(), name="AllComments"),
    #path('api/posts/<post_id>/comments/<comment_id>/answers', views.Answers.as_view(), name="AllAnswers"),
]
