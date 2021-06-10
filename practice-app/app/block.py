import requests
from flask import Flask, Blueprint, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi
from .dbinit import Blocking
from .dbinit import session

block_api = Blueprint('block_api', __name__)

    
@block_api.route('/api/v1.0/<int:user_id>/blocked-users', methods=['GET'])
def get_blocked_users(user_id):
    blocked_users = session.query(Blocking).filter(Blocking.blockingID == user_id).all()
    return jsonify({"blockedIDs": [user.blockedID for user in blocked_users]}), 200
  
@block_api.route('/api/v1.0/<id:user_id>/blocked-users', methods=['POST'])
def post_blocked_users(user_id):
    body = request.json
    blocking_user_id = body["userId"]
    user = [user for user in users if user["userId"] == user_id]
    if len(user) == 0:
        abort (404)
    new_block = {
        "blockedId": user_id,
        "blockingId": blocking_user_id
    }
    blocking.append(new_block)
    return jsonify({"blockedId": user_id,
                    "blockingId": blocking_user_id
                    }), 201
