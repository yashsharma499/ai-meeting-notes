from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.meeting_service import create_meeting_service, process_meeting_service
from pydantic import BaseModel, Field, ValidationError

meeting_bp = Blueprint("meeting_routes", __name__)

class CreateMeetingSchema(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    notes: str = Field(..., min_length=1)

class ProcessMeetingSchema(BaseModel):
    content: str = Field(..., min_length=5)

@meeting_bp.post("/meetings/create")
@jwt_required()
def create_meeting_route():
    try:
        body = CreateMeetingSchema(**request.json)
    except ValidationError as e:
        return {"error": e.errors()}, 400

    return create_meeting_service(body.model_dump(), get_jwt_identity())

@meeting_bp.post("/meetings/process")
@jwt_required()
def process_meeting_route():
    try:
        body = ProcessMeetingSchema(**request.json)
    except ValidationError as e:
        return {"error": e.errors()}, 400

    return process_meeting_service(body.model_dump(), get_jwt_identity())

@meeting_bp.get("/meetings")
@jwt_required()
def get_meetings_route():
    from database.mongo import meetings_collection
    user_id = get_jwt_identity()

    meetings = list(meetings_collection.find({"user_id": user_id}))
    for m in meetings:
        m["_id"] = str(m["_id"])

    return meetings, 200
