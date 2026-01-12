from flask import Blueprint, request, jsonify
from models.user_model import create_user, get_user_by_email, verify_password
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth_routes", __name__)

@auth_bp.post("/auth/signup")
def signup_route():
    data = request.json

    if get_user_by_email(data["email"]):
        return jsonify({"message": "User already exists"}), 400

    create_user(data["name"], data["email"], data["password"])
    return jsonify({"message": "Signup successful"}), 201


@auth_bp.post("/auth/login")
def login_route():
    data = request.json
    user = get_user_by_email(data["email"])

    if not user or not verify_password(user["password"], data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user["_id"]))

    return jsonify({
        "token": token,
        "user": {"name": user["name"], "email": user["email"]}
    })
