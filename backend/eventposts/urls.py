from rest_framework_extensions.routers import ExtendedSimpleRouter
from .views import EventViewSet, CommentViewSet, AnswerViewSet
router = ExtendedSimpleRouter()
(
    router.register(r'posts', EventViewSet, basename='posts')
          .register(r'comments',
                    CommentViewSet,
                    basename='posts-comment',
                    parents_query_lookups=['parent_post_id'])
          .register(r'answers',
                    AnswerViewSet,
                    basename='posts-comments-answer',
                    parents_query_lookups=['parent_comment_id__parent_post_id', 'parent_comment_id'])
)
urlpatterns = router.urls
