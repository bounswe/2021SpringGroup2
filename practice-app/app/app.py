import requests
from flask import Flask, jsonify, abort, Response

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
        "nickname": "emre_gundogdu",
        "firstName": "Emre",
        "lastName": "Gundogdu",
        "biography": "Hello, I am a 28 year-old football fan",
        "age": "28",
        "avatar": "url_to_image",
        "location": "Istanbul",
        "favSports": ["football", "basketball"],
        "badges": ["good_player", "serious"],
        "privacy": "public",
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


@app.route('/api/v1.0/events/<int:event_id>/players/<int:user_id>', methods=['POST'])
def applyAsPlayer(event_id, user_id):
    event = [event for event in events if event['eventId'] == event_id]
    user = [user for user in users if user['userId'] == user_id]
    if len(event) == 0:
        abort(404)
    event[0]["players"].append(user[0]['nickname'])
    response = Response("%s applied to event %s" % (user[0]["nickname"], event[0]["title"]), 201, mimetype='application/json')
    return response


if __name__ == '__main__':
    app.run(debug=True)
