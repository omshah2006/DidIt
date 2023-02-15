from flask import Flask, request
import json

app = Flask(__name__)

@app.route('/')
def index():
    
    return "Handling API..."

@app.route('/auth')
def auth():
    return "Authenticating..."
