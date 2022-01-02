from rest_framework_extensions.mixins import NestedViewSetMixin

from equipmentposts.models import EquipmentPost, Comment, Answer
from authentication.models import User
from equipmentposts.serializers import EquipmentSerializer, CommentSerializer, AnswerSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q


class EquipmentPostsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class EquipmentViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    authentication_classes = [JWTAuthentication]
    pagination_class = EquipmentPostsPagination
    queryset = EquipmentPost.objects.all()
    serializer_class = EquipmentSerializer
    JWTauth = JWTAuthentication()
    lookup_field = "id"

    def wrap(self, request, data):
        queryset = User.objects
        owner = queryset.filter(id=data["owner"]).get().username
        response = \
            {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": owner + " posted an equipment",
                "type": "Create",
                "actor":
                    {
                    "type": "Person",
                    "name": owner
                    },
                "object":
                    {
                        "type": "Equipment",
                        "postId": data["id"],
                        "ownerId": data["owner"],
                        "content": data["content"],
                        "title": data["title"],
                        "creationDate": data["creation_date"],
                        "numberOfClicks": 0,
                        "location":
                            {
                            "name": data["location"],
                            "type": "Place",
                            "longitude": data["longitude"],
                            "latitude": data["latitude"],
                            "units": "m"
                            },
                        "url": data["url"],
                        "sport": data["sport"],
                        "equipmentMinSkillLevel": data[
                            "min_skill_level"],
                        "equipmentMaxSkillLevel": data[
                            "max_skill_level"],
                        "equipmentType": data["equipment_type"]
                    }
            }

        return response

    def authenticate(self):
        user, _ = self.JWTauth.authenticate(self.request)
        return user.id == int(self.request.data["owner"])

    def get_queryset(self):
        queryset = EquipmentPost.objects.all()

        # get all parameters for search
        query = self.request.query_params.get('query')

        location = self.request.query_params.get('location')


        sport = self.request.query_params.get('sport')

        owner_id = self.request.query_params.get('owner')

        equipment_type = self.request.query_params.get('equipment_type')

        min_latitude = self.request.query_params.get('min_latitude')
        max_latitude = self.request.query_params.get('max_latitude')
        min_longitude = self.request.query_params.get('min_longitude')
        max_longitude = self.request.query_params.get('max_longitude')

        min_creation_date = self.request.query_params.get('min_creation_date')
        max_creation_date = self.request.query_params.get('max_creation_date')

        # filter by query by searching in both title and description
        if query is not None:
            queryset = queryset.filter(Q(title__icontains=query) | Q(content__icontains=query))

        # filter by name of the location
        if location is not None:
            queryset = queryset.filter(Q(location__icontains=location))

        if equipment_type is not None:
            queryset = queryset.filter(Q(equipment_type__icontains=equipment_type))

        # filter by event date

        # filter by sport category
        if sport is not None:
            queryset = queryset.filter(sport=sport)

        # filter by owner of the event
        if owner_id is not None:
            queryset = queryset.filter(owner=User.objects.get(id=owner_id))

        # filter by coordinates whether the locations are inside the rectangle
        if min_latitude is not None and max_latitude is not None:
            queryset = queryset.filter(Q(latitude__lte=max_latitude) & Q(latitude__gte=min_latitude))
        if min_longitude is not None and max_longitude is not None:
            queryset = queryset.filter(Q(longitude__lte=max_longitude) & Q(longitude__gte=min_longitude))

        # filter by creation date
        if min_creation_date is not None:
            queryset = queryset.filter(creation_date__gte=min_creation_date)
        if max_creation_date is not None:
            queryset = queryset.filter(creation_date__lte=max_creation_date)

        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(self.wrap(request, serializer.data))

    def create(self, request, *args, **kwargs):
        if self.authenticate():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(self.wrap(request, serializer.data), status=status.HTTP_201_CREATED, headers=headers)
        else:
            return JsonResponse(status=401, data={'detail': 'Unauthorized.'})


class CommentViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    authentication_classes = [JWTAuthentication]
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = 'id'

    def wrap(self, data):
        response = \
            {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": data["owner_username"] + " created a comment",
                "type": "Create",
                "actor": {
                    "type": "Person",
                    "name": data["owner_username"]
                },
                "object":
                    {
                        "type": "Comment",
                        "equipmentId": data["equipment_id"],
                        "id": data["id"],
                        "ownerId": data["owner_id"],
                        "content": data["content"],
                        "creationDate": data["creation_date"]
                    }
            }

        return response

    def wrap_all(self, objects):
        response = \
            {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": "Object history",
                "type": "Collection",
                "totalItems": len(objects),
                "items": objects
            }

        return response

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data =\
            {
                "owner_username": self.request.user.username,
                "equipment_id": self.kwargs["parent_lookup_parent_equipment_id"],
                "owner_id": self.request.user.id,
                "content": serializer.data["content"],
                "creation_date": serializer.data["created_date"],
                "id": serializer.data["id"]
            }
        return Response(self.wrap(data), status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        owner_id = serializer.data["owner"]
        owner_username = User.objects.get(id=owner_id).username
        data =\
            {
                "owner_username": owner_username,
                "equipment_id": serializer.data["parent_equipment"],
                "owner_id": owner_id,
                "content": serializer.data["content"],
                "creation_date": serializer.data["created_date"],
                "id": serializer.data["id"]
            }
        return Response(self.wrap(data))

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        objects = []

        for item in serializer.data:
            owner_id = item["owner"]
            owner_username = User.objects.get(id=owner_id).username
            data = \
                {
                    "owner_username": owner_username,
                    "equipment_id": item["parent_equipment"],
                    "owner_id": owner_id,
                    "content": item["content"],
                    "creation_date": item["created_date"],
                    "id": item["id"]
                }
            objects.append(self.wrap(data))

        return Response(self.wrap_all(objects))

    def perform_create(self, serializer):
        serializer.save(parent_equipment_id=self.kwargs["parent_lookup_parent_equipment_id"], owner=self.request.user)


class AnswerViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    authentication_classes = [JWTAuthentication]
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    lookup_field = 'id'

    def wrap(self, data):
        response = \
            {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": data["owner_username"] + " created an answer",
                "type": "Create",
                "actor": {
                    "type": "Person",
                    "name": data["owner_username"]
                },
                "object":
                    {
                        "type": "Answer",
                        "commentId": data["comment_id"],
                        "equipmentId": data["equipment_id"],
                        "id": data["id"],
                        "ownerId": data["owner_id"],
                        "content": data["content"],
                        "creationDate": data["creation_date"]
                    }
            }

        return response

    def wrap_all(self, objects):
        response = \
            {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": "Object history",
                "type": "Collection",
                "totalItems": len(objects),
                "items": objects
            }

        return response

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data =\
            {
                "owner_username": self.request.user.username,
                "equipment_id": self.kwargs["parent_lookup_parent_comment_id__parent_equipment_id"],
                "comment_id": self.kwargs["parent_lookup_parent_comment_id"],
                "owner_id": self.request.user.id,
                "content": serializer.data["content"],
                "creation_date": serializer.data["created_date"],
                "id": serializer.data["id"]
            }
        return Response(self.wrap(data), status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        owner_id = serializer.data["owner"]
        owner_username = User.objects.get(id=owner_id).username
        equipment_id = Comment.objects.get(id=serializer.data["parent_comment"]).id
        data =\
            {
                "owner_username": owner_username,
                "comment_id": serializer.data["parent_comment"],
                "equipment_id": equipment_id,
                "owner_id": owner_id,
                "content": serializer.data["content"],
                "creation_date": serializer.data["created_date"],
                "id": serializer.data["id"]
            }
        return Response(self.wrap(data))

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        objects = []

        for item in serializer.data:
            owner_id = item["owner"]
            owner_username = User.objects.get(id=owner_id).username
            equipment_id = Comment.objects.get(id=item["parent_comment"]).id
            data = \
                {
                    "owner_username": owner_username,
                    "comment_id": item["parent_comment"],
                    "equipment_id": equipment_id,
                    "owner_id": owner_id,
                    "content": item["content"],
                    "creation_date": item["created_date"],
                    "id": item["id"]
                }
            objects.append(self.wrap(data))

        return Response(self.wrap_all(objects))

    def perform_create(self, serializer):
        serializer.save(parent_comment_id=self.kwargs["parent_lookup_parent_comment_id"], owner=self.request.user)
