import unittest
from datetime import datetime
from app.app import app
from app.dbinit import db, User, base, session, Eventpost
from app import dbinit

class PostEventTest(unittest.TestCase):

    def setUp(self):
        user = User()
        session.add(user)
        session.commit()
        self.client = app.test_client()

    def test_event_valid(self):
        params = {
            "ownerID": 1,
            "content": "Sparring and fighting in rounds.",
            "title": "Kickbox training",
            "creationDate": "05-06-2021",
            "location": "Kars",
            "eventDate": "01-01-2022",
            "eventHours": "13:00-15:00",
            "eventSport": "MartialArts",
            "eventAgeGroup": "7-70",
            "eventPlayerCapacity": 10,
            "eventSpectatorCapacity": 5,
            "eventPlayers": [1, 3, 5, 7],
            "eventSpectators": [2, 4],
            "eventSkillLevel": 2,
            "eventLatitude": 36.0,
            "eventLongitude": 45.0}

        resp = self.client.post('/api/v1.0/events/', data=params)
        status = resp.status_code
        self.assertEqual(201, status)

    def test_event_invalid(self):
        params = {
            "ownerID": 1,
            "content": "Sparring and fighting in rounds.",
            "title": "Kickbox training",
            "creationDate": "05-06-2021",
            "location": "Kars",
            "eventDate": "01-01-2022",
            "eventHours": "13:00-15:00",
            "eventSport": "MartialArts",
            "eventAgeGroup": "7-70",
            "eventPlayerCapacity": 10,
            "eventSpectatorCapacity": 5,
            "eventPlayers": [1, 3, 5, 7],
            "eventSpectators": [2, 4],
            "eventSkillLevel": 2,
            "eventLatitude": 36.0,
            "eventLongitude": 45.0}

        resp = self.client.post('/api/v1.0/events/', data=params)
        status = resp.status_code
        self.assertEqual(400, status)

    def tearDown(self):
        session.close()
        base.metadata.drop_all(db)
