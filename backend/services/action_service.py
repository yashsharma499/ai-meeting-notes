from flask import jsonify
from bson import ObjectId
from database.mongo import actions_collection
import traceback

def update_action_service(action_id, data, user_id):
    try:
        # Validate ObjectId
        try:
            obj_id = ObjectId(action_id)
        except Exception:
            return jsonify({"error": "Invalid action ID"}), 400

        valid_fields = ["task", "owner", "priority", "deadline", "status"]

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

    except Exception as e:
        print("ERROR in update_action_service:", str(e))
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500


