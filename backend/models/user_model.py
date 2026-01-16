from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os
import traceback

client = MongoClient(os.getenv("MONGO_URL"))
db = client["ai_meeting_app"]
users = db["users"]

def create_user(name, email, password):
    try:
        hashed = generate_password_hash(password)
        user = {
            "name": name,
            "email": email,
            "password": hashed
        }
        users.insert_one(user)
        return user
    except Exception as e:
        print("ERROR in create_user:", str(e))
        traceback.print_exc()
        return None


def get_user_by_email(email):
    try:
        return users.find_one({"email": email})
    except Exception as e:
        print("ERROR in get_user_by_email:", str(e))
        traceback.print_exc()
        return None


def verify_password(hash, password):
    try:
        return check_password_hash(hash, password)
    except Exception as e:
        print("ERROR in verify_password:", str(e))
        traceback.print_exc()
        return False
