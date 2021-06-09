from flask import Flask, jsonify, abort, request, send_from_directory, render_template
app = Flask(__name__, static_folder='./static', template_folder="./")



@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path=""):
    print(path)
    print("sa")
    return render_template('index.html')

app.run(debug=True)