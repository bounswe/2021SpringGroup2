
import os
import unittest
import requests
from requests.api import post
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import sessionmaker
from faker import Faker
from datetime import datetime, date, time
from psycopg2.extras import NumericRange
from app import dbinit 
from app.app import app
import re
class Test(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.client = app.app.test_client()
        faker = Faker()
        user = dbinit.User()
        dbinit.session.add(user)
        dbinit.session.commit()
        post1 = dbinit.Eventpost(ownerID = 1, title = "Tennis Game for Everyone", content = "Everyone is welcome",
    creationDate = datetime.now().strftime("%m/%d/%Y, %H:%M:%S"), eventDate = faker.future_date().strftime("%m/%d/%Y"), eventHours = faker.time(), 
    eventSport = "Tennis" ,eventPlayerCapacity = 2, eventPlayers = {1,2} , eventLatitude = 41.0869173, eventLongitude= 29.0321301, 
    eventSkillLevel ="Beginner", eventAgeGroup=NumericRange(20,30)) ### takes place in a tennis court at Etiler
        post2 = dbinit.Eventpost(ownerID = 1, title = "Football Game for Experts", content = "Only open to experienced players", 
    creationDate = datetime.now().strftime("%m/%d/%Y, %H:%M:%S"), eventDate = faker.future_date().strftime("%m/%d/%Y"), eventHours = faker.time(), 
    eventSport = "Football" ,eventPlayerCapacity = 11, eventPlayers ={1,2,3,4}, eventLatitude =40.9835741802915, eventLongitude = 29.0267014802915,
    eventSkillLevel ="Expert", eventAgeGroup=NumericRange(20,50)) ### takes place in a football field at Moda
        post3 = dbinit.Eventpost(ownerID = 1, title = "Wanna socialize?", content = "Join our basketball team",
    creationDate = datetime.now().strftime("%m/%d/%Y, %H:%M:%S"), eventDate = faker.future_date().strftime("%m/%d/%Y"), eventHours = faker.time(), 
    eventSport = "Basketball" ,eventPlayerCapacity = 5, eventPlayers = {1,2,3,4} , eventLatitude = 41.028819, eventLongitude= 29.058205, 
    eventSkillLevel ="Preintermediate", eventAgeGroup=NumericRange(30,40))  ### takes place in a basketball court at Üsküdar
        post4 = dbinit.Eventpost(ownerID = 1, title = "Let's play volleyball", content = "We are looking for friendly players",
    creationDate = datetime.now().strftime("%m/%d/%Y, %H:%M:%S"), eventDate = faker.future_date().strftime("%m/%d/%Y"), eventHours = faker.time(), 
    eventSport = "Volleyball" ,eventPlayerCapacity = 6, eventPlayers = {1,2,3,4,5,6} , eventLatitude = 41.003262, eventLongitude= 28.63839, 
    eventSkillLevel ="Intermediate", eventAgeGroup=NumericRange(22,28)) ## takes place in a volleyball court at Beylikdüzü
        post5 = dbinit.Eventpost(ownerID = 1, title = "Tennis Game At Etiler Court", content = "For experienced players, anyone can watch tho!",
    creationDate = datetime.now().strftime("%m/%d/%Y, %H:%M:%S"), eventDate = faker.future_date().strftime("%m/%d/%Y"), eventHours = faker.time(), 
    eventSport = "Tennis" ,eventPlayerCapacity = 2, eventPlayers = {1} , eventLatitude = 41.0869173, eventLongitude= 29.0321301, 
    eventSkillLevel ="Advanced", eventAgeGroup=NumericRange(30,40))  ### takes place in a tennis court at Etiler
        post6 = dbinit.Eventpost(ownerID = 1, title = "Let's Move", content = "We are here to do some exercise",
    creationDate = datetime.now().strftime("%m/%d/%Y, %H:%M:%S"), eventDate = faker.future_date().strftime("%m/%d/%Y"), eventHours = faker.time(), 
    eventSport = "Football" ,eventPlayerCapacity = 11, eventPlayers = {1,2,3,4,5,6,7,8} , eventLatitude =40.9835741802915, eventLongitude=29.0267014802915, 
    eventSkillLevel ="Beginner", eventAgeGroup=NumericRange(20,50))  ### takes place in a football field at Moda
        dbinit.session.add_all([post1,post2,post3,post4,post5,post6]) ## add temporary posts
        dbinit.session.commit()

    @classmethod
    def tearDownClass(self):
        dbinit.session.close()
        dbinit.base.metadata.drop_all(dbinit.db) ## delete tables and rows
    def testParameterTypes(self): ##check if the parameter types are correct
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="a",ip="true")) ##  radius should be numeric
        self.assertEqual(request.status_code,400)
        self.assertEqual(request.get_json()["error"],'A numeric value must be given as the radius parameter.')
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="5",ip="false")) ## if ip is false, an address should be given
        self.assertEqual(request.status_code,400)
        self.assertEqual(request.get_json()["error"],'Either an address should be given or the IP address must be used.') 
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="5",ip="true.")) ## ip can be either true of false
        self.assertEqual(request.status_code,400)
        self.assertEqual(request.get_json()["error"],'Either true or false must be given as the useIP parameter.')
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="5",ip="true",empty="true.")) ## empty can be either true or false
        self.assertEqual(request.status_code,400)
        self.assertEqual(request.get_json()["error"],'Empty argument must be true or false.')
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="5",ip="true",sport="football2")) ## sport type can be alphabetic
        self.assertEqual(request.status_code,400)
        self.assertEqual(request.get_json()["error"],'Sport type must consist of alphabetic characters only.')
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="5",ip="true",skillLevel="easy")) ## skill level should be enumeration
        self.assertEqual(request.status_code,400)
        self.assertEqual(request.get_json()["error"],'Skill level must be one of the following: Beginner,Preintermediate,Intermediate,Advanced,Expert.')
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="5",ip="true",ageGroup="3,a")) ## age group should be an integer tuple
        self.assertEqual(request.status_code,400)
        self.assertEqual(request.get_json()["error"],'Age range is not in valid format.')
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="5",ip="true",dateBegin="10:06:2021 15:00:00",dateEnd="10:06:2021 16:00:00"))
        ## date should be in the following format.
        self.assertEqual(request.status_code,400)
        self.assertEqual(request.get_json()["error"],'Date and time must be in format DD/MM/YYYY HH:MM:SS')
    def testSportType(self):
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="1000",ip="false",address="İstanbul",sport="Football")) ## filter football events 
        for event in list(request.get_json()):
            self.assertEqual(event["eventSport"],"Football") ## all returned objects should be football events
    def testSkillLevel(self):
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="1000",ip="false",address="İstanbul",skillLevel="Advanced")) ## filter advanced events
        for event in list(request.get_json()): 
            self.assertEqual(event["eventSkillLevel"],"Advanced") ## all returned objects should be advanced
    def testKeywordSearch(self):
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="1000",ip="false",address="İstanbul",search="Tennis")) ## search Tennis
        for event in list(request.get_json()):
            self.assertTrue("Tennis" in event["title"] or "Tennis" in event["content"]) ## all returned objects should contain tennis in title or content
    def testEmpty(self):
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="1000",ip="false",address="İstanbul",empty="true")) ## filter out full events
        for event in list(request.get_json()):
            self.assertLess(len(list(event["eventPlayers"].strip("][").split(", "))),int(event["eventPlayerCapacity"])) ## all returned objects should have less players than capcaity
        self.assertEqual(len(request.get_json()),4) ## there are 4 not-full events
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="1000",ip="false",address="İstanbul",empty="false")) ## do not filter out full events
        for event in list(request.get_json()):
            self.assertLessEqual(len(list(event["eventPlayers"].strip("][").split(", "))),int(event["eventPlayerCapacity"])) ## there can be as many players as the capacity
        self.assertEqual(len(request.get_json()),6) ## no event is filtered
    def testAgeRange(self):
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="1000",ip="false",address="İstanbul",ageGroup="20,40")) ## filter age range with 20,40
        for event in list(request.get_json()):
            lowerBound = int(tuple(event["eventAgeGroup"][1:-1].split(", "))[0]) 
            upperBound = int(tuple(event["eventAgeGroup"][1:-1].split(", "))[1])
            self.assertGreaterEqual(lowerBound,20) ## all events should have a age range between 20,30.
            self.assertLessEqual(upperBound,40)
    def testDateInterval(self):
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="1000",ip="false",address="İstanbul"
                ,dateBegin="10/06/2021 13:00:00",dateEnd="10/07/2021 18:00:00")) 
        for event in list(request.get_json()):
            eventDate = datetime.strptime(event["eventDate"], "%Y-%m-%d")
            eventHours = datetime.strptime(event["eventHours"], "%H:%M:%S") 
            self.assertGreaterEqual(eventDate,datetime.strptime("10/06/2021","%d/%m/%Y")) ## all events should have a date between the range
            self.assertLessEqual(eventDate,datetime.strptime("10/08/2021","%d/%m/%Y"))
            self.assertGreaterEqual(eventHours,datetime.strptime("13:00:00","%H:%M:%S")) ## all events should have a time between the range
            self.assertLessEqual(eventHours,datetime.strptime("18:00:00","%H:%M:%S"))
    def testSorting(self):
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="1000",ip="false",address="İstanbul", orderby="title",order="asc"))
        ## sort by ascending order of title
        titles = []
        for event in list(request.get_json()):
            titles.append(event["title"])
        for i in range(1,len(titles)):
            self.assertLessEqual(titles[i-1],titles[i]) ## all title objects should have bigger value than the previous one
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="1000",ip="false",address="İstanbul", orderby="title",order="desc"))
        ## sort by descending order of title
        titles = []
        for event in list(request.get_json()):
            titles.append(event["title"])
        for i in range(1,len(titles)):
            self.assertGreaterEqual(titles[i-1],titles[i])  ## all title objects should have smaller value than the previous one
    def testNearbyEvents(self):
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="100",ip="false",address="İstanbul"))
        self.assertEqual(len(list(request.get_json())),6) ## All events occur in İstanbul, within 100 km's
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="3",ip="false",address="Üsküdar"))
        self.assertEqual(len(list(request.get_json())),1) ## Only one event occurs within 3 km of Üsküdar
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="3",ip="false",address="Beylikdüzü"))
        self.assertEqual(len(list(request.get_json())),1) ## Only one event occurs within 3 km of Beylikdüzü
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="3",ip="false",address="Etiler"))
        self.assertEqual(len(list(request.get_json())),2) ## Only two events occur within 3 km of Etiler
        request = self.client.get("/api/v1.0/events",query_string=dict(radius="3",ip="false",address="Moda Sahil"))
        self.assertEqual(len(list(request.get_json())),2) ## Only two events occur within 3 km of Moda Sahil
if __name__ == '__main__':
    unittest.main()