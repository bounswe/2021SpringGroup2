import unittest



# run with the command python3 -m unittest ibrahimtest.py 


def isproperplayers(maxage,minage,sport,players):
    number=0
    print(players)
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


class TestIbrahimtest(unittest.TestCase):
    def test_isproperplayers_anoldplayer(self):
        result=isproperplayers(50,10,"football",[["player1",61,["football","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"There is an older player.")
    def test_isproperplayers_ayoungplayer(self):
        result=isproperplayers(50,10,"football",[["player1",9,["football","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"There is a younger player.")
    def test_isproperplayers_someplayersontlikethissport(self):
        result=isproperplayers(50,10,"football",[["player1",44,["running","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"Some players dont like this sport.")
    def test_isproperplayers_allplayerareappropriate(self):
        result=isproperplayers(50,10,"football",[["player1",12,["football","basketbol","f1"]], ["player2 ",35,["bowling","basketbol","football"]  ] ,["player3 ",45,["walking","running","football"] ]])
        self.assertEqual(result,"All players satisfy the needs.")

