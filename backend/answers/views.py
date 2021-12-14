from django.shortcuts import render
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.answers.models import Answer
from backend.answers.serializers import AnswerSerializer
from backend.comments.models import Comment


class Answers(APIView):
    def get(self, request, id):
        try:
            answers = Answer.objects.filter(comment_id=id)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        listItems = []

        for answer in answers:
            objectValue = "/api/posts/" + str(id) + "/answers/" + str(answer.id)
            listItem = {"type": "Create", "actor": {"type": "Person", "name": answer.owner.username},
                        "object": objectValue}
            listItems.append(listItem)

        response = {"@context": "https://www.w3.org/ns/activitystreams", "summary": "Object History",
                    "type": "Collection", "totalItems": len(answers), "items": listItems}
        return Response(response)

    def post(self, request, id):

        try:
            Comment.objects.get(id=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        body = {"comment_id": id,  "answer": request.data["content"], "owner": request.data["ownerId"]}

        try:
            answerSerializer = AnswerSerializer(data=body)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if answerSerializer.is_valid():
            answerSerializer.save()
            response = {"@context": "https://www.w3.org/ns/activitystreams",
                        "summary": answerSerializer.validated_data["owner"].username + " created an answer",
                        "type": "Create",
                        "actor": {"type": "Person", "name": answerSerializer.validated_data["owner"].username},
                        "object": {
                            "answer": body["answer"],
                            "creationDate": timezone.now()
                        }}
            return Response(response)
        return Response(status=status.HTTP_400_BAD_REQUEST)