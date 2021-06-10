
import unittest



from app.app import app
from app.dbinit import db, User, base, session, Equipmentpost

from app import dbinit
from app.dbinit import db, User, Eventpost, base
from app.app import app
from app.equipment import results

import datetime
from datetime import timedelta


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


class FollowTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        base.metadata.create_all(db)
        user1 = User(user_id=67, nickname='emre171', first_name='emre', last_name='guner')
        user2 = User(user_id=71, nickname='hamdi99', first_name='hamdi', last_name='dogan')

        dbinit.session.add(user1)
        dbinit.session.add(user2)
        dbinit.session.commit()

    def test_follow(self):
        resp = self.client.post('/api/v1.0/users/67/followers', json={'follower_id': 71})
        data = resp.get_json()

        self.assertEqual(201, resp.status_code)
        self.assertIn('following_id', data)
        self.assertIn('follower_id', data)

        self.assertEqual(data['following_id'], 67)
        self.assertEqual(data['follower_id'], 71)

    def test_no_follower_exists(self):
        resp = self.client.post('/api/v1.0/users/67/followers', json={'follower_id': 89})
        self.assertEqual(404, resp.status_code)

    def test_no_user_exists(self):
        resp = self.client.post('/api/v1.0/users/35/followers', json={'follower_id': 67})
        self.assertEqual(404, resp.status_code)

    def tearDown(self):
        dbinit.session.close()
        dbinit.base.metadata.drop_all(dbinit.db)





class Testplayers(unittest.TestCase):
    def is_proper_players(self,maxage,minage,sport,players):
        number=0
        
        for a in range (len(players)):
            if players[a][1]>maxage:
                return "There is an older player."
            if players[a][1]<minage:
                return "There is a younger player."
        for a in range (len(players)):
            for b in range (len(players[a][2])):
                
                if(players[a][2][b]==sport):
                    
                    number=number+1
        if(number==len(players)):
                
            return "All players satisfy the needs."
        else:
                
            return "Some players dont like this sport."
    
    
    
    def test_is_proper_players_anoldplayer(self):
        result=self.is_proper_players(50,10,"football",[["player1",61,["football","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"There is an older player.")
    def test_is_proper_players_ayoungplayer(self):
        result=self.is_proper_players(50,10,"football",[["player1",9,["football","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"There is a younger player.")
    def test_is_proper_players_someplayersontlikethissport(self):
        result=self.is_proper_players(50,10,"football",[["player1",44,["running","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"Some players dont like this sport.")
    def test_is_proper_players_allplayerareappropriate(self):
        result=self.is_proper_players(50,10,"football",[["player1",12,["football","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"All players satisfy the needs.")
       
class Test_results(unittest.TestCase):
    def test_shoe(self):
        tmp=str(results('shoe'))
        if('Shoe' in tmp and 'title' in tmp and 'description' in tmp and 'link' in tmp):
            bb=True
        else: 
            bb=False
        self.assertEqual(bb,True)
    def test_racket(self):
        tmp=str(results('racket'))
        if('racket' in tmp and 'title' in tmp and 'description' in tmp and 'link' in tmp):
            bb=True
        else: 
            bb=False
        self.assertEqual(bb,True)
    def test_ball(self):
        tmp=str(results('golf ball'))
        if('golf ball' in tmp and 'title' in tmp and 'description' in tmp and 'link' in tmp):
            bb=True
        else: 
            bb=False
        self.assertEqual(bb,True)
    def test_bar(self):
        tmp=str(results('pull-up bar'))
        if('pull-up bar' in tmp and 'title' in tmp and 'description' in tmp and 'link' in tmp):
            bb=True
        else: 
            bb=False
        self.assertEqual(bb,True)


class Test_sports(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
    def test_sports(self):
        resp = self.client.get('/api/v1.0/sportTypes/')

        status = resp.status_code

        self.assertEqual(200, status)


