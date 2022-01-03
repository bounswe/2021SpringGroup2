from rest_framework_extensions.mixins import NestedViewSetMixin

from eventposts.models import EventPost, Comment, Answer
from authentication.models import User
from eventposts.serializers import EventSerializer, CommentSerializer, AnswerSerializer
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


class EventPostsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class EventViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    authentication_classes = [JWTAuthentication]
    pagination_class = EventPostsPagination
    queryset = EventPost.objects.all()
    serializer_class = EventSerializer
    JWTauth = JWTAuthentication()
    lookup_field = "id"

    def wrap(self, request, data):
        queryset = User.objects
        owner = queryset.filter(id=data["owner"]).get().username
        response = \
            {"@context": "https://www.w3.org/ns/activitystreams", "summary": owner + " created an event",
             "type": "Create",
             "actor": {"type": "Person", "name": owner}, "object": {"type": "Event",
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
             "eventApplicantsAsPlayer": data["player_applicants"],
             "eventApplicantsAsSpectator": data["spec_applicants"], "eventPlayers": data["players"]}}

        return response

    def authenticate(self):
        user, _ = self.JWTauth.authenticate(self.request)
        return user.id == int(self.request.data["owner"])

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

    @action(detail=True, methods=['post'])
    def apply(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        event_id = kwargs['id']
        applicant_type = request.data.get('type')

        if user_id is not None:
            applicant = User.objects.get(id=user_id)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'user_id is not provided.'})

        if event_id is not None:
            event = EventPost.objects.get(id=event_id)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'id is not provided.'})

        if applicant_type == 'spectator':

            if len(event.spectators) == event.spec_capacity:
                return Response(status=status.HTTP_409_CONFLICT, data={'detail': 'the event has reached its capacity for spectators.'})

            event.spec_applicants.append(user_id)

        elif applicant_type == 'player':

            if len(event.players) == event.player_capacity:
                return Response(status=status.HTTP_409_CONFLICT,
                                    data={'detail': 'the event has reached its capacity for players.'})

            applicant_age = divmod((datetime.now().date() - applicant.birthday).total_seconds(), 365*24*60*60)[0]
            if not (event.min_age <= applicant_age <= event.max_age):
                return Response(status=status.HTTP_409_CONFLICT,
                                data={'detail': 'Applicant age is not appropriate for this event.'})

            event.player_applicants.append(user_id)

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'wrong applicant type.'})

        event.save()

        instance = self.get_object()
        serializer = self.get_serializer(instance)
        response = self.wrap(request, serializer.data)

        response['summary'] = str(user_id) + " applied to event " + str(event_id) + " as " + str(applicant_type)
        response['type'] = "Join"

        return Response(response, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get', 'post'])
    def applicants(self, request, *args, **kwargs):

        event_id = kwargs['id']

        if request.method == 'GET':
            type = request.query_params.get('type')
        else:
            type = request.data.get('type')

        if event_id is not None:
            event = EventPost.objects.get(id=event_id)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'id is not provided.'})

        if type not in ['player', 'spectator']:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'detail': 'applicant type is not provided or is incorrect type.'})

        if request.method == 'GET':
            applicants = event.player_applicants if type == 'player' else event.spec_applicants
            return Response(status=status.HTTP_200_OK, data={'applicants': applicants})
        elif request.method == 'POST':
            if not self.authenticate():
                return JsonResponse(status=401, data={'detail': 'Unauthorized.'})

            user_id = int(request.data.get('user'))
            accept = request.data.get('accept')

            if user_id is None:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'user is not provided.'})

            if accept is None:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'accept status is not provided.'})
            elif accept == 'True':
                accept = True
            elif accept == 'False':
                accept = False

            # if user applied as spectator, remove it from spec_applicant and insert to spectators
            if user_id in event.spec_applicants:

                if len(event.spectators) == event.spec_capacity and accept:
                    return Response(status=status.HTTP_409_CONFLICT,
                                    data={'detail': 'the event has reached its capacity for spectators.'})

                event.spec_applicants.remove(user_id)
                if accept:
                    event.spectators.append(user_id)
                event.save()

            # if user applied as player, remove it from player_applicant and insert to players
            elif user_id in event.player_applicants:

                if len(event.players) == event.player_capacity and accept:
                    return Response(status=status.HTTP_409_CONFLICT,
                                    data={'detail': 'the event has reached its capacity for players.'})

                event.player_applicants.remove(user_id)
                if accept:
                    event.players.append(user_id)
                event.save()

            else:
                return Response(status=status.HTTP_409_CONFLICT,
                                    data={'detail': 'there is no such an applicant for this event.'})

            instance = self.get_object()
            serializer = self.get_serializer(instance)
            response = self.wrap(request, serializer.data)

            response['actor']['name'] = str(user_id)

            if accept:
                response['summary'] = f"{str(event.owner.id)} accepted {str(user_id)} to event {str(event_id)} as " \
                                      f"{str(type)}"
                response['type'] = "Accept"
            else:
                response['summary'] = f"{str(event.owner.id)} rejected {str(user_id)} from event {str(event_id)} " \
                                      f"as {str(type)}"
                response['type'] = "Reject"

            return Response(response, status=status.HTTP_200_OK)
        else:
            return JsonResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)


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
                        "postId": data["post_id"],
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
                "post_id": self.kwargs["parent_lookup_parent_post_id"],
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
                "post_id": serializer.data["parent_post"],
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
                    "post_id": item["parent_post"],
                    "owner_id": owner_id,
                    "content": item["content"],
                    "creation_date": item["created_date"],
                    "id": item["id"]
                }
            objects.append(self.wrap(data))

        return Response(self.wrap_all(objects))

    def perform_create(self, serializer):
        serializer.save(parent_post_id=self.kwargs["parent_lookup_parent_post_id"], owner=self.request.user)


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
                        "postId": data["post_id"],
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
                "post_id": self.kwargs["parent_lookup_parent_comment_id__parent_post_id"],
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
        post_id = Comment.objects.get(id=serializer.data["parent_comment"]).id
        data =\
            {
                "owner_username": owner_username,
                "comment_id": serializer.data["parent_comment"],
                "post_id": post_id,
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
            post_id = Comment.objects.get(id=item["parent_comment"]).id
            data = \
                {
                    "owner_username": owner_username,
                    "comment_id": item["parent_comment"],
                    "post_id": post_id,
                    "owner_id": owner_id,
                    "content": item["content"],
                    "creation_date": item["created_date"],
                    "id": item["id"]
                }
            objects.append(self.wrap(data))

        return Response(self.wrap_all(objects))

    def perform_create(self, serializer):
        serializer.save(parent_comment_id=self.kwargs["parent_lookup_parent_comment_id"], owner=self.request.user)


