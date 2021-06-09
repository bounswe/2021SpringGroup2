import requests
from flask import Flask, Blueprint, jsonify, abort, request, make_response
import urllib
from datetime import datetime, timedelta
from sqlalchemy.orm import sessionmaker
from .dbinit import Comment, Eventpost, User, session
from sqlalchemy import create_engine

comment_api = Blueprint('comment_api', __name__)

@comment_api.route("/api/v1.0/events/<id:event_id>/comments",methods=["GET"])
def getComment(event_id):
    
    commentlist=session.query(Comment).filter(Comment.postID==event_id).all()
    return jsonify([{col.name: str(getattr(comment, col.name)) for col in comment.__table__.columns} for comment in commentlist]), 200 

@comment_api.route("/api/v1.0/events/<int:post_id>/comments",methods=["POST"])
def postComment(post_id):
    if len(session.query(Eventpost).filter(Eventpost.postID==post_id).all())==0: ## check if event exists
        return make_response(jsonify({'error': 'There is no post with given ID'}), 404) ## if not, error
    commentValues = request.form ## take parameters
    if len(session.query(User).filter(User.user_id==commentValues.get('user_id')).all())==0: ##check if user exists
        return make_response(jsonify({'error': 'There is no user with given ID'}), 404) ## if not 
    newComment = {"commentDate": datetime.now().strftime("%d/%m/%Y %H:%M:%S"), ## if so, construct a comment
        "comment": commentValues.get('comment'),
        "postID": post_id,
        "ownerID": commentValues.get('user_id')}
    session.add(Comment(**newComment)) ## post the object to database
    session.commit()
    return jsonify(newComment), 201

@comment_api.route("/api/v1.0/events/<int:post_id>/comments/<int:comment_id>",methods=["GET"])
def getCommentByID(post_id,comment_id):
    if len(session.query(Eventpost).filter(Eventpost.postID==post_id).all())==0: ## check if the event exists
        return make_response(jsonify({'error': 'There is no post with given ID'}), 404)
    if len(session.query(Comment).filter(Comment.commentId==comment_id).all())==0: ## check if the comment exists
        return make_response(jsonify({'error': 'There is no comment with given ID'}), 404)
    comment = session.query(Comment).filter(Comment.commentId==comment_id).first() ## if so, select the comment by id
    if int(comment.postID) != post_id: ##check if the comment is comment of given event
        return make_response(jsonify({'error': 'Post has no comment with the given ID'}), 404)
    comment_dict = {c.name: str(getattr(comment, c.name)) for c in comment.__table__.columns} ## convert comment object to dictionary
    return jsonify(comment_dict), 200 ## convert to json and make response
