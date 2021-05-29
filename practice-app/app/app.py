import requests
from flask import Flask, jsonify, abort, request
from datetime import datetime
import urllib
app = Flask(__name__)

events = [
    {
        "eventId": 1,
        "owner": "emre_gundogu",
        "title":  "Tennis Game for Everyone",
        "content": "People who are looking for a tennis court can apply this event. Our court is for you if you are seeking for a clean and well-lit court.",
        "location": "Bebek Tennis Club",
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
        "firstName": "Emre",
        "lastName": "Gundogu",
        "biography": "Hello, I am a 28 year-old football fan",
        "age": "28",
        "avatar": "url_to_image",
        "location": "Istanbul",
        "favSports": ["football", "basketball"],
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


@app.route('/api/v1.0/spectators/<int:event_id>', methods=['GET'])
def get_spectators(event_id):
    event = [event for event in events if event['eventId'] == event_id]
    if len(event) == 0:
        abort(404)
    return jsonify({'spectators': event[0]["spectators"]})



@app.route('/api/v1.0/events/<int:event_id>', methods=['GET'])
def get_players(event_id):
    event = [event for event in events if event['eventId']==event_id]
    if len(event) == 0:
        abort(404)
    return jsonify({'evetns': event[0]["events"]})



@app.route('/api/v1.0/events/<int:event_id>', methods=['POST'])
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
                     "firstName": json_data[0]["firstName"],
                     "lastName": json_data[0]["lastName"],
                     "biography": json_data[0]["biography"],
                     "age": json_data[0]["age"],
                     "avatar": json_data[0]["avatar"],
                     "location": json_data[0]["location"],
                     "favSports": json_data[0]["favSports"],
                     "badges": json_data[0]["badges"],
                     "privacy": json_data[0]["privacy"]}
        print(new_user)
        users.append(new_user)
        user.append(new_user)
        print(users)

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


@app.route('/api/v1.0/equipments', method=['POST'])
def create_equipment_post():
	# Creates the equipment post
	if len(equipments) != 0:
		new_equipment = {
			"postId": equipments[-1]['postId'] + 1,
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
