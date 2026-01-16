
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
import traceback
from routes.meeting_routes import meeting_bp
from routes.action_routes import action_bp
from routes.auth_routes import auth_bp

load_dotenv()

app = Flask(__name__)

ALLOWED_ORIGINS = [
    "https://ai-meeting-notes-zeta.vercel.app",
    "http://localhost:5173"
]

CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})

jwt_secret = os.getenv("JWT_SECRET_KEY")

if not jwt_secret or len(jwt_secret) < 16:
    raise ValueError("ERROR: Invalid or missing JWT_SECRET_KEY. Please set a secure key in the environment variables.")

app.config["JWT_SECRET_KEY"] = jwt_secret
jwt = JWTManager(app)


app.register_blueprint(meeting_bp)
app.register_blueprint(action_bp)
app.register_blueprint(auth_bp)

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
