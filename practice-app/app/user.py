from flask import Blueprint, jsonify, abort
from .dbinit import db, Following
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(db)
session = Session()

from .dbinit import db, User, Eventpost, Following

from sqlalchemy.orm import sessionmaker


user_api = Blueprint('user_api', __name__)

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

@user_api.route('/api/v1.0/users/<int:user_id>/followers', methods=['POST'])
def follow_user(user_id):
    data = request.get_json()
    follower_id = data['follower_id']

    user = session.query(User).filter_by(user_id=user_id).first()
    if not user:
        abort(404)

    follower = session.query(User).filter_by(user_id=follower_id).first()
    if not follower:
        abort(404)

    session.merge(Following(followingID=user_id, followerID=follower_id))
    session.commit()

    return {'following_id': user_id, 'follower_id': follower_id}, 201


@user_api.route('/api/v1.0/users/<id:user_id>/followers', methods=['GET'])
def get_followers(user_id):
    followers = session.query(Following).filter(Following.followingID == user_id).all()
    return jsonify({"followerIDs": [follower.followerID for follower in followers]}), 200
