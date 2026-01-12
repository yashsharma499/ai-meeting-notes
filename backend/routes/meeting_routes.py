from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.meeting_service import create_meeting_service, process_meeting_service

meeting_bp = Blueprint("meeting_routes", __name__)

@meeting_bp.post("/meetings/create")
@jwt_required()
def create_meeting_route():
    return create_meeting_service(request.json, get_jwt_identity())

@meeting_bp.post("/meetings/process")
@jwt_required()
def process_meeting_route():
    return process_meeting_service(request.json, get_jwt_identity())

@meeting_bp.get("/meetings")
@jwt_required()
def get_meetings_route():
    from database.mongo import meetings_collection
    user_id = get_jwt_identity()

    meetings = list(meetings_collection.find({"user_id": user_id}))
    for m in meetings:
        m["_id"] = str(m["_id"])

    return meetings, 200
