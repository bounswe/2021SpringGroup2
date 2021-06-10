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


class Testplayers(unittest.TestCase):
    def test_is_proper_players_anoldplayer(self):
        result=is_proper_players(50,10,"football",[["player1",61,["football","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"There is an older player.")
    def test_is_proper_players_ayoungplayer(self):
        result=is_proper_players(50,10,"football",[["player1",9,["football","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"There is a younger player.")
    def test_is_proper_players_someplayersontlikethissport(self):
        result=is_proper_players(50,10,"football",[["player1",44,["running","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"Some players dont like this sport.")
    def test_is_proper_players_allplayerareappropriate(self):
        result=is_proper_players(50,10,"football",[["player1",12,["football","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"All players satisfy the needs.")

def is_proper_players(maxage,minage,sport,players):
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