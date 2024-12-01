import sys
import os
# Dynamically add 'sprint2' to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from flask import Blueprint, Flask, request, jsonify
from firebase_admin import auth
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text, func
from backend.models.models import User, DriverDetails, RideRequests
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
ride_bp = Blueprint('ride', __name__)

FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
FIREBASE_AUTH_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


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

            # Check for existing active ride request
            active_request = session.query(RideRequests).filter_by(passenger_id=passenger_id).filter(
                RideRequests.status.in_(['pending', 'in progress'])
            ).first()
            if active_request:
                return jsonify({"error": "You already have an active ride request"}), 400

            # Parse pickup and destination coordinates
            try:
                pickup_lat, pickup_lng = map(float, pickup_location.split(","))
                dropoff_lat, dropoff_lng = map(float, dropoff_location.split(","))
            except ValueError:
                return jsonify({"error": "Invalid coordinate format"}), 400

            # Create and save ride request
            ride_request = RideRequests(
                passenger_id=passenger_id,
                pickup_location=f"SRID=4326;POINT({pickup_lng} {pickup_lat})",  # Include SRID for geography
                dropoff_location=f"SRID=4326;POINT({dropoff_lng} {dropoff_lat})",  # Include SRID for geography
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

@ride_bp.route('/accept-request', methods=['POST'])
def accept_ride_request():
    """Allow a driver to accept a ride request."""
    with db.SessionLocal() as session:
        try:
            # Parse request data
            data = request.json
            driver_id = data.get("driver_id")
            request_id = data.get("request_id")

            # Validate required fields
            if not all([driver_id, request_id]):
                return jsonify({"error": "Missing driver_id or request_id"}), 400

            # Validate driver exists and is online
            driver = session.query(User).filter_by(user_id=driver_id, user_type="driver", availability=True).first()
            if not driver:
                return jsonify({"error": "Driver not found or not available"}), 404

            # Check if the driver is already handling another ride
            active_ride = session.query(RideRequests).filter_by(driver_id=driver_id, status="matched").first()
            if active_ride:
                return jsonify({"error": "Driver is already handling another ride"}), 400

            # Validate ride request exists and is pending
            ride_request = session.query(RideRequests).filter_by(request_id=request_id, status="pending").first()
            if not ride_request:
                return jsonify({"error": "Ride request not found or not available"}), 404

            # Assign the driver and update the request status
            ride_request.driver_id = driver_id
            ride_request.status = "matched"
            session.commit()

            # Retrieve updated ride request details
            updated_request = session.query(RideRequests).filter_by(request_id=request_id).first()

            if not updated_request:
                return jsonify({"error": "Unable to retrieve updated ride request details"}), 500

            # Manually convert geography fields to text (latitude, longitude format)
            pickup_location = session.scalar(
                text(f"SELECT ST_AsText(pickup_location) FROM \"RideRequests\" WHERE request_id = {request_id}")
            )
            dropoff_location = session.scalar(
                text(f"SELECT ST_AsText(dropoff_location) FROM \"RideRequests\" WHERE request_id = {request_id}")
            )

            return jsonify({
                "message": "Ride request accepted successfully!",
                "request_id": updated_request.request_id,
                "passenger_id": updated_request.passenger_id,
                "pickup_location": pickup_location,
                "dropoff_location": dropoff_location,
                "status": updated_request.status
            }), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

@ride_bp.route('/pickup-passenger', methods=['POST'])
def pickup_passenger():
    """Allow a driver to mark the passenger as picked up."""
    with db.SessionLocal() as session:
        try:
            # Parse request data
            data = request.json
            driver_id = data.get("driver_id")
            request_id = data.get("request_id")

            # Validate required fields
            if not all([driver_id, request_id]):
                return jsonify({"error": "Missing driver_id or request_id"}), 400

            # Validate ride request exists and is assigned to the driver
            ride_request = session.query(RideRequests).filter_by(
                request_id=request_id, driver_id=driver_id, status="matched"
            ).first()
            if not ride_request:
                return jsonify({"error": "Ride request not found or not assigned to the driver"}), 404

            # Update the ride request status
            ride_request.status = "in progress"
            session.commit()

            return jsonify({"message": "Passenger picked up successfully!", "request_id": request_id}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

@ride_bp.route('/end-ride', methods=['POST'])
def end_ride():
    """Allow a driver to mark the ride as completed."""
    with db.SessionLocal() as session:
        try:
            # Parse request data
            data = request.json
            driver_id = data.get("driver_id")
            request_id = data.get("request_id")

            # Validate required fields
            if not all([driver_id, request_id]):
                return jsonify({"error": "Missing driver_id or request_id"}), 400

            # Validate ride request exists and is assigned to the driver
            ride_request = session.query(RideRequests).filter_by(
                request_id=request_id, driver_id=driver_id, status="in progress"
            ).first()
            if not ride_request:
                return jsonify({"error": "Ride request not found or not in progress"}), 404

            # Update the ride request status
            ride_request.status = "completed"
            session.commit()

            return jsonify({"message": "Ride completed successfully!", "request_id": request_id}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
@ride_bp.route('/get-driver-eta', methods=['POST'])
def get_driver_eta():
    """Provide the estimated time of arrival (ETA) of the driver to the passenger."""
    with db.SessionLocal() as session:
        try:
            # Parse request data
            data = request.json
            request_id = data.get("request_id")
            
            # Validate required fields
            if not request_id:
                return jsonify({"error": "Missing request_id"}), 400
            logger.debug(f"Received request for ETA with request_id: {request_id}")
            
            # Validate ride request exists and is either matched or in progress
            ride_request = session.query(
                RideRequests.request_id,
                func.ST_AsText(RideRequests.pickup_location).label("pickup_location"),
                func.ST_AsText(RideRequests.dropoff_location).label("dropoff_location"),
                RideRequests.driver_id,
                RideRequests.created_at  # Timestamp when the ride was created/accepted
            ).filter(
                RideRequests.request_id == request_id,
                RideRequests.status.in_(["matched", "in progress"])
            ).first()
            
            if not ride_request:
                logger.debug(f"Ride request with ID {request_id} not found or not assigned to a driver.")
                return jsonify({"error": "Ride request not found or driver not assigned"}), 404
            
            # Retrieve and validate coordinates
            driver_coordinates = ride_request.pickup_location
            passenger_coordinates = ride_request.dropoff_location
            
            if not driver_coordinates or not passenger_coordinates:
                logger.error(f"Failed to retrieve valid coordinates for request ID {request_id}.")
                return jsonify({"error": "Invalid location data"}), 500

            # Convert WKT to LatLng
            try:
                driver_coordinates = driver_coordinates.replace("POINT(", "").replace(")", "").replace(" ", ",")
                passenger_coordinates = passenger_coordinates.replace("POINT(", "").replace(")", "").replace(" ", ",")
                logger.debug(f"Driver Coordinates: {driver_coordinates}")
                logger.debug(f"Passenger Coordinates: {passenger_coordinates}")
            except Exception as coord_error:
                logger.error(f"Error processing WKT coordinates: {coord_error}")
                return jsonify({"error": "Failed to process location data"}), 500
            
            # Use Google Maps API to calculate distance and ETA
            try:
                distance, duration = get_distance_and_duration(driver_coordinates, passenger_coordinates)
                logger.debug(f"Distance: {distance} meters, Duration: {duration} seconds")
            except Exception as api_error:
                logger.error(f"Failed to calculate ETA: {api_error}")
                return jsonify({"error": f"Failed to calculate ETA: {api_error}"}), 500
            
            # Calculate exact arrival time
            try:
                acceptance_time = ride_request.created_at  # Timestamp when the request was accepted
                estimated_arrival_time = acceptance_time + timedelta(seconds=duration)
                estimated_arrival_time_str = estimated_arrival_time.strftime("%Y-%m-%d %H:%M:%S")
                logger.debug(f"Exact Arrival Time: {estimated_arrival_time_str}")
            except Exception as time_error:
                logger.error(f"Error calculating exact arrival time: {time_error}")
                return jsonify({"error": "Failed to calculate exact arrival time"}), 500

            return jsonify({
                "message": "ETA calculated successfully!",
                "driver_id": ride_request.driver_id,
                "request_id": request_id,
                "pickup_location": passenger_coordinates,
                "distance_km": round(distance / 1000, 2),
                "eta_minutes": round(duration / 60, 2),
                "estimated_arrival_time": estimated_arrival_time_str  # Include exact arrival time
            }), 200
        
        except Exception as general_error:
            logger.error(f"Unhandled error occurred: {str(general_error)}")
            return jsonify({"error": str(general_error)}), 500

# Register the Blueprint
app.register_blueprint(ride_bp, url_prefix='/ride')


if __name__ == '__main__':
    app.run(debug=True)
