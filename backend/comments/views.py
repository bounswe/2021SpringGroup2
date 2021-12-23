from django.shortcuts import render
from rest_framework import generics
from .models import Comment, Answer, Post
from eventposts.models import EventPost
from .serializers import CommentSerializer, AnswerSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.views import APIView
from django.forms.models import model_to_dict
from django.utils import timezone



class GetCommentById(APIView):

    def get (self,request,postid,commentid):
        try:
            comments=Comment.objects.filter(eventid=postid,id=commentid)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if(len(comments)==0):
            return Response(status=status.HTTP_404_NOT_FOUND)
        commentserializer = CommentSerializer(comments, many=True)
        object = {"type": "Comment", "postId": comments[0].eventid.id, "ownerId": comments[0].owner.id, "content": comments[0].comment,
                  "creationDate": comments[0].creationDate}     #timezone.now()}

        response = {"@context": "https://www.w3.org/ns/activitystreams",
                    "summary": comments[0].owner.username + " created a comment",
                    "type":"Create",
                    "actor":{"type":"Person","name":comments[0].owner.username } }
        response["object"] = object
        return Response(response)


class Comments(APIView):
    def get(self, request,id):

        try:
            comments = Comment.objects.filter(eventid=id)

        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        commentserializer = CommentSerializer(comments, many=True)
        listItems=[]

        for comment in comments:

            objectValue="/api/posts/"+str(id)+"/comments/"+str(comment.id)
            listItem={"type":"Create","actor":{"type":"Person","name":comment.owner.username},"object":objectValue}

            listItems.append(listItem)

        response= {"@context": "https://www.w3.org/ns/activitystreams", "summary": "Object History",
             "type": "Collection","totalItems":len(comments)}
        response["items"]=listItems
        return Response(response)

    def post(self, request, id):
        try:
            EventPost.objects.get(id=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        body = {}

        body["eventid"]=id


        body["comment"]=request.data["content"]

        body["owner"]=request.data["ownerId"]



        try:
            commentSerializer=CommentSerializer(data=body)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if commentSerializer.is_valid():

            commentSerializer.save()
            object= {"type":"Comment","postId":id,"ownerId":request.data["ownerId"],"content":body["comment"],"creationDate":timezone.now()}
            response = {"@context": "https://www.w3.org/ns/activitystreams", "summary":commentSerializer.validated_data["owner"].username+ " created a comment",
            "type": "Create", "actor":{"type":"Person","name":commentSerializer.validated_data["owner"].username } }
            response["object"]=object
            return Response(response)

        return Response(status=status.HTTP_400_BAD_REQUEST)







