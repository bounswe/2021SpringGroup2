import requests
from flask import Flask, Blueprint, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi
from .dbinit import db, User, Eventpost
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(db)
session = Session()

event_api = Blueprint('event_api', __name__)
API_KEY = "Google API Key"

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

@event_api.route('/api/v1.0/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = session.query(Eventpost).filter_by(postID=event_id).first()
    if not event:
        abort(404)
    covid_risk = False

    # assume event owners create event only in the country of their registration location
    owner_user = session.query(User).filter_by(user_id=event.ownerID)

    resp = requests.get('http://api.geonames.org/searchJSON', {'q': owner_user.location, 'username': 'practice_app'})
    data = resp.json()

    if len(data['geonames']) > 0:

        # get country name from location via geonames API
        country = '-'.join(data['geonames'][0]['countryName'].split()).lower()

        # set dates to fetch coronavirus cases
        today = datetime.today()
        to_date = str(today)
        from_date = today - timedelta(days=3)

        resp = requests.get(f'https://api.covid19api.com/country/{country}/status/confirmed/live',
                     {'from': from_date, 'to_date': to_date})

        covid_data = resp.json()
        # if cases are increasing for 3 days in a row, set risk status true
        if covid_data[-1]['Cases'] > covid_data[-2]['Cases'] > covid_data[-3]['Cases']:
            covid_risk = True

    return jsonify({'events': event,
                    'covid_risk_status': covid_risk,
                    'current_cases': covid_data[-1]['Cases']})

@event_api.route('/api/v1.0/sportTypes', methods=['GET'])
def get_sport_types():
    try:
        response = requests.get("https://sports.api.decathlon.com/sports")
        mapped = [{"name": j["attributes"]["name"], "description": j["attributes"]["description"], "icon": j["attributes"]["icon"]} for j in response.json()["data"] if j["attributes"]["decathlon_id"]!=None and j["attributes"]["parent_id"]==None]
        return jsonify(mapped), 200
    except:
        abort(500)

@event_api.route('/api/v1.0/weather/<string:city>/<int:year>/<int:month>/<int:day>', methods=['GET'])
def get_weather(city, year, month, day):
    try:
        response = requests.get("https://www.metaweather.com/api/location/search/?query=" + city)
        id = response.json()[0]["woeid"]
        result = requests.get("https://www.metaweather.com/api/location/" + str(id) + "/" + str(year) + "/" + str(month) + "/" + str(day))
        mapped = {key: result.json()[0][key] for key in ["humidity", "max_temp", "min_temp", "the_temp", "weather_state_name", "wind_speed"]}
        return jsonify(mapped)

    except:
        abort(500)

def haversineDistance(lat1, lon1, lat2, lon2):
    ## Calculates the Haversine Distance between two locations.
    ## Available here:https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    p = pi/180
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p) * cos(lat2*p) * (1-cos((lon2-lon1)*p))/2
    return 12742 * asin(sqrt(a))

@event_api.route('/api/v1.0/events', methods=['GET'])
def getNearbyEvents():
    useIP = request.args.get('ip')
    address = request.args.get('address')##check, 400
    radius = request.args.get('radius')
    eventType = request.args.get('sport')
    ageRange = request.args.get('ageGroup')
    skillLevel = request.args.get('skillLevel')
    filterEmpty = request.args.get('empty')
    filteredEvents = events
    for argument in request.args:
        print(argument)
        if argument == 'address' or argument == 'radius' or argument =='ip':
            continue
        elif argument == "empty":
            if request.args["empty"]=="true":
                filteredEvents = list(filter(lambda event: len(event["players"])<int(event["playerCapacity"]),filteredEvents))
        else:
            query_value = request.args[argument]
            filteredEvents = list(filter(lambda event: event[argument] == query_value,filteredEvents))
    if useIP=="false":
        getParams = {'address':' '.join(str(address).split()),'key':API_KEY}
        addressData = requests.get("https://maps.googleapis.com/maps/api/geocode/json",params=getParams).json()
        lat = addressData["results"][0]["geometry"]["location"]["lat"]
        lng = addressData["results"][0]["geometry"]["location"]["lng"]
    else:
        getParams = {'key':API_KEY}
        ipdata = requests.post("https://www.googleapis.com/geolocation/v1/geolocate",params=getParams).json()
        lat = ipdata["location"]["lat"]
        lng = ipdata["location"]["lng"]
        print(lat, lng)
    nearbyEvents = [event for event in filteredEvents if
        haversineDistance(lat,lng,event["coordinates"][0], event["coordinates"][1])<=float(radius)]
    return jsonify(nearbyEvents)

@event_api.route('/api/v1.0/events', methods=['POST'])
def create_event_post():
    event_id = 1 if len(events) == 0 else events[-1]['eventId'] + 1
    location = request.json['location']
    new_event = {
            "eventId": event_id,
            "owner": request.json['ownerId'],
            "title":  request.json['title'],
            "content": request.json['content'],
            "location": location,
            "date": request.json['date'],
            "hours": request.json['hours'],
            "sport": request.json['sport'],
            "ageGroup": request.json['ageGroup'],
            "skillLevel": request.json['skillLevel'],
            "playerCapacity": request.json['playerCapacity'],
            "spectatorCapacity": request.json['spectatorCapacity'],
            "spectators": request.json['spectators'],
            "players": request.json['players']
    }
    events.append(new_event)
    key = 'I4AusKojAMUPh2QSaXg9RTGqsM903dJ1'
    response = requests.get("http://www.mapquestapi.com/geocoding/v1/address?key={}&location={}".format(key, location))
    latLng = response["results"][0]["locations"]["latLng"]
    return jsonify({"event": new_event, "latLng": latLng}), 201
