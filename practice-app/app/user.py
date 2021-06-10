import requests
from flask import Flask, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi
from sqlalchemy.orm import sessionmaker
from .dbinit import db, User


app = Flask(__name__)
API_KEY = "Google API Key"

@user_api.route('/api/v1.0/users/', methods=['GET'])
def get_user():
    users_ = session.query(User)
    if not users_ == 0:
        abort(404)

    user_list = []
    for single_user in users_:
        user_list.append({col.name: str(getattr(single_user, col.name)) for col in single_user.__table__.columns})

    return jsonify(user_list), 200


@user_api.route('/api/v1.0/users/<int:id>', methods=['GET'])
def get_single_user(userid):
    users_ = session.query(User).filter(User.user_id == userid)
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
        #table['country'] = country
    else:
        pass
        #table['country'] = "not known"
    #
    #   API usage ends here
    #

    return jsonify(table), 200


if __name__ == '__main__':
    app.run(debug=True)
