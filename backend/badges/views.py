from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from badges.models import Badge
from badges.serializers import BadgeSerializer
from rest_framework.response import Response


class BadgeViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    authentication_classes = [JWTAuthentication]
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    lookup_field = 'name'
    JWTauth = JWTAuthentication()

    def wrap_all(self, objects):
        response = \
            {
                "@context": "https://www.w3.org/ns/activitystreams",
                "summary": "Badge list",
                "type": "Collection",
                "totalItems": len(objects),
                "items": objects
            }

        return response

    def wrap(self, request, data):
        response = \
            {
                "@context": data["url"],
                "type": "Badge",
                "name": data["name"],
                "content": data["description"],
                "icon":
                    {
                        "type": "Image",
                        "content": data["icon"]
                    }
            }

        return response

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(self.wrap(request, serializer.data))

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        objects = []

        for data in serializer.data:
            objects.append(self.wrap(request, data))

        return Response(self.wrap_all(objects))
