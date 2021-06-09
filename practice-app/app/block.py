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
    return jsonify({col.name: str(getattr(blocked_users, col.name)) for col in blocked_users.__table__.columns}), 200
