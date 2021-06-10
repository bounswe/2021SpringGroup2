import unittest

from app import dbinit
from app.dbinit import db, User, Eventpost, base
from app.app import app
from app.equipment import results
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
