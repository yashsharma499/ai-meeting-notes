from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.action_service import update_action_service
from database.mongo import actions_collection

action_bp = Blueprint("action_routes", __name__)

@action_bp.get("/actions")
@jwt_required()
def get_actions_route():
    user_id = get_jwt_identity()

    actions = list(actions_collection.find({"user_id": user_id}))
    for a in actions:
        a["_id"] = str(a["_id"])
        a["meeting_id"] = str(a["meeting_id"])

    return actions, 200

@action_bp.patch("/actions/<action_id>")
@jwt_required()
def update_action_route(action_id):
    return update_action_service(action_id, request.json, get_jwt_identity())
