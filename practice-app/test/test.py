import unittest

from app.app import app


class SimpleTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()

    def test_content(self):
        resp = self.client.get('/api/v1.0/')

        msg = resp.get_json().get('message')
        status = resp.status_code

        self.assertEqual(200, status)
        self.assertEqual('hello world', msg)

