from flask import Blueprint, jsonify, abort
from .dbinit import db, Following
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(db)
session = Session()

from .dbinit import db, User, Eventpost, Following
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(db)
session = Session()

user_api = Blueprint('user_api', __name__)


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
