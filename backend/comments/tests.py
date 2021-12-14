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
        self.assertEquals(resolve(url).func.view_class, Comments) # only func doesnt work because of the class based view



        


class TestViews(TestCase):
    # testing views
    def setUp(self):
        self.client=Client()
        self.allcomments_url=reverse('AllComments', kwargs={'id': 1}) #args=[1])
        

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
        