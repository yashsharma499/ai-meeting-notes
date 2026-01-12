from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URL)
db = client["ai_meeting_app"]

meetings_collection = db["meetings"]
actions_collection = db["action_items"]
