from flask import Blueprint, request 
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.action_service import update_action_service
from database.mongo import actions_collection
from pydantic import BaseModel, Field, ValidationError
from bson.objectid import ObjectId

action_bp = Blueprint("action_routes", __name__)

class UpdateActionSchema(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    status: str | None = Field(None, min_length=1)

@action_bp.get("/")
@jwt_required()
def get_actions_route():
    user_id = get_jwt_identity()

    # Read pagination params
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    skip = (page - 1) * limit

    # Query with pagination
    cursor = actions_collection.find({"user_id": user_id}).skip(skip).limit(limit)
    actions = list(cursor)

    # Convert ObjectId fields to strings
    for a in actions:
        a["_id"] = str(a["_id"])
        a["meeting_id"] = str(a["meeting_id"])

    # Count total actions
    total = actions_collection.count_documents({"user_id": user_id})

    return {
        "data": actions,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1) // limit
    }, 200

@action_bp.patch("/<action_id>")
@jwt_required()
def update_action_route(action_id):

    # Validate ObjectId
    if not ObjectId.is_valid(action_id):
        return {"error": "Invalid action ID"}, 400

    # Validate input body
    try:
        body = UpdateActionSchema(**request.json)
    except ValidationError as e:
        return {"errors": e.errors()}, 400

    data = body.model_dump(exclude_none=True)

    # Sanitize strings
    if "title" in data:
        data["title"] = data["title"].strip()
    if "status" in data:
        data["status"] = data["status"].strip()

    return update_action_service(action_id, data, get_jwt_identity())
