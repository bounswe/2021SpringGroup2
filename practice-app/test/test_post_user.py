import unittest
from app.app import app
from app.dbinit import db, User, base, session, Post
from app import dbinit

class PostUserTest(unittest.TestCase):

    def setUp(set):
        set.client = app.test_client()
        user = User()
        session.add(user)
        session.commit()

    def test_valid_user(set):
        parameters = {
            "user_id": 1234,
            "nickname": "asdf",
            "first_name": "asil",
            "last_name": "yurt",
            "biography": "born in Izmir",
            "birth_year": 1987,
            "avatar": "image.png",
            "location": "Ankara",
            "privacy": False
        }
    response = set.client.post('/api/v1.0/users/', data = parameters)
    status = response.status_code
    set.assertEqual(201, status)

    def test_ibvalid_user(set):
        parameters = {
            "user_id": 1234,
            "nickname": "asdf",
            "first_name": "asil",
            "last_name": "yurt",
            "biography": "born in Izmir",
            "birth_year": 1987,
            "avatar": "image.png",
            "location": "asdfghj",
            "privacy": True
        }
    response = set.client.post('/api/v1.0/users/', data = parameters)
    status = response.status_code
    set.assertEqual(404, status)
    set.assertEqual(400, status)

    def tearDown(set):
        session.close()
        base.metadata.drop_all(db)
    