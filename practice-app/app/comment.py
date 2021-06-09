import requests
from flask import Flask, Blueprint, jsonify, abort, request, make_response
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi
from sqlalchemy.orm import sessionmaker
from dbinit import Comment, eventpost, User
from sqlalchemy import create_engine

app = Flask(__name__)

comment_api = Blueprint('comment_api', __name__)
API_KEY = "Google API Key"
db = create_engine('postgresql://practice_user:-#My6o0dPa33W0rd#-@localhost:5432/practiceapp_db')

Session = sessionmaker(db)  
session = Session()

events = [
    {
        "eventId": 1,
        "owner": "emre_gundogu",
        "title":  "Tennis Game for Everyone",
        "content": "People who are looking for a tennis court can apply this event. Our court is for you if you are seeking for a clean and well-lit court.",
        "location": "Etiler Tennis Club",
        "coordinates": (41.0869173, 29.0321301),
        "date": "01.05.2021",
        "hours": "15.00",
        "sport": "Tennis",
        "ageGroup": "Any age",
        "skillLevel": "Any level",
        "playerCapacity": "2",
        "spectatorCapacity": "8",
        "spectators": [{"username":"zulfikar_tunc"}],
        "players": [{"username":"zulfikar_tunc"}]
    }
]

users = [
    {
        "userId": 1,
        "nickname": "emre_gundogu",
        "first_name": "Emre",
        "last_name": "Gundogu",
        "biography": "Hello, I am a 28 year-old football fan",
        "birth_year": "28",
        "avatar": "url_to_image",
        "location": "Istanbul",
        "fav_sports": ["football", "basketball"],
        "badges": ["good_player", "serious"],
        "privacy": "public",
    }
]

equipmentPost = [
	{
		"postId": 1,
		"ownerId": 1,
		"content": "A nice ball",
		"title": "Well-conditioned ball",
		"creationDate": "29.05.2021",
		"lastUpdateDate": "29.05.2021",
		"numberOfClicks": 1,
		"location": "İstanbul",
		"equipmentType": "Ball",
		"websiteName": "ismycomputeron",
		"link": "www.ismycomputeron.com"
	}
]
equipments2 = [
    {
        "equipmentId": 1,
        "ownerId": 1,
        "title" : "Tennis shoes for sale!",
        "content" : "I have a pair of shoes in good condition that i want to sell.",
        "website name" : "letgo",
        "link" : "letgo.com/245323",
        "equipmentType": "shoes",
        "location": "Istanbul",
        "sportType": "Tennis"

    },
    {
        "equipmentId": 2,
        "ownerId": 1,
        "title" : "Tennis rackets for sale!",
        "content" : "I have a pair of shoes in good condition that i want to sell.",
        "website name" : "letgo",
        "link" : "letgo.com/245323",
        "equipmentType": "racket",
        "location": "Ankara",
        "sportType": "Tennis"
    }
]
headers = {
    "x-rapidapi-key": "c4ab16012amsh73b5a257264eb3dp11ade4jsnb69ec0b79098",
    "x-rapidapi-host" :"google-search3.p.rapidapi.com"
}

@app.route("/api/v1.0/<int:post_id>/comments",methods=["POST"])
def postComment(post_id):
    if len(session.query(eventpost).filter(eventpost.postID==post_id).all())==0:
        return make_response(jsonify({'error': 'There is no post with given ID'}), 404)
    commentValues = request.form
    if len(session.query(User).filter(User.user_id==commentValues.get('user_id')).all())==0:
        return make_response(jsonify({'error': 'There is no user with given ID'}), 404)
    newComment = {"commentDate": datetime.now().strftime("%d/%m/%Y %H:%M:%S"), 
        "comment": commentValues.get('comment'),
        "postID": post_id,
        "ownerID": commentValues.get('user_id')}
    session.add(Comment(**newComment))
    session.commit()
    return jsonify(newComment), 201

@app.route("/api/v1.0/events/<int:post_id>/comments/<int:comment_id>",methods=["GET"])
def getCommentByID(post_id,comment_id):
    if len(session.query(eventpost).filter(eventpost.postID==post_id).all())==0: ## check if the event exists
        return make_response(jsonify({'error': 'There is no post with given ID'}), 404)
    if len(session.query(Comment).filter(Comment.commentId==comment_id).all())==0: ## check if the comment exists
        return make_response(jsonify({'error': 'There is no comment with given ID'}), 404)
    comment = session.query(Comment).filter(Comment.commentId==comment_id).first() ## if so, select the comment by id
    if int(comment.postID) != post_id: ##check if the comment is comment of given event
        return make_response(jsonify({'error': 'Post has no comment with the given ID'}), 404)
    comment_dict = {c.name: str(getattr(comment, c.name)) for c in comment.__table__.columns} ## convert comment object to dictionary
    return jsonify(comment_dict), 200 ## convert to json and make response