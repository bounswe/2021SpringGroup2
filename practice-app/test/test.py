import unittest

from app import dbinit
from app.dbinit import db, User, Eventpost, base
from app.app import app

import datetime
from datetime import timedelta


class SimpleTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        base.metadata.create_all(db)
        user = User(user_id=48, nickname='emre121', first_name='emre', last_name='guner')
        dbinit.session.add(user)
        dbinit.session.commit()

    def test_content(self):
        resp = self.client.get('/api/v1.0/events/1')

        status = resp.status_code

        self.assertEqual(404, status)

    def tearDown(self):
        dbinit.session.close()
        dbinit.base.metadata.drop_all(db)


class EventTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        base.metadata.create_all(db)
        user = User(user_id=52, nickname='emre171', first_name='emre', last_name='guner')
        event = Eventpost(ownerID=52, content="Lorem ipsum dolor sit amet", title='Lorem Football',
                      creationDate=datetime.date.today(), eventDate=datetime.date.today() + timedelta(days=9),
                      eventHours=datetime.time(1, 30), eventSport='football', eventPlayerCapacity=12)

        dbinit.session.add(user)
        dbinit.session.commit()

        dbinit.session.add(event)
        dbinit.session.commit()

    def test_wrong_event_id(self):
        resp = self.client.get('/api/v1.0/events/37')
        status = resp.status_code

        self.assertEqual(404, status)

    def test_fields(self):
        resp = self.client.get('/api/v1.0/events/1')
        self.assertEqual(200, resp.status_code)

        res = resp.get_json()
        self.assertIn('event', res)
        self.assertIn('covid_risk_status', res)
        self.assertIn('current_cases', res)

    def tearDown(self):
        dbinit.session.close()
        dbinit.base.metadata.drop_all(db)




