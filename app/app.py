from flask import Flask, request
import json

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        uid = request.values.get('uid')
        if uid == "u123":
            name = "Om Shah"
        else:
            name = "User ID not found."
    response_dict = {"name": name}

    return response_dict


@app.route('/auth', methods=['GET', 'POST'])
def auth():
    return "Authenticating..."