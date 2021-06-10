
import os
import unittest
import requests
from requests.api import post
from sqlalchemy import create_engine
from sqlalchemy.sql.functions import user
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
        dbinit.session.add(post1)
        dbinit.session.commit()
    @classmethod
    def tearDownClass(self):
        dbinit.session.close()
        dbinit.base.metadata.drop_all(dbinit.db)
    def testInvalidPostID(self):
        post_id = 2
        user_id = 1
        params = {"user_id":user_id,"comment":"Was a nice match"}
        request = self.client.post("/api/v1.0/events/" + str(post_id) + "/comments",data=params)
        self.assertEqual(request.status_code,404)
        self.assertEqual(request.get_json()["error"],'There is no post with given ID')
    def testInvalidUserID(self):
        post_id = 1
        user_id = 2
        params = {"user_id":user_id,"comment":"Was a nice match"}
        request = self.client.post("/api/v1.0/events/" + str(post_id) + "/comments" ,data=params)
        self.assertEqual(request.status_code,404)
        self.assertEqual(request.get_json()["error"],'There is no user with given ID')
    def testSuccessfulGet(self):
        post_id = 1
        user_id = 1
        params = {"user_id":user_id,"comment":"Was a nice match"}
        request = self.client.post("/api/v1.0/events/" + str(post_id) + "/comments" ,data=params)
        self.assertEqual(request.status_code,201)
        self.assertEqual(request.get_json()["comment"], 'Was a nice match')
if __name__ == '__main__':
    unittest.main()