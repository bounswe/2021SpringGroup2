from sqlalchemy import create_engine
from sqlalchemy import Column, String, Integer, BigInteger, Boolean, MetaData, Date, Time, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import ENUM, NUMRANGE, INT4RANGE, ARRAY
from sqlalchemy.orm import sessionmaker
import requests
from flask import Flask, jsonify, abort, request
import urllib
from datetime import datetime, timedelta
from math import cos, asin, sqrt, pi

app = Flask(__name__)
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
        "equipment type" : "Shoes"

    },
    {
        "equipmentId": 2,
        "ownerId": 1,
        "title" : "Tennis rackets for sale!",
        "content" : "I have a pair of shoes in good condition that i want to sell.",
        "website name" : "letgo",
        "link" : "letgo.com/245323",
        "equipment type" : "Shoes"
    }
]
headers = {
    "x-rapidapi-key": "c4ab16012amsh73b5a257264eb3dp11ade4jsnb69ec0b79098",
    "x-rapidapi-host" :"google-search3.p.rapidapi.com"
}

@app.route('/api/v1.0/equipments/<int:equipmentId>/results', methods=['GET'])
def results(equipmentId):
    equipment = [equipment for equipment in equipments2 if equipment['equipmentId'] == equipmentId]
    if len(equipment) == 0:
        abort(404)
    title=equipment[0]['title']
    query = {
    "q": equipment[0]['title'],
    
}
    response=requests.get("https://rapidapi.p.rapidapi.com/api/v1/search/" + urllib.parse.urlencode(query), headers=headers)
    mapped=[{"description": j["description"],"link": j["link"], "title":j["title"]} for j in response.json()["results"]]
    return jsonify(mapped), 200
@app.route('/api/v1.0/equipments/<int:equipmentId>', methods=['GET'])
def getEquipment(equipmentId):
   equipment = [equipment for equipment in equipments2 if equipment['equipmentId'] == equipmentId]
   if len(equipment) == 0:
        abort(404)
   return jsonify({'equipments': equipment[0]})


@app.route('/api/v1.0/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    try:
        event = list(filter(lambda x: x['eventId'] == event_id, events))[0]
    except IndexError:
        abort(404)
    covid_risk = False

    # assume event owners create event only in the country of their registration location
    user_location = list(filter(lambda x: x['nickname'] == event['owner'], users))[0]['location']
    resp = requests.get('http://api.geonames.org/searchJSON', {'q': user_location, 'username': 'practice_app'})
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

db = create_engine('postgresql://practice_user:-#My6o0dPa33W0rd#-@database/practiceapp_db')
base = declarative_base()

class User(base):
    __tablename__ = 'users'

    user_id = Column(BigInteger, primary_key=True)
    nickname = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    biography = Column(String)
    birth_year = Column(Integer)
    avatar = Column(String)
    location = Column(String)
    fav_sport_1 = Column(String)
    fav_sport_2 = Column(String)
    fav_sport_3 = Column(String)
    badge_1 = Column(String)
    badge_2 = Column(String)
    badge_3 = Column(String)
    privacy = Column(Boolean)

class post(base):
    __abstract__ = True
    __tablename__ = "post"
    postID = Column(Integer,primary_key=True)
    ownerID = Column(Integer,nullable=False)
    content = Column(Text)
    title = Column(String(100),nullable=False)
    creationDate = Column(DateTime,nullable=False)
    location = Column(String(200))

class eventpost(post):
    __tablename__ = "eventpost"
    eventDate = Column(Date,nullable=False)
    eventHours = Column(Time,nullable=False)
    eventSport = Column(String(30),nullable=False)
    eventAgeGroup = Column(INT4RANGE)
    eventPlayerCapacity = Column(Integer,nullable=False)
    eventSpectatorCapacity = Column(Integer)
    eventPlayers = Column(ARRAY(Integer))
    eventSpectators = Column(ARRAY(Integer))
    eventSkillLevel = Column(ENUM('Beginner', 'Preintermediate', 'Intermediate','Advanced','Expert', name='skill'))
    eventCoordinates = Column(NUMRANGE, nullable=False)

Session = sessionmaker(db)
session = Session()

base.metadata.create_all(db)

@app.route('/api/v1.0/', methods=['GET'])
def index():
    return jsonify({'message': 'hello world'}), 200  # mock message as an example

@app.route('/api/v1.0/sportTypes', methods=['GET'])
def get_sport_types():
    try:
        response = requests.get("https://sports.api.decathlon.com/sports")
        mapped = [{"name": j["attributes"]["name"], "description": j["attributes"]["description"], "icon": j["attributes"]["icon"]} for j in response.json()["data"] if j["attributes"]["decathlon_id"]!=None and j["attributes"]["parent_id"]==None]
        return jsonify(mapped), 200
    except:
        abort(500)

@app.route('/api/v1.0/weather/<string:city>/<int:year>/<int:month>/<int:day>', methods=['GET'])
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

@app.route('/api/v1.0/events', methods=['GET'])
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


@app.route('/api/v1.0/spectators/<int:event_id>', methods=['GET'])
def get_spectators(event_id):
    event = [event for event in events if event['eventId'] == event_id]
    if len(event) == 0:
        abort(404)
    return jsonify({'spectators': event[0]["spectators"]})



@app.route('/api/v1.0/events/<int:event_id>/players', methods=['GET'])
def get_players(event_id):
    event = [event for event in events if event['eventId']==event_id]
    if len(event) == 0:
        abort(404)
    return jsonify({'evetns': event[0]["events"]})



@app.route('/api/v1.0/events/<int:event_id>/players', methods=['POST'])
def apply_as_player(event_id):
    body = request.json
    user_id = body["userId"]
    event = [event for event in events if event["eventId"] == event_id]
    user = [user for user in users if user["userId"] == user_id]
    if len(event) == 0:
        abort(404)
    if len(user) == 0:
        response = requests.get("https://randomapi.com/api/9fekfc0v?key=2UX0-XIT1-7DYM-WDBC")
        json_data = response.json()["results"]
        new_user = {"userId": user_id,
                     "nickname": json_data[0]["nickname"],
                     "first_name": json_data[0]["firstName"],
                     "last_name": json_data[0]["lastName"],
                     "biography": json_data[0]["biography"],
                     "birth_year": json_data[0]["birth_year"],
                     "avatar": json_data[0]["avatar"],
                     "location": json_data[0]["location"],
                     "fav_sports": json_data[0]["favSports"],
                     "badges": json_data[0]["badges"],
                     "privacy": json_data[0]["privacy"]}
        users.append(new_user)
        user.append(new_user)

    event[0]["players"].append(user[0]["nickname"])
    return jsonify({"eventId": event_id,
                    "eventTitle": event[0]["title"],
                    "applicantId": user_id,
                    "applicantNickname": user[0]["nickname"],
                    "applicationServerTime": datetime.now().strftime("%d/%m/%Y %H:%M:%S")}), 201

@app.route('/api/v1.0/events/<int:event_id>/spectators', methods=['POST'])
def postSpectator(event_id):
    event = [event for event in events if event['eventId'] == event_id]
    if len(event) == 0:
        abort(404)
    r=requests.get("https://pipl.ir/v1/getPerson").json()
    randomname=r['person']['personal']['name']+'_'+r['person']['personal']['last_name']
    event[0]["spectators"].append({"username":randomname})
    return  jsonify({'spectators': event[0]["spectators"]}),201


@app.route('/api/v1.0/equipments', methods=['POST'])
def create_equipment_post():
	# Creates the equipment post
	if len(equipmentPost) != 0:
		new_equipment = {
			"postId": equipmentPost[-1]['postId'] + 1,
			"ownerId": request.json['ownerId'],
			"content": request.json['content'],
			"title": request.json['title'],
			"creationDate": request.json["creationDate"],
			"lastUpdateDate": request.json["lastUpdateDate"],
			"numberOfClicks": request.json['numberOfClicks'],
			"location": request.json["location"],
			"equipmentType": request.json["equipmentType"],
			"websiteName": request.json["websiteName"],
			"link": request.json["link"]
		}
	else:
		new_equipment = {
			"postId": 1,
			"ownerId": request.json['ownerId'],
			"content": request.json['content'],
			"title": request.json['title'],
			"creationDate": request.json["creationDate"],
			"lastUpdateDate": request.json["lastUpdateDate"],
			"numberOfClicks": request.json['numberOfClicks'],
			"location": request.json["location"],
			"equipmentType": request.json["equipmentType"],
			"websiteName": request.json["websiteName"],
			"link": request.json["link"]
		}
	equipmentPost.append(new_equipment)
	return jsonify({"equipment": new_equipment}), 201


if __name__ == '__main__':
    app.run(debug=True)
