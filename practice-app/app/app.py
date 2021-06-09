import requests
from flask import Flask, jsonify, abort, request, send_from_directory, render_template
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi
from .answer import answer_api
from .block import block_api
from .comment import comment_api
from .equipment import equipment_api
from .event import event_api
from .follow import follow_api
from .notification import notif_api
from .player import player_api
from .user import user_api

app = Flask(__name__, static_folder='/build/static', template_folder='/build')

app.register_blueprint(answer_api)
app.register_blueprint(block_api)
app.register_blueprint(comment_api)
app.register_blueprint(equipment_api)
app.register_blueprint(event_api)
app.register_blueprint(follow_api)
app.register_blueprint(notif_api)
app.register_blueprint(player_api)
app.register_blueprint(user_api)



@app.route('/api/v1.0/', methods=['GET'])
def index():
    return jsonify({'message': 'hello world'}), 200  # mock message as an example



@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path=""):
    return render_template('index.html')




if __name__ == '__main__':
    app.run(debug=True)
