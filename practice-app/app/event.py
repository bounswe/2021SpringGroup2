import requests
from flask import Flask, Blueprint, jsonify, abort, request, make_response
import urllib
from datetime import datetime, timedelta
from sqlalchemy import create_engine
import re
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql.functions import func
from sqlalchemy import or_, and_
from datetime import datetime, time, date
from math import cos, asin, sqrt, pi
from .dbinit import db, User, Eventpost, session
from sqlalchemy.orm import sessionmaker

event_api = Blueprint('event_api', __name__)
API_KEY = "Google API Key"

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
    owner_user = session.query(User).filter_by(user_id=event.ownerID).first()

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

    return jsonify({'event': {col.name: str(getattr(event, col.name)) for col in event.__table__.columns},
                    'covid_risk_status': covid_risk,
                    'current_cases': covid_data[-1]['Cases']}), 200

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

@event_api.route('/api/v1.0/events', methods=['GET'])
def getNearbyEvents():
    ### This method applies some filters on events and returns the list of events that satisfy these filters.
    useIP = request.args.get('ip') ## whether or not use IP address for coordinate calculation
    address = request.args.get('address') ## if IP is not used, take the address as string
    radius = request.args.get('radius') ## integer value for the distance of the events to the given address
    if useIP is None or not useIP in ["true", "false"]: ## useIP must be given, and it is a boolean
        return make_response(jsonify({'error': 'Either true or false must be given as the useIP parameter.'}), 400) ## else, return error
    if radius is None or not radius.isnumeric(): ## radius must be given, and it is an integer
        return make_response(jsonify({'error': 'A numeric value must be given as the radius parameter.'}), 400)
    if useIP=="false" and address is None: ## if useIP is false, an address should be provided
        return make_response(jsonify({'error': 'Either an address should be given or the IP address must be used.'}), 400)
    query = session.query(Eventpost) ##initialize query
    for argument in request.args:
        if argument == 'address' or argument == 'radius' or argument =='ip':
            continue
        elif argument == "empty": ## whether or not to display only the events with empty spots
            if not request.args["empty"] in ["true","false"]: ## must be boolean
                return make_response(jsonify({'error': 'Empty argument must be true or false.'}), 400)
            if request.args["empty"]=="true":
                query = query.filter(func.cardinality(Eventpost.eventPlayers)<Eventpost.eventPlayerCapacity) ## if given, filter
        elif argument == "sport": ## sport type to filter the events
            if not request.args["sport"].isalpha(): ## must be a string
                return make_response(jsonify({'error': 'Sport type must consist of alphabetic characters only.'}), 400)
            query = query.filter(Eventpost.eventSport==str(request.args["sport"])) ## return only the events of the given sport
        elif argument == "skillLevel": ## skill level of events
            if not request.args["skillLevel"] in ["Beginner","Pre-intermediate","Intermediate","Advanced","Expert"]: ## must be enum of 5 values
                return make_response(jsonify({'error': 'Skill level must be one of the following: Beginner,Pre-intermediate,Intermediate,Advanced,Expert.'}), 400)
            query = query.filter(Eventpost.eventSkillLevel==str(request.args["skillLevel"]))
        elif argument == "search": ## keyword to search in the title and description of events
            searchContent = request.args["search"]
            if not searchContent.isalpha(): ## must be string
                return make_response(jsonify({'error': 'Search content must consist of alphabetic characters only.'}), 400)
            query = query.filter(or_(Eventpost.title.ilike('%'+str(searchContent)+'%'), Eventpost.content.ilike('%'+str(searchContent)+'%')))
        elif argument == "ageGroup": ## an integer tuple that represents the age range
            ageRange = request.args["ageGroup"]
            if re.search("^\d+,\d+$",ageRange) is None: ## must be tuple of ints
                return make_response(jsonify({'error': 'Age range is not in valid format.'}), 400)
            ageRange = tuple(ageRange.split(","))
            query = query.filter(and_(int(ageRange[0]) <= func.lower(Eventpost.eventAgeGroup),int(ageRange[1]) >= func.upper(Eventpost.eventAgeGroup)))
        elif argument == "dateBegin": ## a datetime object for the lower bound of the dates of events
            try: ## if dateBegin is given, dateEnd must be also given. Only intervals are supported for now.
                datetime_begin_object = datetime.strptime(request.args["dateBegin"],"%d/%m/%Y %H:%M:%S") ## format should be DD/MM/YYYY HH:MM:SS
                datetime_end_object = datetime.strptime(request.args["dateEnd"], "%d/%m/%Y %H:%M:%S")
            except ValueError:
                return make_response(jsonify({'error': 'Date and time must be in format DD/MM/YYYY HH:MM:SS'}), 400)
            query = query.filter(and_(func.date(datetime_begin_object.date())<=func.date(Eventpost.eventDate), func.date(datetime_end_object.date())>=func.date(Eventpost.eventDate))).\
                filter(and_(datetime_begin_object.time()<=Eventpost.eventHours, datetime_end_object.time()>=Eventpost.eventHours))
    if useIP=="false": ## if useIP is false, find coordinates using Geocoding API
        getParams = {'address':' '.join(str(address).split()),'key':API_KEY} ## parameters are the address and the key
        addressData = requests.get("https://maps.googleapis.com/maps/api/geocode/json",params=getParams).json()
        if addressData["status"]!="OK": ## if request was not successful
            return make_response(jsonify({'error': 'Address was not found.'}), 404)
        lat = addressData["results"][0]["geometry"]["location"]["lat"] ## take the latitude and longitude values
        lng = addressData["results"][0]["geometry"]["location"]["lng"]
    else: ## if useIP is true, find coordinates from IP address using Geolocation API
        getParams = {'key':API_KEY}  ## parameter is the key
        ipdata = requests.post("https://www.googleapis.com/geolocation/v1/geolocate",params=getParams).json()
        if "error" in ipdata: ## if error is in request
            return make_response(jsonify({'error': 'IP address is not valid.'}), 404)
        lat = ipdata["location"]["lat"]
        lng = ipdata["location"]["lng"]

    nearbyEvents = query.filter(func.haversineDistance(lat,lng,Eventpost.eventLatitude,Eventpost.eventLongitude)<=radius)
    ## filter the events so that only the events within the given radius of the calculated coordinates are displayed. Haversine Distance is used
    if not request.args.get("orderby") is None: ## if orderby parameter is given
        if not request.args["orderby"] in Eventpost.__table__.columns.keys(): ## it should be a column value
            return make_response(jsonify({'error': 'Order criterion is not a valid column name.'}), 400)
        if not request.args.get("order") is None: ## if order direction is given
            if not request.args["order"] in ["asc","desc"]: ## should be either asc or desc
                return make_response(jsonify({'error': 'Order direction must be either asc or desc'}), 400)
            if request.args["order"]=="asc":
                nearbyEvents = nearbyEvents.order_by(getattr(Eventpost,request.args["orderby"]).asc()) ## ascending order
            else:
                nearbyEvents = nearbyEvents.order_by(getattr(Eventpost,request.args["orderby"]).desc())
        else:
            nearbyEvents = nearbyEvents.order_by(getattr(Eventpost,request.args["orderby"]).asc())
    eventList = []
    nearbyEvents = nearbyEvents.all() ## take the events satisfying the filters
    for i in nearbyEvents:
        eventList.append({c.name: str(getattr(i, c.name)) for c in i.__table__.columns}) ## convert to dict array
    return jsonify(eventList), 200

@event_api.route('/api/v1.0/events', methods=['POST'])
def create_event_post():
    if "ownerID" not in request.json:
        abort(400)
    if "title" not in request.json:
        abort(400)
    if "eventDate" not in request.json:
        abort(400)
    if "eventHours" not in request.json:
        abort(400)
    if "eventSport" not in request.json:
        abort(400)
    if "eventPlayerCapacity" not in request.json:
        abort(400)

    creation_date = datetime.today()
    event_players = "eventPlayers" in request.json ? request.json["eventPlayers"] : {}
    event_spectators = "eventSpectators" in request.json ? request.json["eventSpectators"] : {}
    location_address = request.json['location']

    key = 'I4AusKojAMUPh2QSaXg9RTGqsM903dJ1'
    response = requests.get("http://www.mapquestapi.com/geocoding/v1/address?key={}&location={}".format(key, location))
    latLng = response["results"][0]["locations"]["latLng"]

    new_event = Eventpost(ownerID = requestt.json["ownerID"],
                          content = request.json["content"],
                          title = request.json["title"],
                          creationDate = creation_date,
                          location = location_address,
                          eventDate = request.json["eventDate"],
                          eventHours = request.json["eventHours"],
                          eventSport = request.json["eventSport"],
                          eventAgeGroup = request.json["eventAgeGroup"],
                          eventPlayerCapacity = request.json["eventPlayerCapacity"],
                          eventSpectatorCapacity = request.json["eventSpectatorCapacity"],
                          eventPlayers = event_players,
                          eventSpectators = event_spectators,
                          eventSkillLevel = request.json["eventSkillLevel"],
                          eventLatitude = latLng[0],
                          eventLongitude = latLng[1])

    session.add(new_event)
    session.commit()
    
    return jsonify({col.name: str(getattr(new_event, col.name)) for col in new_event.__table__.columns}), 201


@event_api.route('/api/v1.0/events/<int:event_id>/players', methods=['GET'])
def get_players(event_id):
    event = [event for event in events if event['eventId']==event_id]
    if len(event) == 0:
        abort(404)
    return jsonify({'events': event[0]["events"]})
