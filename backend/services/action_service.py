from flask import jsonify
from bson import ObjectId
from database.mongo import actions_collection

def update_action_service(action_id, data, user_id):

    try:
        obj_id = ObjectId(action_id)
    except:
        return jsonify({"error": "Invalid action ID"}), 400

    valid_fields = ["task", "owner", "priority", "deadline", "status"]

    # Correct dictionary comprehension
    update_data = {k: v for k, v in data.items() if k in valid_fields}

    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    result = actions_collection.update_one(
        {"_id": obj_id, "user_id": user_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Action item not found"}), 404

    return jsonify({"message": "Action updated successfully"}), 200

