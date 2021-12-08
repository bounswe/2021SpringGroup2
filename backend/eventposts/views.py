from rest_framework import generics
from .models import EventPost, Post
from .serializers import EventSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response

create_response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "summary": "Sally created an event",
    "type": "Create",
    "actor": {
        "type": "Person",
        "name": "Sally"
    },
    "object": {
        "type": "Event",
        "name": "A Simple Event",
        "postId": "",
        "ownerId": "",
        "content": "",
        "title": "Beginner friendly tennis game",
        "creationDate": "2014-11-31T23:00:00-08:00",
        "lastUpdateDate": "2014-11-31T23:00:00-08:00",
        "numberOfClicks": 0,
        "location": {
            "name": "Etiler Tennis Club",
            "type": "Place",
            "longitude": 12.34,
            "latitude": 56.78,
            "altitude": 90,
            "units": "m"
        },
        "eventDate": "2014-12-31T23 00 00-08 00",
        "eventSport": "Tennis",
        "eventMinAge": 16,
        "eventMaxAge": 18,
        "eventMinSkillLevel": 1,
        "eventMaxSkillLevel": 5,
        "eventPlayerCapacity": 12,
        "eventSpectatorCapacity": 12,
        "eventApplicants": [1, 2, 3],
        "eventPlayers": [1, 2, 3]
    }
}


class EventView(generics.RetrieveAPIView):
    queryset = EventPost.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'id'


class EventCreateView(generics.CreateAPIView):
    queryset = EventPost.objects.all()
    serializer_class = EventSerializer
    JWTauth = JWTAuthentication()

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
             "eventApplicants": [], "eventPlayers": [data["owner"]]}

        return response

    def authenticate(self):
        user, _ = self.JWTauth.authenticate(self.request)
        return user.id == self.request.data["owner"]

    def create(self, request, *args, **kwargs):
        if self.authenticate():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(self.wrap(request, serializer.data), status=status.HTTP_201_CREATED, headers=headers)
        else:
            return JsonResponse(status=401, data={'detail': 'Unauthorized.'})
