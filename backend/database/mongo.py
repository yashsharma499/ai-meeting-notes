from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config import Config


client = MongoClient(Config.MONGO_URL, serverSelectionTimeoutMS=3000)


try:
    client.admin.command("ping")
    print("MongoDB Connected Successfully")
except ConnectionFailure as e:
    print("ERROR: MongoDB connection failed:", str(e))
    raise SystemExit("Cannot start server without MongoDB connection")

db = client["ai_meeting_app"]

users_collection = db["users"]
meetings_collection = db["meetings"]
actions_collection = db["actions"]

users_collection.create_index("email", unique=True)
meetings_collection.create_index("user_id")
actions_collection.create_index("user_id")
actions_collection.create_index("meeting_id")

