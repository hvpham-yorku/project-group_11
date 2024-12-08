import os
from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
from backend.db.database_setup import db
from backend.models.models import Base
from backend.services.firebase_setup import initialize_firebase
from backend.routes.auth import auth_bp
from backend.routes.ride import ride_bp
from backend.routes.fare import fare_bp
from backend.routes.feedback import feedback_bp

# Load environment variables
load_dotenv()

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})  # Replace '*' with specific origins if needed

# Initialize Firebase
initialize_firebase()

# Access session and Base
session = db.SessionLocal()
Base = db.Base

# Create tables if they don't exist
with app.app_context():
    Base.metadata.create_all(bind=db.engine)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")  # Routes for authentication
app.register_blueprint(ride_bp, url_prefix="/ride")  # Routes for Ride Requests
app.register_blueprint(fare_bp, url_prefix="/fare")  # Routes for fare and payment
app.register_blueprint(feedback_bp, url_prefix="/feedback")  # Routes for feedback and complaints

# Add a health check endpoint
@app.route("/")
def health_check():
    return {"message": "RideEase backend is running!"}, 200

# Add a route to list all registered routes
@app.route("/routes")
def list_routes():
    from flask import jsonify

    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "url": str(rule)
        })

    return jsonify(routes)

# Run the app
if __name__ == "__main__":
    app.run(debug=True)