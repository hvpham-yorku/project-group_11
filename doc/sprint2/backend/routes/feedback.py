
import sys
import os
# Dynamically add 'sprint2' to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from flask import Flask, Blueprint, request, jsonify
from firebase_admin import auth
from sqlalchemy.exc import IntegrityError
from backend.models.models import User, DriverDetails, BankAccount, RideRequests, Complaints, COMPLAINT_TYPE_ENUM
from backend.db.database_setup import db
from backend.services.firebase_setup import initialize_firebase
import requests
from dotenv import load_dotenv


app = Flask(__name__)

# Initialize Firebase
initialize_firebase()

# Initialize Blueprint
feedback_bp = Blueprint('feedback', __name__)


# Load environment variables and set up Firebase authentication URL
load_dotenv()
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
FIREBASE_AUTH_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

# Access session and Base
session = db.SessionLocal()
Base = db.Base


@feedback_bp.route("/submit-complaint", methods=["POST"])
def submit_complaint():
    """Allow a user to submit a complaint."""
    with db.SessionLocal() as session:
        try:
            data = request.json
            user_id = data.get("user_id")
            ride_id = data.get("ride_id")
            complaint_text = data.get("complaint_text")
            complaint_type = data.get("complaint_type").strip().lower()  # Normalize input

            # Validate required fields
            if not all([user_id, complaint_text, complaint_type]):
                return jsonify({"error": "Missing required fields"}), 400

            if complaint_type not in COMPLAINT_TYPE_ENUM:
                return jsonify({"error": f"Invalid complaint type. Valid types: {', '.join(COMPLAINT_TYPE_ENUM)}"}), 400

            # Validate user exists
            user = session.query(User).filter_by(user_id=user_id).first()
            if not user:
                return jsonify({"error": "User not found"}), 404

            # Validate ride if provided
            if ride_id:
                ride = session.query(RideRequests).filter_by(request_id=ride_id).first()
                if not ride:
                    return jsonify({"error": "Ride not found"}), 404

                # Check if a complaint for this ride already exists by the same user
                existing_complaint = session.query(Complaints).filter_by(user_id=user_id, ride_id=ride_id).first()
                if existing_complaint:
                    return jsonify({
                        "error": "You have already submitted a complaint for this ride.",
                        "complaint_id": existing_complaint.complaint_id
                    }), 400

            # Create complaint entry
            complaint = Complaints(
                user_id=user_id,
                ride_id=ride_id,
                complaint_text=complaint_text,
                complaint_type=complaint_type,
                status="open"
            )
            session.add(complaint)
            session.commit()

            return jsonify({"message": "Complaint submitted successfully!", "complaint_id": complaint.complaint_id}), 201

        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500

# Register the Blueprint
app.register_blueprint(feedback_bp, url_prefix="/feedback")  # Register the Blueprint with a URL prefix
