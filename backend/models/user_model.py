from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os

client = MongoClient(os.getenv("MONGO_URL"))
db = client["ai_meeting_app"]
users = db["users"]

def create_user(name, email, password):
    hashed = generate_password_hash(password)
    user = {
        "name": name,
        "email": email,
        "password": hashed
    }
    users.insert_one(user)
    return user

def get_user_by_email(email):
    return users.find_one({"email": email})

def verify_password(hash, password):
    return check_password_hash(hash, password)
