import requests
from flask import Flask, jsonify, abort, request
from datetime import datetime

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

equipments = [
	{
		"EquipmentId": 1,
		"EquipmentType": "Ball",
		"EquipmentCondition": "Well",
		"Explanation": "A well conditioned soccer ball"
	}
]


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



@app.route('/api/v1.0/spectators/<int:event_id>', methods=['GET'])
def get_spectators(event_id):
    event = [event for event in events if event['eventId'] == event_id]
    if len(event) == 0:
        abort(404)
    return jsonify({'spectators': event[0]["spectators"]})

@app.route('/api/v1.0/events/<int:event_id>', methods=['POST'])
def apply_as_player(event_id):
    body = request.json
    print(body)
    user_id = body["userId"]
    event = [event for event in events if event["eventId"] == event_id]
    user = [user for user in users if user["userId"] == user_id]
    if len(event) == 0 or len(user) == 0:
        abort(404)
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
def create_equipment():
	#Creates the equipment post
	if len(equipments) != 0:
		new_equipment = {
			"EquipmentId": equipments[-1]['EquipmentId'] + 1,
			"EquipmentType": request.json['EquipmentType'],
			"EquipmentCondition": request.json["EquipmentCondition"],
			"Explanation": request.json["Explanation"]
		}
	else:
		new_equipment = {
			"EquipmentId": 1,
			"EquipmentType": request.json['EquipmentType'],
			"EquipmentCondition": request.json["EquipmentCondition"],
			"Explanation": request.json["Explanation"]
		}
	equipments.append(new_equipment)
	return jsonify({"equipment": new_equipment}), 201


if __name__ == '__main__':
    app.run(debug=True)
