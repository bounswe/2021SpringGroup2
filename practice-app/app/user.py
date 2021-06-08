import requests
from flask import Flask, Blueprint, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from .dbinit import session, User, Eventpost
from sqlalchemy.orm import sessionmaker


user_api = Blueprint('user_api', __name__)
API_KEY = "Google API Key"

@user_api.route('/api/v1.0/users', methods=['POST'])
def post_user(user_id):
    body = request.json
    user_id = body["userId"]
    if "user_id" not in body:
        return abort(400)
    if "nickname" not in body:
        return abort(400)
    if "first_name" not in body:
        return abort(400)
    if "last_name" not in body:
        return abort(400)
    if "biography" not in body:
        return abort(400)
    if "birth_year" not in body:
        return abort(400)
    if "avatar" not in body:
        return abort(400)
    if "location" not in body:
        return abort(400)
    if "privacy" not in body:
        return abort(400)
    new_user = User(user_id=user_id,
                    nickname=body["nickname"],
                    first_name=body["first_name"],
                    last_name=body["last_name"],
                    biography=body["biography"],
                    birth_year=body["birth_year"],
                    avatar=body["avatar"],
                    location=body["location"],
                    privacy=False if body["privacy"] == 'private' else True)
    session.add(new_user)
    session.commit()
    return jsonify(new_user), 201


