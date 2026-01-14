from flask import jsonify
from bson import ObjectId
from datetime import datetime
import unicodedata

from database.mongo import meetings_collection, actions_collection
from services.ai_service import run_ai

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return text.replace("–", "-").replace("—", "-").replace("−", "-")


def validate_deadline(deadline: str, original_notes: str) -> str:

    if not deadline or not isinstance(deadline, str):
        return ""

    dl = normalize_text(deadline.strip().lower())
    notes = normalize_text(original_notes.strip().lower())
    notes_words = notes.split()

    
    weekdays = ["monday", "tuesday", "wednesday", "thursday", 
                "friday", "saturday", "sunday"]

    
    if dl in weekdays and dl in notes_words:
        return dl.capitalize()

   
    return ""


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

    # Run AI processing
    parsed = run_ai(notes)

    # STEP 1 — Reset fields
    meetings_collection.update_one(
        {"_id": ObjectId(meeting_id)},
        {"$set": {
            "summary": parsed["summary"],
            "key_decisions": parsed["key_decisions"],
            "action_items": []
        }}
    )

    # STEP 2 — Validate action items
    cleaned_items = []
    for item in parsed["action_items"]:
        raw_dl = normalize_text(item.get("deadline", "").strip())
        final_dl = validate_deadline(raw_dl, notes)

        cleaned_items.append({
            "task": normalize_text(item.get("task", "")),
            "owner": normalize_text(item.get("owner", "Unassigned")),
            "priority": normalize_text(item.get("priority", "Medium")).capitalize(),
            "deadline": final_dl
        })

    # SAVE CLEANED ITEMS
    meetings_collection.update_one(
        {"_id": ObjectId(meeting_id)},
        {"$set": {"action_items": cleaned_items}}
    )

    # STEP 3 — Replace actions collection
    actions_collection.delete_many({"meeting_id": ObjectId(meeting_id)})

    for item in cleaned_items:
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

    return jsonify({
        "summary": parsed["summary"],
        "key_decisions": parsed["key_decisions"],
        "action_items": cleaned_items
    }), 200
