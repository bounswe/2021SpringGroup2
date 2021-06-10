import json
import unittest

from app.app import app
from app.dbinit import db, User, base, session, Equipmentpost

from app import dbinit
from app.dbinit import db, User, Eventpost, base
from app.app import app
from app.equipment import results

import datetime
from datetime import timedelta

class ApplyEventTest(unittest.TestCase):
    def setUp(self):
        user = User()
        eventpost = Eventpost()
        session.add(user)
        session.add(eventpost)
        session.commit()
        self.client = app.test_client()

    def test_3rd_party_api(self):
        resp = self.client.get('https://randomapi.com/api/9fekfc0v?key=2UX0-XIT1-7DYM-WDBC')
        status = resp.status_code
        data = json.loads(resp.data)
        self.assertEqual(200, status)
        self.assertEqual('egecky', data["info"]["user"]["username"])

    def test_apply_valid_user(self):
        resp = self.client.post('/api/v1.0/events/1/players',data=dict(
        user_id=1))
        status = resp.status_code
        self.assertEqual(201, status)

    def test_apply_invalid_user(self):
        resp = self.client.post('/api/v1.0/events/1/players',data=dict(
        user_id=2))
        status = resp.status_code
        self.assertEqual(201, status)

    def test_apply_invalid_event(self):
        resp = self.client.post('/api/v1.0/events/2/players',data=dict(
        user_id=1))
        status = resp.status_code
        self.assertEqual(404, status)