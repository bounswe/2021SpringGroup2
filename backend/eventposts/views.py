from rest_framework import generics
from .models import EventPost, Post
from .serializers import EventSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets


class EventViewSet(viewsets.ModelViewSet):
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
                                                                                }}, "eventDate": data["date"],
             "eventSport": data["sport"], "eventMinAge": data["min_age"], "eventMaxAge": data["max_age"],
             "eventMinSkillLevel": data["min_skill_level"], "eventMaxSkillLevel": data["max_skill_level"],
             "eventPlayerCapacity": data["player_capacity"], "eventSpectatorCapacity": data["spec_capacity"],
             "eventApplicants": [], "eventPlayers": [data["owner"]] if len(data["players"]) == 0 else data["players"]}

        return response


    def authenticate(self):
        user, _ = self.JWTauth.authenticate(self.request)
        return user.id == self.request.data["owner"]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(self.wrap(request, serializer.data))

    def create(self, request, *args, **kwargs):
        if self.authenticate():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            serializer.save(players=[request.data["owner"]])
            headers = self.get_success_headers(serializer.data)
            return Response(self.wrap(request, serializer.data), status=status.HTTP_201_CREATED, headers=headers)
        else:
            return JsonResponse(status=401, data={'detail': 'Unauthorized.'})
