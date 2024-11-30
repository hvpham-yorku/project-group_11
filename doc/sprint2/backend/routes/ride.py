import sys
import os
# Dynamically add 'sprint2' to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from flask import Blueprint, Flask, request, jsonify
from firebase_admin import auth
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from backend.models.models import User, DriverDetails, RideRequests
from backend.db.database_setup import db
from backend.services.firebase_setup import initialize_firebase
from backend.helpers.fare_utils import get_distance_and_duration, calculate_fare, reverse_geocode
import requests
from dotenv import load_dotenv


app = Flask(__name__)

# Initialize Firebase
initialize_firebase()

# Load environment variables and set up Firebase authentication URL
load_dotenv()

# Initialize Blueprint
ride_bp = Blueprint('ride', __name__)

FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
FIREBASE_AUTH_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

# Access session and Base
session = db.SessionLocal()
Base = db.Base

@ride_bp.route('/calculate-fare', methods=['POST'])
def calculate_fare_endpoint():
    """Estimate the fare based on origin and destination."""
    try:
        # Get the origin and destination from the request
        data = request.json
        origin = data.get("origin")  # Example: "37.7749,-122.4194"
        destination = data.get("destination")  # Example: "34.0522,-118.2437"

        if not all([origin, destination]):
            return jsonify({"error": "Missing origin or destination"}), 400

        # Use the helper function to calculate distance and duration
        distance, duration = get_distance_and_duration(origin, destination)

        # Use the helper function to calculate fare
        fare = calculate_fare(distance, duration)

        return jsonify({
            "distance_km": round(distance / 1000, 2),
            "duration_min": round(duration / 60, 2),
            "fare": fare
        }), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@ride_bp.route('/set-availability/<int:driver_id>', methods=['POST'])
def set_availability(driver_id):
    """Set driver's availability status."""
    with db.SessionLocal() as session:
        try:
            data = request.json
            availability = data.get("availability")  # Expect "online" or "offline"

            if availability is None:
                return jsonify({"error": "Missing availability status"}), 400

            # Convert "online"/"offline" to boolean
            if availability.lower() == "online":
                is_online = True
            elif availability.lower() == "offline":
                is_online = False
            else:
                return jsonify({"error": "Invalid availability status"}), 400

            # Fetch the driver from the database
            driver = session.query(User).filter_by(user_id=driver_id, user_type="driver").first()

            if not driver:
                return jsonify({"error": "Driver not found"}), 404

            # Update the availability status
            driver.availability = is_online
            session.commit()

            status = "online" if is_online else "offline"
            return jsonify({"message": f"Driver is now {status}"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500


@ride_bp.route('/create-request', methods=['POST'])
def create_ride_request():
    """Allow a passenger to create a ride request."""
    with db.SessionLocal() as session:
        try:
            # Parse request data
            data = request.json
            passenger_id = data.get("passenger_id")
            pickup_location = data.get("pickup_location")
            dropoff_location = data.get("destination")  # Update key to match schema

            # Validate required fields
            if not all([passenger_id, pickup_location, dropoff_location]):
                return jsonify({"error": "Missing required fields"}), 400

            # Validate passenger exists and is of user_type 'passenger'
            passenger = session.query(User).filter_by(user_id=passenger_id, user_type="passenger").first()
            if not passenger:
                return jsonify({"error": "Invalid passenger ID or user is not a passenger"}), 404

            # Parse pickup and destination coordinates
            try:
                pickup_lat, pickup_lng = map(float, pickup_location.split(","))
                dropoff_lat, dropoff_lng = map(float, dropoff_location.split(","))
            except ValueError:
                return jsonify({"error": "Invalid coordinate format"}), 400

            # Create and save ride request
            ride_request = RideRequests(
                passenger_id=passenger_id,
                pickup_location=f"POINT({pickup_lat} {pickup_lng})",
                dropoff_location=f"POINT({dropoff_lat} {dropoff_lng})",
                status='pending'
            )
            session.add(ride_request)
            session.commit()

            return jsonify({"message": "Ride request created successfully!", "request_id": ride_request.request_id}), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 500
        

@ride_bp.route('/view-requests', methods=['POST'])
def view_requests():
    """View ride requests within a certain radius."""
    with db.SessionLocal() as session:
        try:
            # Parse request data
            data = request.json
            driver_id = data.get("driver_id")
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            radius_km = data.get("radius_km", 10)  # Default radius to 10 km

            if not all([driver_id, latitude, longitude]):
                return jsonify({"error": "Missing required fields"}), 400

            # Ensure the driver is online
            driver = session.query(User).filter_by(user_id=driver_id, user_type="driver", availability=True).first()
            if not driver:
                return jsonify({"error": "Driver is not online or does not exist"}), 404

            # Query for nearby requests
            query = text("""
                SELECT r.request_id, r.passenger_id, ST_AsText(r.pickup_location) AS pickup_location,
                    ST_AsText(r.dropoff_location) AS dropoff_location, r.status, u.name AS passenger_name
                FROM "RideRequests" r
                JOIN "Users" u ON r.passenger_id = u.user_id
                WHERE r.status = 'pending'
                AND ST_DWithin(r.pickup_location, ST_MakePoint(:longitude, :latitude)::geography, :radius)
            """)

            results = session.execute(query, {
                "longitude": longitude,
                "latitude": latitude,
                "radius": radius_km * 1000  # Convert to meters
            }).fetchall()

            # Format the response
            ride_requests = []
            for row in results:
                ride_requests.append({
                    "request_id": row.request_id,
                    "passenger_id": row.passenger_id,
                    "pickup_location": row.pickup_location,
                    "dropoff_location": row.dropoff_location,
                    "status": row.status,
                    "passenger_name": row.passenger_name
                })

            return jsonify({"ride_requests": ride_requests}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500


# Register the Blueprint
app.register_blueprint(ride_bp, url_prefix='/ride')


if __name__ == '__main__':
    app.run(debug=True)
