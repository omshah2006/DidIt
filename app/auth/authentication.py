import bcrypt
import uuid

class Authentication:
    def __init__(self, Identity)
        self.identity = Identity
        
    def login(self.identity, password):
        #Temp password
        real_pass = "password123"
        #Temporarily hash - normally would be retrieved from DB in hash format
        real_pass_hash = self.get_hashed_password(real_pass)
        success = check_password(password, real_pass_hash)

        return success
    
    def signup():
        pass

    def get_hashed_password(plain_text_password):
        return bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(plain_text_password, hashed_password):
        return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_password.encode('utf-8'))