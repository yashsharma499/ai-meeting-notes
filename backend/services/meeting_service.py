from flask import jsonify
from bson import ObjectId
from datetime import datetime

from database.mongo import meetings_collection, actions_collection
from services.ai_service import run_ai

def create_meeting_service(data, user_id):
    meeting = {
        "notes": data["notes"],
        "meeting_type": data["meeting_type"],
        "participants": data["participants"],
        "created_at": datetime.utcnow().isoformat(),
        "summary": None,
        "key_decisions": [],
        "action_items": [],
        "user_id": user_id
    }

    inserted = meetings_collection.insert_one(meeting)

    return jsonify({
        "message": "Meeting created successfully",
        "meeting_id": str(inserted.inserted_id)
    }), 201


def process_meeting_service(data, user_id):

    meeting_id = data["meeting_id"]
    notes = data["notes"]

    parsed = run_ai(notes)

    meetings_collection.update_one(
        {"_id": ObjectId(meeting_id)},
        {"$set": {
            "summary": parsed["summary"],
            "key_decisions": parsed["key_decisions"],
            "action_items": parsed["action_items"]
        }}
    )

    for item in parsed["action_items"]:
        actions_collection.insert_one({
            "meeting_id": ObjectId(meeting_id),
            "task": item["task"],
            "owner": item["owner"],
            "priority": item["priority"],
            "deadline": item["deadline"],
            "status": "Pending",
            "created_at": datetime.utcnow().isoformat(),
            "user_id": user_id
        })

    return jsonify(parsed), 200
