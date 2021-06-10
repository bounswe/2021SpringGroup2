import requests
from flask import Blueprint, jsonify, abort, request
from datetime import datetime
from .dbinit import db, User, Eventpost
from sqlalchemy.orm import sessionmaker
import time
Session = sessionmaker(db)
session = Session()

spectator_api = Blueprint('spectator_api', __name__)

@spectator_api.route('/api/v1.0/events/<int:event_id>/spectators', methods=['GET'])
def get_spectators(event_id):
    event = session.query(Eventpost).get(event_id)
    if event == null:
        abort(404)
    return jsonify({"event_id": event_id, 'spectators': list(event.eventSpectators)})

@spectator_api.route('/api/v1.0/events/<int:event_id>/spectators', methods=['POST'])
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
