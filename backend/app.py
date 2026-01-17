
from flask import Flask , request

from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
import traceback
from routes.meeting_routes import meeting_bp
from routes.action_routes import action_bp
from routes.auth_routes import auth_bp

from pymongo.errors import ConnectionFailure
from database.mongo import client as mongo_client
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from config import Config

load_dotenv()

def validate_config():
    required_keys = [
        "GROQ_API_KEY",
        "MONGO_URL",
        "JWT_SECRET_KEY"
    ]

    for key in required_keys:
        value = getattr(Config, key, None)
        if not value:
            raise RuntimeError(f"❌ Missing required configuration: {key}")

validate_config()

try:
    mongo_client.admin.command("ping")
    print("MongoDB Connected Successfully")
except ConnectionFailure as e:
    print("ERROR: MongoDB connection failed:", str(e))
    raise SystemExit("Cannot start server without MongoDB connection")

app = Flask(__name__)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per hour"]  
)

ALLOWED_ORIGINS = [
    "https://ai-meeting-notes-zeta.vercel.app",
    "http://localhost:5173"
]

CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)
jwt_secret = os.getenv("JWT_SECRET_KEY")

if not jwt_secret or len(jwt_secret) < 16:
    raise ValueError("ERROR: Invalid or missing JWT_SECRET_KEY. Please set a secure key in the environment variables.")

app.config["JWT_SECRET_KEY"] = jwt_secret
jwt = JWTManager(app)

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return "", 200


app.register_blueprint(meeting_bp, url_prefix="/meetings")
app.register_blueprint(action_bp, url_prefix="/actions")
app.register_blueprint(auth_bp, url_prefix="/auth")

@app.get("/")
def home():
    return {"message": "Flask backend running"}

@app.errorhandler(Exception)
def handle_global_error(e):
    print("GLOBAL ERROR:", str(e))
    traceback.print_exc()
    return {"error": "Internal server error"}, 500 

if __name__ == "__main__":
    debug_mode = os.getenv("DEBUG", "False") == "True"
    app.run(debug=debug_mode)
