import bcrypt
import uuid

class Authentication:
    def __init__(self, cursor):
        self.cursor = cursor
        
    def login(self, username, password):
        query = 'SELECT `id`, `password` FROM `didit_accounts` WHERE `username` = %s'
        queryVars = (username, )
        cursor.execute(query, queryVars)
        data = cursor.fetchall()

        # Checks if user is in users table
        if (len(data) == 0):
            message = "Username not found."
            return message

        # Checks if user password is correct
        hashed_password = data[0]['password']
        is_valid = check_pass(password, hashed_password)
        if (is_valid == False):
            message = "Incorrect password"
            return message
        else:
            #Initiate session on server
            message = "Signed in"
            return message
    
    def signup(self, first_name, last_name, username, password):
        query = 'INSERT INTO `didit_accounts`(`uid`, `first_name`, `last_name`, `username`, `password`) VALUES (%s, %s, %s, %s, %s)'
        uid = self.generate_id(username)
        password = self.hash_pass(password)
        query_vars = (uid, first_name, last_name, username, password)
        self.cursor.execute(query, query_vars)

        return True

    def hash_pass(self, plain_text_password):
        return bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_pass(self, plain_text_password, hashed_password):
        return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_password.encode('utf-8'))

    def generate_id(self, username):
        myuuid = uuid.uuid4()
        id = str(myuuid)
        return id