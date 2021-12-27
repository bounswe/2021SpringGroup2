from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from authentication.models import User
from .serializers import ProfileSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import viewsets, permissions
from rest_framework.response import Response


class ProfileViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    authentication_classes = [JWTAuthentication]
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'username'
    JWTauth = JWTAuthentication()

    def authenticate(self):
        user, _ = self.JWTauth.authenticate(self.request)
        return user.username == self.kwargs['username']

    def update(self, request, *args, **kwargs):
        if self.authenticate():
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                # If 'prefetch_related' has been applied to a queryset, we need to
                # forcibly invalidate the prefetch cache on the instance.
                instance._prefetched_objects_cache = {}

            return Response(serializer.data)
        else:
            return JsonResponse(status=401, data={'detail':'Unauthorized.'})



# class ProfileView(generics.RetrieveAPIView):
#     queryset = User.objects.all()
#     serializer_class = ProfileSerializer
#     lookup_field = 'username'
#
# class ProfileUpdateView(generics.RetrieveUpdateAPIView):
#     queryset = User.objects.all()
#     serializer_class = ProfileUpdateSerializer
#     lookup_field = 'username'
#     JWTauth = JWTAuthentication()
#
#     def authenticate(self):
#         user, _ = self.JWTauth.authenticate(self.request)
#         return user.username == self.kwargs['username']
#
#     def put(self, request, *args, **kwargs):
#         if self.authenticate():
#             return self.update(request, *args, **kwargs)
#         else:
#             return JsonResponse(status=401, data={'detail':'Unauthorized.'})
