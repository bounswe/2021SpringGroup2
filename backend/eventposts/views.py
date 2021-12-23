from eventposts.models import EventPost, Post
from authentication.models import User
from eventposts.serializers import EventSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, F, Func, IntegerField


class EventPostsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class EventViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    authentication_classes = [JWTAuthentication]
    pagination_class = EventPostsPagination
    queryset = EventPost.objects.all()
    serializer_class = EventSerializer
    JWTauth = JWTAuthentication()
    lookup_field = "id"

    def wrap(self, request, data):
        response = \
            {"@context": "https://www.w3.org/ns/activitystreams", "summary": str(request.user) + " created an event",
             "type": "Create",
             "actor": {"type": "Person", "name": str(request.user)}, "object": {"type": "Event",
                                                                                "name": "A Simple Event",
                                                                                "postId": data["id"],
                                                                                "ownerId": data["owner"],
                                                                                "content": data["content"],
                                                                                "title": data["title"],
                                                                                "creationDate": data["creation_date"],
                                                                                "numberOfClicks": 0,
                                                                                "location": {
                                                                                    "name": data["location"],
                                                                                    "type": "Place",
                                                                                    "longitude": data["longitude"],
                                                                                    "latitude": data["latitude"],
                                                                                    "units": "m"
                                                                                }, "eventDate": data["date"],
             "eventSport": data["sport"], "eventMinAge": data["min_age"], "eventMaxAge": data["max_age"],
             "eventMinSkillLevel": data["min_skill_level"], "eventMaxSkillLevel": data["max_skill_level"],
             "eventPlayerCapacity": data["player_capacity"], "eventSpectatorCapacity": data["spec_capacity"],
             "eventApplicants": data["applicants"], "eventPlayers": data["players"]}}

        return response

    def authenticate(self):
        user, _ = self.JWTauth.authenticate(self.request)
        return user.id == self.request.data["owner"]

    def get_queryset(self):
        queryset = EventPost.objects.all()

        # get all parameters for search
        query = self.request.query_params.get('query')

        min_player_capacity = self.request.query_params.get('min_player_capacity')
        max_player_capacity = self.request.query_params.get('max_player_capacity')

        min_spec_capacity = self.request.query_params.get('min_spectator_capacity')
        max_spec_capacity = self.request.query_params.get('max_spectator_capacity')

        min_players = self.request.query_params.get('min_players')
        max_players = self.request.query_params.get('max_players')

        min_specs = self.request.query_params.get('min_spectators')
        max_specs = self.request.query_params.get('max_spectators')

        location = self.request.query_params.get('location')

        min_date = self.request.query_params.get('min_date')
        max_date = self.request.query_params.get('max_date')

        min_duration = self.request.query_params.get('min_duration')
        max_duration = self.request.query_params.get('max_duration')

        sport = self.request.query_params.get('sport')

        owner_id = self.request.query_params.get('owner')

        min_age = self.request.query_params.get('min_age')
        max_age = self.request.query_params.get('max_age')

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

        # filter by player capacity
        if min_player_capacity is not None:
            queryset = queryset.filter(player_capacity__gte=min_player_capacity)
        if max_player_capacity is not None:
            queryset = queryset.filter(player_capacity__lte=max_player_capacity)

        # filter by number of players registered to event
        if min_players is not None:
            queryset = queryset.annotate(player_len=Func(F('players'),
                                                         1, function='array_length',
                                                         output_field=IntegerField())).filter(
                player_len__gte=min_players)

        if max_players is not None:
            queryset = queryset.annotate(player_len=Func(F('players'),
                                                         1, function='array_length',
                                                         output_field=IntegerField())).filter(
                player_len__lte=max_players)

        # filter by spectator capacity
        if min_spec_capacity is not None:
            queryset = queryset.filter(spec_capacity__gte=min_spec_capacity)
        if max_spec_capacity is not None:
            queryset = queryset.filter(spec_capacity__lte=max_spec_capacity)

        # filter by number of spectators registered to event
        if min_specs is not None:
            queryset = queryset.annotate(spec_len=Func(F('spectators'),
                                                       1, function='array_length',
                                                       output_field=IntegerField())).filter(
                spec_len__gte=min_specs)
        if max_specs is not None:
            queryset = queryset.annotate(spec_len=Func(F('spectators'), 1, function='array_length',
                                                       output_field=IntegerField())).filter(spec_len__lte=max_specs)

        # filter by name of the location
        if location is not None:
            queryset = queryset.filter(Q(location__icontains=location))

        # filter by event date
        if min_date is not None:
            queryset = queryset.filter(date__gte=min_date)
        if max_date is not None:
            queryset = queryset.filter(date__lte=max_date)

        # filter by duration of the event
        if min_duration is not None:
            queryset = queryset.filter(duration__gte=min_duration)
        if max_duration is not None:
            queryset = queryset.filter(duration__lte=max_duration)

        # filter by sport category
        if sport is not None:
            queryset = queryset.filter(sport=sport)

        # filter by owner of the event
        if owner_id is not None:
            queryset = queryset.filter(owner=User.objects.get(id=owner_id))

        # filter by age interval
        if min_age is not None:
            queryset = queryset.filter(min_age__gte=min_age)
        if max_age is not None:
            queryset = queryset.filter(max_age__lte=max_age)

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
