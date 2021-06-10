import unittest

from app.app import app
from app.dbinit import db, User, base, session
from app import dbinit


class SimpleTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        user = User(user_id=48, nickname='emre121', first_name='emre', last_name='guner')
        session.add(user)
        session.commit()

    def test_content(self):
        resp = self.client.get('/api/v1.0/events/1')

        status = resp.status_code

        self.assertEqual(404, status)

    def tearDown(self):
        dbinit.session.close()
        dbinit.base.metadata.drop_all(db)


