import unittest

from app.app import app
from app.dbinit import db, User, base, session, Equipmentpost
from app import dbinit

class PostEquipmentTest(unittest.TestCase):

    def setUp(self):
        user = User()
        session.add(user)
        session.commit()

        self.client = app.test_client()

    def test_equipment_valid(self):
        params = {
            "ownerID": 1,
            "content": "nohut",
            "title": "fsfsfs",
            "location": "ooo",
            "equipmentType": "pwp",
            "websiteName": "ooeoo",
            "link": "ooeoo.com"}

        resp = self.client.post('/api/v1.0/equipments/', data=params)

        status = resp.status_code

        self.assertEqual(201, status)

    def test_equipment_invalid(self):
        params = {
            "ownerID": 1,
            "content": "nohut",
            "title": "fsfsfs",
            "location": "ooo",
            "websiteName": "ooeoo",
            "link": "ooeoo.com"}

        resp = self.client.post('/api/v1.0/equipments/', data=params)

        status = resp.status_code

        self.assertEqual(400, status)

    def tearDown(self):
        session.close()
        base.metadata.drop_all(db)
