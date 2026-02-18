from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.meeting_service import create_meeting_service, process_meeting_service
from database.mongo import meetings_collection
from pydantic import BaseModel, Field, ValidationError
from bson import ObjectId

meeting_bp = Blueprint("meeting_routes", __name__)

class CreateMeetingSchema(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    notes: str = Field(..., min_length=1)

class ProcessMeetingSchema(BaseModel):
    meeting_id: str = Field(..., min_length=5)
    notes: str = Field(..., min_length=5)

@meeting_bp.post("/create")
@jwt_required()
def create_meeting_route():
    try:
        body = CreateMeetingSchema(**request.json)
    except ValidationError as e:
        return {"error": e.errors()}, 400

    return create_meeting_service(body.model_dump(), get_jwt_identity())

@meeting_bp.post("/process")
@jwt_required()
def process_meeting_route():
    try:
        body = ProcessMeetingSchema(**request.json)
    except ValidationError as e:
        return {"error": e.errors()}, 400

    return process_meeting_service(body.model_dump(), get_jwt_identity())

@meeting_bp.get("/")
@jwt_required()
def get_meetings():
    user_id = get_jwt_identity()

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    skip = (page - 1) * limit

    cursor = meetings_collection.find({"user_id": user_id}).skip(skip).limit(limit)
    meetings = list(cursor)

    for m in meetings:
        m["_id"] = str(m["_id"])

    total = meetings_collection.count_documents({"user_id": user_id})

    return jsonify({
        "data": meetings,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1) // limit
    }), 200
@meeting_bp.get("/<meeting_id>")
@jwt_required()
def get_meeting_by_id(meeting_id):
    user_id = get_jwt_identity()

    # Validate ObjectId
    if not ObjectId.is_valid(meeting_id):
        return {"error": "Invalid meeting ID"}, 400

    meeting = meetings_collection.find_one({
        "_id": ObjectId(meeting_id),
        "user_id": user_id
    })

    if not meeting:
        return {"error": "Meeting not found"}, 404

    meeting["_id"] = str(meeting["_id"])

    return jsonify(meeting), 200