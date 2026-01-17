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
    owner: str | None = Field(None, min_length=1)
    priority: str | None = Field(None, min_length=1)
    deadline: str | None = Field(None)

@action_bp.get("/")
@jwt_required()
def get_actions_route():
    user_id = get_jwt_identity()

    
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    skip = (page - 1) * limit

    
    cursor = actions_collection.find({"user_id": user_id}).skip(skip).limit(limit)
    actions = list(cursor)

    
    for a in actions:
        a["_id"] = str(a["_id"])
        a["meeting_id"] = str(a["meeting_id"])

    
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
    user_id = get_jwt_identity()

    
    if not ObjectId.is_valid(action_id):
        return {"error": "Invalid action ID"}, 400

   
    try:
        body = UpdateActionSchema(**request.json)
    except ValidationError as e:
        return {"errors": e.errors()}, 400

    data = body.model_dump(exclude_none=True)

    
    for key in data:
        if isinstance(data[key], str):
            data[key] = data[key].strip()

   
    data = {k: v for k, v in data.items() if v != ""}

   
    if not data:
        return {"error": "No valid fields to update"}, 400

    return update_action_service(action_id, data, user_id)