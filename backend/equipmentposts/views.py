from equipmentposts.models import EquipmentPost
from authentication.models import User
from equipmentposts.serializers import EquipmentSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, F, Func, IntegerField
from datetime import datetime
# Create your views here.

class EquipmentPostsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

class EquipmentViewSet(viewsets.ModelViewSet):
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

        min_skill = self.request.query_params.get('min_skill_level')
        max_skill = self.request.query_params.get('max_skill_level')

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
            queryset = queryset.filter(date__gte=min_date)
        if max_date is not None:
            queryset = queryset.filter(date__lte=max_date)

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

        # filter by skill levels
        if min_skill is not None:
            queryset = queryset.filter(min_skill_level__gte=min_skill)
        if max_skill is not None:
            queryset = queryset.filter(max_skill_level__lte=max_skill)

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