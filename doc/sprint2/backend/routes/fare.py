import sys
import os
# Dynamically add 'sprint2' to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from flask import Blueprint, Flask, request, jsonify
from firebase_admin import auth
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text, func
from backend.models.models import User, DriverDetails, RideRequests, Payment, BankAccount
from backend.db.database_setup import db
from backend.services.firebase_setup import initialize_firebase
from backend.helpers.fare_utils import get_distance_and_duration, calculate_fare, reverse_geocode, parse_wkt_point
import requests
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta

app = Flask(__name__)

# Initialize Firebase
initialize_firebase()

# Load environment variables and set up Firebase authentication URL
load_dotenv()

# Initialize Blueprint
fare_bp = Blueprint('fare_bp', __name__)

FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
FIREBASE_AUTH_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Access session and Base
session = db.SessionLocal()
Base = db.Base

@fare_bp.route("/driver-payment-history/<int:driver_id>", methods=["GET"])
def driver_payment_history(driver_id):
    """Retrieve payment history for a driver."""
    try:
        # Check if the driver exists and is valid
        driver = session.query(User).filter_by(user_id=driver_id, user_type="driver").first()
        if not driver:
            return jsonify({"error": "Driver not found or invalid driver ID"}), 404

        # Query completed rides for the driver
        payments = (
            session.query(Payment)
            .join(RideRequests, Payment.ride_id == RideRequests.request_id)
            .filter(RideRequests.driver_id == driver_id, Payment.payment_status == "completed")
            .all()
        )

        # Format response
        payment_history = [
            {
                "ride_id": payment.ride_id,
                "amount": float(payment.amount),
                "payment_status": payment.payment_status,
                "date": payment.created_at.strftime("%Y-%m-%d %H:%M:%S")
            }
            for payment in payments
        ]

        return jsonify({"payment_history": payment_history}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Register the Blueprint
app.register_blueprint(fare_bp, url_prefix="/fare")  # Register the Blueprint with a URL prefix

if __name__ == '__main__':
    for rule in app.url_map.iter_rules():
        print(f"Endpoint: {rule.endpoint}, URL: {rule}")
    app.run(debug=True)
