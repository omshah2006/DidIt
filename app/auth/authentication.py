import bcrypt
import uuid

class Authentication:
    def __init__(self, cursor):
        self.cursor = cursor
        
    def login(self, password):
        #Temp password
        real_pass = "password123"
        #Temporarily hash - normally would be retrieved from DB in hash format
        real_pass_hash = self.hash_pass(real_pass)
        success = check_pass(password, real_pass_hash)

        return success
    
    def signup(self, first_name, last_name, username, password):
        query = 'INSERT INTO `didit_accounts`(`uid`, `first_name`, `last_name`, `username`, `password`) VALUES (%s, %s, %s, %s, %s);'
        uid = generate_id(username)
        password = get_hashed_password(password)
        query_vars = (uid, first_name, last_name. username, password)
        self.cursor.execute(query, query_vars)

        return True

    def hash_pass(plain_text_password):
        return bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_pass(plain_text_password, hashed_password):
        return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_password.encode('utf-8'))

    def generate_id(username):
        myuuid = uuid.uuid4()
        id = str(myuuid)
        return id