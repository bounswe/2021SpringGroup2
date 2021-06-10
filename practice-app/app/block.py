import requests
from flask import Flask, Blueprint, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi
from .dbinit import Blocking, User
from .dbinit import session

block_api = Blueprint('block_api', __name__)

    
@block_api.route('/api/v1.0/users/<int:user_id>/blocked-users', methods=['GET'])
def get_blocked_users(user_id):
    blocked_users = session.query(Blocking).filter(Blocking.blockingID == user_id).all()
    return jsonify({"blockedIDs": [user.blockedID for user in blocked_users]}), 200
  
@block_api.route('/api/v1.0/users/<int:user_id>/blocked-users', methods=['POST'])
def post_blocked_users(user_id):
    body = request.json
    blocked_user_id = body["userId"]
    blocked_users = session.query(User).filter(User.user_id == blocked_user_id).all()
    if len(blocked_users) == 0:
        abort(404)
    new_block = {
        "blockedId": blocked_user_id,
        "blockingId": user_id
    }
    session.add(Blocking(**new_block))
    session.commit()
    return jsonify(new_block), 201
