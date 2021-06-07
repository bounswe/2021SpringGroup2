import requests
from flask import Blueprint, jsonify, abort, request
from datetime import datetime
from .dbinit import db, User, Eventpost
from sqlalchemy.orm import sessionmaker
import time
Session = sessionmaker(db)
session = Session()

player_api = Blueprint('player_api', __name__)
API_KEY = "Google API Key"
events = [
    {
        "eventId": 1,
        "owner": "emre_gundogu",
        "title":  "Tennis Game for Everyone",
        "content": "People who are looking for a tennis court can apply this event. Our court is for you if you are seeking for a clean and well-lit court.",
        "location": "Etiler Tennis Club",
        "coordinates": (41.0869173, 29.0321301),
        "date": "01.05.2021",
        "hours": "15.00",
        "sport": "Tennis",
        "ageGroup": "Any age",
        "skillLevel": "Any level",
        "playerCapacity": "2",
        "spectatorCapacity": "8",
        "spectators": [{"username":"zulfikar_tunc"}],
        "players": [{"username":"zulfikar_tunc"}]
    }
]

users = [
    {
        "userId": 1,
        "nickname": "emre_gundogu",
        "first_name": "Emre",
        "last_name": "Gundogu",
        "biography": "Hello, I am a 28 year-old football fan",
        "birth_year": "28",
        "avatar": "url_to_image",
        "location": "Istanbul",
        "fav_sports": ["football", "basketball"],
        "badges": ["good_player", "serious"],
        "privacy": "public",
    }
]

equipmentPost = [
	{
		"postId": 1,
		"ownerId": 1,
		"content": "A nice ball",
		"title": "Well-conditioned ball",
		"creationDate": "29.05.2021",
		"lastUpdateDate": "29.05.2021",
		"numberOfClicks": 1,
		"location": "İstanbul",
		"equipmentType": "Ball",
		"websiteName": "ismycomputeron",
		"link": "www.ismycomputeron.com"
	}
]
equipments2 = [
    {
        "equipmentId": 1,
        "ownerId": 1,
        "title" : "Tennis shoes for sale!",
        "content" : "I have a pair of shoes in good condition that i want to sell.",
        "website name" : "letgo",
        "link" : "letgo.com/245323",
        "equipmentType": "shoes",
        "location": "Istanbul",
        "sportType": "Tennis"

    },
    {
        "equipmentId": 2,
        "ownerId": 1,
        "title" : "Tennis rackets for sale!",
        "content" : "I have a pair of shoes in good condition that i want to sell.",
        "website name" : "letgo",
        "link" : "letgo.com/245323",
        "equipmentType": "racket",
        "location": "Ankara",
        "sportType": "Tennis"
    }
]
headers = {
    "x-rapidapi-key": "c4ab16012amsh73b5a257264eb3dp11ade4jsnb69ec0b79098",
    "x-rapidapi-host" :"google-search3.p.rapidapi.com"
}
@app.route('/api/v1.0/spectators/<int:event_id>', methods=['GET'])
def get_spectators(event_id):
    event = [event for event in events if event['eventId'] == event_id]
    if len(event) == 0:
        abort(404)
    return jsonify({'spectators': event[0]["spectators"]})

@app.route('/api/v1.0/events/<int:event_id>/spectators', methods=['POST'])
def postSpectator(event_id):
    #this part looks user id and event id if they are exist in the database
    body = request.json
    user_id = body["userId"]
    event = session.query(Eventpost).filter(Eventpost.postID == event_id)
    user = session.query(User).filter(User.user_id == user_id)
    if event.first() is None: # if event is not created it gives an error
        abort(404)
    else:
        event = event.first()
   
    if user.first() is None:   #if userid is not exist it creates a user with random person api
   
    
        response = requests.get("https://pipl.ir/v1/getPerson").json()
    
    
    
        new_user = User(user_id=user_id,
                        nickname=response["person"]["personal"]["name"]+"_"+response["person"]["personal"]["last_name"],
                        first_name=response["person"]["personal"]["name"],
                        last_name=response["person"]["personal"]["last_name"],
                        biography="Hello, I am "+response["person"]["personal"]["name"]+ " "+response["person"]["personal"]["last_name"],
                        birth_year=2021-int(response["person"]["personal"]["age"]),
                        avatar=response["person"]["personal"]["name"],
                        location=response["person"]["personal"]["city"],
                        privacy=True if response["person"]["work"]["insurance"]== 'True' else False)
        
        session.add(new_user)
        session.commit()
        user = new_user
    else:
        user=user.first()

    event.eventSpectators = list(event.eventSpectators)
    event.eventSpectators.append(user.user_id)
    session.merge(event)
    session.commit()
    
    return(jsonify({"eventId": event_id,
                    "eventTitle": event.title,
                    "applicantId": user_id,
                    "applicantNickname": user.nickname,
                    "applicationServerTime": datetime.now().strftime("%d/%m/%Y %H:%M:%S")}), 201)

