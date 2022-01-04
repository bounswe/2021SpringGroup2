from django.test import SimpleTestCase, TestCase, Client
from rest_framework.test import APITestCase
from django.urls import reverse, resolve
from authentication.models import User
from comments.models import Comment, Answer
import json


class TestUrls(SimpleTestCase):
    # testing url
    def test_comments_url_is_resolved(self):

        url = reverse('AllComments', kwargs={'id': 1}) #args=['1']
        self.assertEquals(resolve(url).func.view_class, Comment) # only func doesnt work because of the class based view



        


class TestViews(TestCase):
    # testing views
    def setUp(self):
        self.user = User.objects.create_user(email="username@username.com", password="12345678", username="username")
        resp = self.client.post(reverse('token_create'), {'username': 'username', 'password': '12345678'})
        self.client.force_authenticate(user=self.user)
        self.client=Client()
        self.allcomments_url=reverse('AllComments', kwargs={'id': 1}) #args=[1])
        self.allanswers_url=reverse('AllAnswers', kwargs={"post_id":1,"comment_id":1})
        self.getCommentById_url=reverse('GetCommentById',kwargs={"postid":1,"commentid":1})


    def test_Comments_POST(self):
       
        bodyt= {
            "ownerId":1,
            "content":"A comment"
        }
        response=self.client.post(self.allcomments_url,data=bodyt,format='json')
        self.assertEquals(response.status_code, 201)

        comments=Comment.objects.filter(eventid=response.data.get('id'))
        self.assertEqual(comments.object.ownerId, 1)
        self.assertEqual(comments.object.content, "A comment")  
         

    def test_Answers_POST(self):
        bodyt2={
            "ownerId":3,
            "answer":"A simple answer",
            "creationDate":"2021-12-23 20:27:44.111646+02"
        }
        response=self.client.post(self.allanswers_url,data=bodyt2,format='json')
        self.assertEquals(response.status_code, 201)
        answers=Answer.objects.filter(commentid=response.data.get('comment_id'),eventid=response.data.get('post_id'))
        self.assertEqual(answers.object.answer,"A simple answer")
        self.assertEqual(answers.object.creationDate,"2021-12-23 20:27:44.111646+02")
        

    def test_Answers_Get(self):
        bodyt3={
            "ownerId":3,
            "answer":"A simple answer",
            "creationDate":"2021-12-23 20:27:44.111646+02"
        }
        response=self.client.post(self.allanswers_url,data=bodyt3,format='json')
        self.assertEquals(response.status_code, 201)
        response=self.client.get(self.allanswers_url,{"post_id":1,"comment_id":1},format='json')
        self.assertEquals(response.status_code, 201)
        self.assertEqual(response.object.totalItems,1)

    def GetCommentById_Get(self):
        bodyt4={
            "ownerId":3,
            "answer":"A simple comment",
            
        }
        response=self.client.post(self.allcomments_url,data=bodyt4,format='json')
        self.assertEquals(response.status_code, 201)
        response=self.client.get(self.getCommentById_url,{"postid":1,"commentid":1},format='json')
        self.assertEquals(response.status_code, 201)
        self.assertEqual(response.object.ownerId, 3)
        self.assertEqual(response.object.content, "A simple comment")  