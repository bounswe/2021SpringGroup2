import requests
from flask import Flask, Blueprint, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi
from .dbinit import session, Notification

notif_api = Blueprint('notif_api', __name__)
API_KEY = "Google API Key"

@notif_api.route("/api/v1.0/notification",methods=["GET"])
def get_notification(user_id):
    notifications = session.query(Notification).filter(Notification.recipientID == user_id).all()
    return jsonify(notifications), 200




