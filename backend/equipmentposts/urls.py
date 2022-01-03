from rest_framework_extensions.routers import ExtendedSimpleRouter
from .views import EquipmentViewSet, CommentViewSet, AnswerViewSet
router = ExtendedSimpleRouter()
(
    router.register(r'equipments', EquipmentViewSet, basename='equipments')
          .register(r'comments',
                    CommentViewSet,
                    basename='posts-comment',
                    parents_query_lookups=['parent_equipment_id'])
          .register(r'answers',
                    AnswerViewSet,
                    basename='posts-comments-answer',
                    parents_query_lookups=['parent_comment_id__parent_equipment_id', 'parent_comment_id'])
)
urlpatterns = router.urls
