#from typing import ValuesView
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import EventPost, Post
from .serializers import EventPostSerializer, PostSerializer
from rest_framework.views import APIView
from django.forms.models import model_to_dict





class EventPostView(APIView):
    
    def get(self, request, id):                
        try:           
            eventpost = EventPost.objects.get(id=id)
        except:  
            return Response(status=status.HTTP_204_NO_CONTENT)     
        return Response(EventPostSerializer(eventpost).data)

class EventPostViewAll(APIView):
    
    def get(self, request):                
        try:          
            eventpost = EventPost.objects.all()
        except:     
            return Response(status=status.HTTP_204_NO_CONTENT)
        eventserializer=EventPostSerializer(eventpost,many=True)
        
        return Response(eventserializer.data)


class EventPostPostView(APIView):

    def post(self, request):
        serializer = EventPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       
         
     

    
    





