
import os
import unittest
import requests
from requests.api import post
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import sessionmaker
from faker import Faker
from datetime import datetime
from app.app import app
from app import dbinit
class Test(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.client = app.app.test_client()
        faker = Faker()
        user = dbinit.User()
        dbinit.session.add(user)
        dbinit.session.commit()
        post1 = dbinit.Eventpost(ownerID = 1, title = "Tennis Game for Everyone", 
    creationDate = datetime.now().strftime("%m/%d/%Y, %H:%M:%S"), eventDate = faker.date("%m/%d/%Y"), eventHours = faker.time(), 
    eventSport = "Tennis" ,eventPlayerCapacity = 2 )
        post2 = dbinit.Eventpost(ownerID = 1, title = "Football Game for Experts", 
    creationDate = datetime.now().strftime("%m/%d/%Y, %H:%M:%S"), eventDate = faker.date("%m/%d/%Y"), eventHours = faker.time(), 
    eventSport = "Football" ,eventPlayerCapacity = 11 )
        dbinit.session.add_all([post1,post2])
        dbinit.session.commit()
        comment1 = dbinit.Comment(commentDate= datetime.now().strftime("%d/%m/%Y %H:%M:%S"), comment = "Was a nice match.",postID =  1,ownerID = 1)
        comment2 = dbinit.Comment(commentDate= datetime.now().strftime("%d/%m/%Y %H:%M:%S"), comment = "Wanna play again?",postID =  2,ownerID = 1)
        dbinit.session.add_all([comment1,comment2])
        dbinit.session.commit()
    @classmethod
    def tearDownClass(self):
        dbinit.session.close()
        dbinit.base.metadata.drop_all(dbinit.db)
    def testInvalidPostID(self):
        post_id = 3
        comment_id = 1
        request = self.client.get("/api/v1.0/events/" + str(post_id) + "/comments/" + str(comment_id))
        self.assertEqual(request.status_code,404)
        self.assertEqual(request.get_json()["error"],'There is no post with given ID')
    def testInvalidCommentID(self):
        post_id = 1
        comment_id = 3
        request = self.client.get("/api/v1.0/events/" + str(post_id) + "/comments/" + str(comment_id))
        self.assertEqual(request.status_code,404)
        self.assertEqual(request.get_json()["error"],'There is no comment with given ID')
    def testInvalidCommentOfEvent(self):
        post_id = 1
        comment_id = 2
        request = self.client.get("/api/v1.0/events/" + str(post_id) + "/comments/" + str(comment_id))
        self.assertEqual(request.status_code,404)
        self.assertEqual(request.get_json()["error"],'Post has no comment with the given ID')
    def testSuccessfulGet(self):
        post_id = 1
        comment_id = 1
        request = self.client.get("/api/v1.0/events/" + str(post_id) + "/comments/" + str(comment_id))
        self.assertEqual(request.status_code,200)
        self.assertEqual(request.get_json()["comment"], 'Was a nice match.')
        self.assertEqual(int(request.get_json()["commentID"]),1)
if __name__ == '__main__':
    unittest.main()