from flask import jsonify
from bson import ObjectId
from datetime import datetime

import traceback

from database.mongo import meetings_collection, actions_collection
from services.ai_service import run_ai
from services.utils.text_utils import normalize_text



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
    try:
        meeting = {
            # REQUIRED
            "notes": data["notes"],

            # OPTIONAL (SAFE)
            "meeting_type": data.get("meeting_type", "General"),
            "participants": data.get("participants", []),

            # METADATA
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

    except Exception as e:
        print("ERROR in create_meeting_service:", str(e))
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500


def process_meeting_service(data, user_id):
    try:
        meeting_id = data["meeting_id"]
        notes = data["notes"]

        # Run AI processing
        parsed = run_ai(notes)

        # STEP 1 — Reset fields in meeting document
        meetings_collection.update_one(
            {"_id": ObjectId(meeting_id)},
            {"$set": {
                "summary": parsed["summary"],
                "key_decisions": parsed["key_decisions"],
                "action_items": []
            }}
        )

        # STEP 2 — Validate and clean action items
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

        # Save cleaned items to meeting document
        meetings_collection.update_one(
            {"_id": ObjectId(meeting_id)},
            {"$set": {"action_items": cleaned_items}}
        )

        # STEP 3 — SAFELY UPDATE ACTION ITEMS in actions_collection
        existing_items = list(actions_collection.find({"meeting_id": ObjectId(meeting_id)}))
        existing_lookup = {item["task"].lower(): item for item in existing_items}

        for item in cleaned_items:
            task_key = item["task"].lower()

            if task_key in existing_lookup:
                # UPDATE existing item
                actions_collection.update_one(
                    {"_id": existing_lookup[task_key]["_id"]},
                    {"$set": {
                        "owner": item["owner"],
                        "priority": item["priority"],
                        "deadline": item["deadline"]
                    }}
                )
                existing_lookup.pop(task_key)
            else:
                # INSERT new item
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

        # DELETE items no longer present
        for leftover in existing_lookup.values():
            actions_collection.delete_one({"_id": leftover["_id"]})

        # RETURN response to frontend
        return jsonify({
            "summary": parsed["summary"],
            "key_decisions": parsed["key_decisions"],
            "action_items": cleaned_items
        }), 200

    except Exception as e:
        print("ERROR in process_meeting_service:", str(e))
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
