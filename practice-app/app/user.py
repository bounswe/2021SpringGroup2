from flask import Blueprint, jsonify, abort, request
from .dbinit import db, Following
from sqlalchemy.orm import sessionmaker
from .dbinit import db, User, Eventpost, Following
import requests

Session = sessionmaker(db)
session = Session()

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


@user_api.route('/api/v1.0/users/', methods=['GET'])
def get_user():
    users_ = session.query(User)
    if not users_ == 0:
        abort(404)

    user_list = []
    for single_user in users_:
        user_list.append({col.name: str(getattr(single_user, col.name)) for col in single_user.__table__.columns})

    return jsonify(user_list), 200


@user_api.route('/api/v1.0/users/<int:userid>', methods=['GET'])
def get_single_user(userid):
    users_ = session.query(User).get(userid)
    if not users_:
        abort(404)

    table = {col.name: str(getattr(users_, col.name)) for col in users_.__table__.columns}

    #
    #   API usage starts here
    #   This api finds the countries according to the given location. But it changes the output format, therefore
    #   it will not be allowed to work.
    #
    resp = requests.get("https://countriesnow.space/api/v0.1/countries/population/cities")
    datum = resp.json()['data']
    city = table['location']
    country = ""
    list1 = [[nohut['city'], nohut['country']] for nohut in datum]
    for i in list1:
        print(i[0])
        if city == i[0]:
            country = i[1]
            break
        else:
            country = 'not found'
    if country != 'not found':
        pass
        # table['country'] = country
    else:
        pass
        # table['country'] = "not known"
    #
    #   API usage ends here
    #

    return jsonify(table), 200


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


@user_api.route('/api/v1.0/users/<int:user_id>/followers', methods=['GET'])
def get_followers(user_id):
    followers = session.query(Following).filter(Following.followingID == user_id).all()
    return jsonify({"followerIDs": [follower.followerID for follower in followers]}), 200
