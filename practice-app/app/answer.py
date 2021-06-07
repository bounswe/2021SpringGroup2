import requests
from flask import Flask, Blueprint, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from .dbinit import Answer, session, Eventpost, Comment, Blocking, User
import datetime

answer_api = Blueprint('answer_api', __name__)

@answer_api.route('/api/v1.0/<int:post_id>/comments/<int:comment_id>/answers', methods=['GET'])
def get_comment_answers(post_id, comment_id):
    post = session.query(Eventpost).filter(Eventpost.postID==post_id).first()
    comment = session.query(Comment).filter(Comment.commentID==comment_id).first()
    if post is None or comment is None:
        return abort(404)
    answers = session.query(Answer).filter(Answer.commentId==comment_id).all()
    return jsonify({"post": post, "comment": comment, "answers": list(answers)})

@answer_api.route('/api/v1.0/<int:post_id>/comments/<int:comment_id>/answers', methods=['POST'])
def post_comment_answers(post_id, comment_id):
    if "answer" not in request.json or "owner_id" not in request.json:
        return abort(400)
    post = session.query(Eventpost).filter(Eventpost.postID==post_id).first()
    comment = session.query(Comment).filter(Comment.commentID==comment_id).first()
    user = session.query(User).filter(User.user_id==request.json["owner_id"]).first()
    if post is None or comment is None or user is None:
        return abort(404)
    new_answer = Answer(commentId=comment_id, answer=request.json["answer"], answerDate=datetime.datetime.utcnow(), ownerID=request.json["owner_id"])
    session.add(new_answer)
    session.commit()
    return jsonify(new_answer)


if __name__ == '__main__':
    app.run(debug=True)
