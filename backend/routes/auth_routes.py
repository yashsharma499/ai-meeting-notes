from flask import Blueprint, request, jsonify
from models.user_model import create_user, get_user_by_email, verify_password
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
from pydantic import BaseModel, EmailStr, Field, ValidationError

auth_bp = Blueprint("auth_routes", __name__)

class SignupSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


@auth_bp.post("/auth/signup")
def signup_route():
    try:
        body = SignupSchema(**request.json)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), 400

    data = body.model_dump()
    name = data["name"].strip()
    email = data["email"].lower().strip()
    password = data["password"].strip()

    # Password validation
    import re
    password_pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
    if not re.match(password_pattern, password):
        return jsonify({
            "message": "Password must contain at least 8 characters, including uppercase, lowercase, and numbers."
        }), 400

    # Check if user exists
    if get_user_by_email(email):
        return jsonify({"message": "User already exists"}), 400

    create_user(name, email, password)
    return jsonify({"message": "Signup successful"}), 201


@auth_bp.post("/auth/login")
def login_route():
    try:
        body = LoginSchema(**request.json)
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), 400

    data = body.model_dump()
    email = data["email"].lower().strip()
    password = data["password"].strip()

    user = get_user_by_email(email)

    if not user or not verify_password(user["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Generate access + refresh tokens
    access_token = create_access_token(identity=str(user["_id"]))
    refresh_token = create_refresh_token(identity=str(user["_id"]))

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    })


@auth_bp.post("/auth/refresh")
@jwt_required(refresh=True)
def refresh_token_route():
    user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=user_id)
    return jsonify({"access_token": new_access_token})
