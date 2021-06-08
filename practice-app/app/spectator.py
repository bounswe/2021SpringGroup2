import requests
from flask import Flask, Blueprint, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi
from dbinit import eventpost, session

spectator_api = Blueprint('spectator_api', __name__)

@spectator_api.route('/api/v1.0/spectators/<int:event_id>', methods=['GET'])
def get_spectators(event_id):
    event = session.query(eventpost).get(event_id)
    if event == null:
        abort(404)
    return jsonify({'spectators': event.eventSpectators})

@spectator_api.route('/api/v1.0/events/<int:event_id>/spectators', methods=['POST'])
def postSpectator(event_id):
    event = [event for event in events if event['eventId'] == event_id]
    if len(event) == 0:
        abort(404)
    r=requests.get("https://pipl.ir/v1/getPerson").json()
    randomname=r['person']['personal']['name']+'_'+r['person']['personal']['last_name']
    event[0]["spectators"].append({"username":randomname})
    return  jsonify({'spectators': event[0]["spectators"]}),201


