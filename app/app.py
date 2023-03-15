from flask import Flask, request
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import json
import os
import platform

if (platform.system() == 'Darwin'):
    import auth.Authentication
else:
    import public.DidIt.app.auth.Authentication

# Load app keys
load_dotenv()
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
print(MYSQL_PASSWORD)

# Configure Flask server
app = Flask(__name__)
app.config['MYSQL_HOST'] = 'mysql.2223.lakeside-cs.org'
app.config['MYSQL_USER'] = 'student2223'
app.config['MYSQL_PASSWORD'] = MYSQL_PASSWORD
app.config['MYSQL_DB'] = '2223project_1'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

# Routing
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        uid = request.values.get('uid')
        if uid == "u123":
            name = "Om Shah"
        else:
            name = "User ID not found."
    response = {"name": name}

    return response

@app.route('/login', methods=['GET', 'POST'])
def login():
    cursor = mysql.connection.cursor()
    if request.method == 'POST':
        username = request.values.get('username')
        password = request.values.get('password')

        auth = Authentication(cursor)
        auth.login(username, password)

    response = {"status": "Signed in"}

    return response

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    cursor = mysql.connection.cursor()
    if request.method == 'POST':
        first_name = request.values.get('first_name')
        last_name = request.values.get('last_name')
        username = request.values.get('username')
        password = request.values.get('password')

        auth = Authentication(cursor)
        auth.signup(first_name, last_name, username, password)

    response = {"status": "Signed up"}
    
    return response