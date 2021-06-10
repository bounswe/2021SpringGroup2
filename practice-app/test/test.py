import unittest

from app.app import app
from app.dbinit import db, User, base, session, Equipmentpost
from app import dbinit


class GetUserTest(unittest.TestCase):

    def setUp(self):
        user1 = User()
        user2 = User()
        session.add_all([user1, user2])
        session.commit()

        self.client = app.test_client()

    def test_get_valid_single_user(self):

        resp = self.client.get('/api/v1.0/users/1')
        status = resp.status_code
        self.assertEqual(200, status)

    def test_get_valid_all_users(self):

        resp = self.client.get('/api/v1.0/users')
        status = resp.status_code
        self.assertEqual(200, status)

    def test_get_invalid(self):

        resp = self.client.get('/api/v1.0/users/493')
        status = resp.status_code
        self.assertEqual(404, status)

    def tearDown(self):
        session.close()
        base.metadata.drop_all(db)

