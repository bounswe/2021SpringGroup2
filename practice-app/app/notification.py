import requests
from flask import Flask, Blueprint, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi
from .dbinit import Answer, session, Eventpost, Comment, Blocking, User, Notification


notif_api = Blueprint('notif_api', __name__)
API_KEY = "Google API Key"

@notif_api.route("/api/v1.0/notification",methods=["GET"])
def get_notification(user_id):
    notifications = session.query(Notification).filter(Notification.recipientID == user_id).all()
    return {'notifications': [col.name: str(getattr(notification, col.name)) for col in notification.__table__.columns for notification in notifications]}, 200


@notif_api.route("/api/v1.0/notification",methods=["POST"])
def postNotif():
    body = request.json

    if "ID" not in body:
        return abort(400)
    if "description" not in body:
        return abort(400)
    if "recipientID" not in body:
        return abort(400)
    
      
    if len(session.query(User).filter(User.user_id==body["recipientID"]).all())==0:
        return make_response(jsonify({'error': 'There is no user with given ID'}), 404)
    new_notif = Notification(ID=body["ID"], 
        		     date=datetime.today(),
        		     description=body["description"],
			     isRead=False,
    			     recipientID=body["recipientID"])
    session.add(new_notif)
    session.commit()
    return jsonify({col.name: str(getattr(new_notif, col.name)) for col in new_notif.__table__.columns}), 200 


