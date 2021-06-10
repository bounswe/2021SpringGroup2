import requests
from flask import Flask, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi

app = Flask(__name__)
API_KEY = "Google API Key"

if __name__ == '__main__':
    app.run(debug=True)
