from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/api/v1.0/', methods=['GET'])
def index():
    return jsonify({'message': 'hello world'}), 200  # mock message as an example


if __name__ == '__main__':
    app.run(debug=True)
