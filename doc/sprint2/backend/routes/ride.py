import sys
import os
# Dynamically add 'sprint2' to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from flask import Blueprint, Flask, request, jsonify
from firebase_admin import auth
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text, func
from backend.models.models import DriverRatings, User, DriverDetails, RideRequests, BankAccount, Payment
from backend.db.database_setup import db
from backend.services.firebase_setup import initialize_firebase
from backend.helpers.fare_utils import get_distance_and_duration, calculate_fare, reverse_geocode, parse_wkt_point, geocode
import requests
from dotenv import load_dotenv
import logging
from decimal import Decimal  # Import Decimal for type conversion
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
        origin_address = data.get("origin")  # Example: "1600 Amphitheatre Parkway, Mountain View, CA"
        destination_address = data.get("destination")  # Example: "1 Infinite Loop, Cupertino, CA"

        if not all([origin_address, destination_address]):
            return jsonify({"error": "Missing origin or destination"}), 400

        # Convert addresses to coordinates
        origin_coords = geocode(origin_address)
        destination_coords = geocode(destination_address)

        # Use the helper function to calculate distance and duration
        distance, duration = get_distance_and_duration(
            f"{origin_coords[0]},{origin_coords[1]}", 
            f"{destination_coords[0]},{destination_coords[1]}"
        )

        # Use the helper function to calculate fare
        fare = calculate_fare(distance, duration)

        return jsonify({
            "origin_address": origin_address,
            "destination_address": destination_address,
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
    """Allow a passenger to create a ride request with fare validation."""
    with db.SessionLocal() as session:
        try:
            # Parse request data
            data = request.json
            passenger_id = data.get("passenger_id")
            pickup_address = data.get("pickup_location")
            dropoff_address = data.get("destination")  # Address instead of coordinates

            # Validate required fields
            if not all([passenger_id, pickup_address, dropoff_address]):
                return jsonify({"error": "Missing required fields"}), 400

            # Validate passenger exists and is of user_type 'passenger'
            passenger = session.query(User).filter_by(user_id=passenger_id, user_type="passenger").first()
            if not passenger:
                return jsonify({"error": "Invalid passenger ID or user is not a passenger"}), 404

            # Check for existing active ride request
            active_request = session.query(RideRequests).filter(
                RideRequests.passenger_id == passenger_id,
                RideRequests.status.in_(['pending', 'matched'])
            ).first()
            if active_request:
                return jsonify({"error": "You already have an active ride request"}), 400

            # Validate passenger's bank account and balance
            passenger_account = session.query(BankAccount).filter_by(user_id=passenger_id).first()
            if not passenger_account:
                return jsonify({"error": "Passenger's bank account not found"}), 404

            # Geocode the pickup and dropoff addresses
            pickup_coords = geocode(pickup_address)
            dropoff_coords = geocode(dropoff_address)

            # Calculate distance, duration, and fare
            distance, duration = get_distance_and_duration(
                f"{pickup_coords[0]},{pickup_coords[1]}",
                f"{dropoff_coords[0]},{dropoff_coords[1]}"
            )
            fare = calculate_fare(distance, duration)

            # Check if passenger has sufficient balance (no deduction yet)
            if passenger_account.balance < Decimal(fare):  # Convert fare to Decimal for comparison
                return jsonify({"error": "Insufficient funds to request this ride"}), 400

            # Create and save ride request
            ride_request = RideRequests(
                passenger_id=passenger_id,
                pickup_location=f"SRID=4326;POINT({pickup_coords[1]} {pickup_coords[0]})",
                dropoff_location=f"SRID=4326;POINT({dropoff_coords[1]} {dropoff_coords[0]})",
                status='pending',
                fare=fare  # Store the fare
            )
            session.add(ride_request)
            session.commit()

            return jsonify({
                "message": "Ride request created successfully!",
                "request_id": ride_request.request_id,
                "fare": round(fare, 2),
                "pickup_address": pickup_address,
                "dropoff_address": dropoff_address
            }), 201

        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500


@ride_bp.route('/view-requests', methods=['POST'])
def view_requests():
    """View ride requests within a certain radius."""
    with db.SessionLocal() as session:
        try:
            # Parse request data
            data = request.json
            driver_id = data.get("driver_id")
            address = data.get("address")  # Use an address instead of latitude and longitude
            radius_km = data.get("radius_km", 10)  # Default radius to 10 km

            if not all([driver_id, address]):
                return jsonify({"error": "Missing required fields"}), 400

            # Ensure the driver is online
            driver = session.query(User).filter_by(user_id=driver_id, user_type="driver", availability=True).first()
            if not driver:
                return jsonify({"error": "Driver is not online or does not exist"}), 404

            # Check if the driver is currently handling a request
            active_ride = session.query(RideRequests).filter_by(driver_id=driver_id, status="matched").first()
            if active_ride:
                return jsonify({
                    "error": "You cannot view ride requests while you are handling another request.",
                    "active_request_id": active_ride.request_id,
                    "status": active_ride.status
                }), 400

            # Convert address to coordinates using geocoding
            try:
                latitude, longitude = geocode(address)
            except Exception as e:
                return jsonify({"error": f"Error fetching coordinates for address: {e}"}), 400

            # Query for nearby requests
            query = text("""
                SELECT r.request_id, r.passenger_id, ST_AsText(r.pickup_location) AS pickup_location,
                    ST_AsText(r.dropoff_location) AS dropoff_location, r.status, r.fare, u.name AS passenger_name
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
                pickup_coords = parse_wkt_point(row.pickup_location)
                dropoff_coords = parse_wkt_point(row.dropoff_location)
                
                # Use reverse_geocode to get addresses
                try:
                    pickup_address = reverse_geocode(*pickup_coords.split(","))
                except Exception as e:
                    pickup_address = "Unable to fetch address"

                try:
                    dropoff_address = reverse_geocode(*dropoff_coords.split(","))
                except Exception as e:
                    dropoff_address = "Unable to fetch address"

                ride_requests.append({
                    "request_id": row.request_id,
                    "passenger_id": row.passenger_id,
                    "passenger_name": row.passenger_name,
                    "pickup_location": pickup_address,
                    "dropoff_location": dropoff_address,
                    "fare": row.fare,
                    "status": row.status
                })

            return jsonify({"ride_requests": ride_requests}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

@ride_bp.route('/accept-request', methods=['POST'])
def accept_ride_request():
    """Allow a driver to accept a ride request and expose passenger contact details."""
    with db.SessionLocal() as session:
        try:
            # Parse request data
            data = request.json
            driver_id = data.get("driver_id")
            request_id = data.get("request_id")
            driver_location_address = data.get("driver_location")  # Human-readable address

            # Validate required fields
            if not all([driver_id, request_id, driver_location_address]):
                return jsonify({"error": "Missing driver_id, request_id, or driver_location"}), 400

            # Geocode the driver's location address
            try:
                driver_location_coords = geocode(driver_location_address)
            except Exception as e:
                return jsonify({"error": f"Failed to geocode driver location: {e}"}), 400

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

            # Fetch the passenger
            passenger = session.query(User).filter_by(user_id=ride_request.passenger_id).first()
            if not passenger:
                return jsonify({"error": "Passenger not found"}), 404

            # Retrieve passenger's bank account
            passenger_account = session.query(BankAccount).filter_by(user_id=ride_request.passenger_id).first()
            if not passenger_account:
                return jsonify({"error": "Passenger's bank account not found"}), 404

            # Create a pending payment for the ride
            payment = Payment(
                bank_account_id=passenger_account.account_id,
                user_id=ride_request.passenger_id,
                ride_id=request_id,
                amount=ride_request.fare,
                currency="USD",
                payment_status="pending"
            )
            session.add(payment)

            # Assign the driver, update request status, and store the driver's initial location
            ride_request.driver_id = driver_id
            ride_request.status = "matched"
            ride_request.driver_initial_location = f"SRID=4326;POINT({driver_location_coords[1]} {driver_location_coords[0]})"
            session.commit()

            # Reverse geocode the pickup and dropoff locations
            pickup_coords = parse_wkt_point(
                session.scalar(
                    text(f"SELECT ST_AsText(pickup_location) FROM \"RideRequests\" WHERE request_id = {request_id}")
                )
            )
            dropoff_coords = parse_wkt_point(
                session.scalar(
                    text(f"SELECT ST_AsText(dropoff_location) FROM \"RideRequests\" WHERE request_id = {request_id}")
                )
            )
            try:
                pickup_address = reverse_geocode(*pickup_coords.split(","))
            except Exception:
                pickup_address = "Unable to fetch address"

            try:
                dropoff_address = reverse_geocode(*dropoff_coords.split(","))
            except Exception:
                dropoff_address = "Unable to fetch address"

            return jsonify({
                "message": "Ride request accepted successfully!",
                "request_id": ride_request.request_id,
                "passenger_id": passenger.user_id,
                "passenger_name": passenger.name,
                "passenger_phone_number": passenger.phone_number,
                "pickup_location": pickup_address,
                "dropoff_location": dropoff_address,
                "status": ride_request.status,
                "payment_status": "pending"
            }), 200

        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500
        
@ride_bp.route('/cancel-ride', methods=['POST'])
def cancel_ride():
    """Allow a passenger to cancel their ride."""
    with db.SessionLocal() as session:
        try:
            data = request.json
            passenger_id = data.get("passenger_id")
            request_id = data.get("request_id")

            # Validate required fields
            if not all([passenger_id, request_id]):
                return jsonify({"error": "Missing passenger_id or request_id"}), 400

            # Validate ride exists and belongs to the passenger
            ride_request = session.query(RideRequests).filter_by(
                request_id=request_id, passenger_id=passenger_id
            ).first()
            if not ride_request:
                return jsonify({"error": "Ride not found or does not belong to this passenger"}), 404

            # Check if the ride is in a state that allows cancellation
            if ride_request.status not in ["pending", "matched"]:
                return jsonify({"error": f"Cannot cancel ride in {ride_request.status} state"}), 400

            # Update the ride request status
            ride_request.status = "cancelled"
            session.commit()

            return jsonify({
                "message": "Ride cancelled successfully!",
                "ride_id": request_id,
                "status": "cancelled"
            }), 200

        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500

        

@ride_bp.route('/mark-delay', methods=['POST'])
def mark_delay():
    """Allow a driver to mark a ride as delayed."""
    with db.SessionLocal() as session:
        try:
            data = request.json
            driver_id = data.get("driver_id")
            request_id = data.get("request_id")
            delay_reason = data.get("delay_reason")
            updated_eta = data.get("updated_eta")

            # Validate required fields
            if not all([driver_id, request_id, delay_reason, updated_eta]):
                return jsonify({"error": "Missing required fields"}), 400

            # Validate ride exists and belongs to the driver
            ride_request = session.query(RideRequests).filter_by(
                request_id=request_id, driver_id=driver_id, status="matched"
            ).first()
            if not ride_request:
                return jsonify({"error": "Ride not found or not in the matched state"}), 404

            # Update delay details
            ride_request.delay_reason = delay_reason
            ride_request.updated_eta = updated_eta
            session.commit()

            return jsonify({
                "message": "Delay marked successfully!",
                "ride_id": request_id,
                "updated_eta": updated_eta,
                "delay_reason": delay_reason
            }), 200

        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500
        

@ride_bp.route('/check-delay/<int:request_id>', methods=['GET'])
def check_delay(request_id):
    """Allow a passenger to check if their ride is delayed."""
    with db.SessionLocal() as session:
        try:
            # Fetch the ride request
            ride_request = session.query(RideRequests).filter_by(request_id=request_id).first()
            if not ride_request:
                return jsonify({"error": "Ride request not found"}), 404

            # Check if the ride is delayed
            if not ride_request.delay_reason or not ride_request.updated_eta:
                return jsonify({"message": "No delays reported for this ride"}), 200

            # Return delay details
            return jsonify({
                "message": "Ride is delayed",
                "delay_reason": ride_request.delay_reason,
                "updated_eta": ride_request.updated_eta.strftime("%Y-%m-%d %H:%M:%S")
            }), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500


@ride_bp.route('/pickup-passenger', methods=['POST'])
def pickup_passenger():
    """Allow a driver to mark the passenger as picked up and deduct fare from passenger's account."""
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

            # Validate passenger's account and balance
            passenger_account = session.query(BankAccount).filter_by(user_id=ride_request.passenger_id).first()
            if not passenger_account or passenger_account.balance < Decimal(ride_request.fare):
                return jsonify({"error": "Insufficient funds in passenger's account"}), 400

            # Deduct fare from passenger's balance
            passenger_account.balance -= Decimal(ride_request.fare)
            session.commit()

            # Update the ride request status
            ride_request.status = "in progress"
            session.commit()

            return jsonify({
                "message": "Passenger picked up successfully!",
                "request_id": request_id,
                "fare_deducted": float(ride_request.fare),
                "passenger_balance": float(passenger_account.balance)
            }), 200

        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500

@ride_bp.route('/end-ride', methods=['POST'])
def end_ride():
    """Allow a driver to mark the ride as completed and transfer fare to driver's account."""
    with db.SessionLocal() as session:
        try:
            # Parse request data
            data = request.json
            driver_id = data.get("driver_id")
            request_id = data.get("request_id")

            # Validate required fields
            if not all([driver_id, request_id]):
                return jsonify({"error": "Missing driver_id or request_id"}), 400

            # Fetch the ride request
            ride_request = session.query(RideRequests).filter_by(
                request_id=request_id, driver_id=driver_id, status="in progress"
            ).first()
            if not ride_request:
                return jsonify({"error": "Ride request not found or not in progress"}), 404

            # Fetch the pending payment
            payment = session.query(Payment).filter_by(ride_id=request_id, payment_status="pending").first()
            if not payment:
                return jsonify({"error": "No pending payment found for this ride"}), 404

            # Fetch the driver's bank account
            driver_account = session.query(BankAccount).filter_by(user_id=driver_id).first()
            if not driver_account:
                return jsonify({"error": "Driver's bank account not found"}), 404

            # Transfer fare to driver's account
            driver_account.balance += payment.amount

            # Update payment status to "completed"
            payment.payment_status = "completed"

            # Update ride request status
            ride_request.status = "completed"
            session.commit()

            return jsonify({
                "message": "Ride completed successfully!",
                "fare_transferred": float(payment.amount),
                "request_id": ride_request.request_id
            }), 200

        except Exception as e:
            session.rollback()
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

            # Fetch the ride request
            ride_request = session.query(
                RideRequests.request_id,
                func.ST_AsText(RideRequests.pickup_location).label("pickup_location"),
                func.ST_AsText(RideRequests.driver_initial_location).label("driver_location"),
                RideRequests.driver_id,
                RideRequests.created_at
            ).filter(
                RideRequests.request_id == request_id,
                RideRequests.status.in_(["matched", "in progress"])
            ).first()

            if not ride_request:
                return jsonify({"error": "Ride request not found or driver not assigned"}), 404

            # Extract and validate coordinates
            pickup_coordinates = ride_request.pickup_location
            driver_location = ride_request.driver_location

            if not pickup_coordinates or not driver_location:
                return jsonify({"error": "Invalid location data"}), 500

            # Convert WKT to LatLng
            try:
                driver_coords = parse_wkt_point(driver_location)  # Parse WKT to "lat,lng"
                pickup_coords = parse_wkt_point(pickup_coordinates)
            except Exception as e:
                return jsonify({"error": f"Failed to process coordinates: {e}"}), 500

            # Use Google Maps API to calculate distance and ETA
            try:
                distance, duration = get_distance_and_duration(driver_coords, pickup_coords)
            except Exception as e:
                return jsonify({"error": f"Failed to calculate ETA: {e}"}), 500

            # Calculate exact arrival time
            estimated_arrival_time = ride_request.created_at + timedelta(seconds=duration)
            estimated_arrival_time_str = estimated_arrival_time.strftime("%Y-%m-%d %H:%M:%S")

            # Reverse geocode driver's current location
            try:
                driver_address = reverse_geocode(*driver_coords.split(","))
            except Exception:
                driver_address = "Unable to fetch address"

            return jsonify({
                "message": "ETA calculated successfully!",
                "driver_id": ride_request.driver_id,
                "request_id": ride_request.request_id,
                "driver_location": driver_address,
                "distance_km": round(distance / 1000, 2),
                "eta_minutes": round(duration / 60, 2),
                "estimated_arrival_time": estimated_arrival_time_str
            }), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500


@ride_bp.route('/submit-rating', methods=['POST'])
def submit_rating():
    """Allow a passenger to rate a driver after a ride."""
    with db.SessionLocal() as session:
        try:
            data = request.json
            passenger_id = data.get("passenger_id")
            ride_id = data.get("ride_id")
            rating = data.get("rating")
            review = data.get("review", "")  # Optional review

            # Validate required fields
            if not all([passenger_id, ride_id, rating]):
                return jsonify({"error": "Missing required fields"}), 400

            # Validate ride exists and is completed
            ride = session.query(RideRequests).filter_by(request_id=ride_id, status="completed").first()
            if not ride:
                return jsonify({"error": "Ride not found or not completed"}), 404

            # Validate passenger is associated with the ride
            if ride.passenger_id != passenger_id:
                return jsonify({"error": "Passenger is not associated with this ride"}), 403

            # Check if the passenger has already rated this ride
            existing_rating = session.query(DriverRatings).filter_by(ride_id=ride_id, passenger_id=passenger_id).first()
            if existing_rating:
                return jsonify({"error": "You have already rated this ride"}), 400

            # Validate driver exists
            driver = session.query(User).filter_by(user_id=ride.driver_id, user_type="driver").first()
            if not driver:
                return jsonify({"error": "Driver not found"}), 404

            # Save the rating
            new_rating = DriverRatings(
                driver_id=ride.driver_id,
                passenger_id=passenger_id,
                ride_id=ride_id,
                rating=rating,
                review=review
            )
            session.add(new_rating)

            # Update driver's average rating and total ratings
            if driver.total_ratings is None:
                driver.total_ratings = 0
            if driver.average_rating is None:
                driver.average_rating = 0.0

            # Calculate new average rating
            total_ratings = driver.total_ratings + 1
            average_rating = ((driver.average_rating * driver.total_ratings) + rating) / total_ratings

            driver.total_ratings = total_ratings
            driver.average_rating = average_rating

            session.commit()

            return jsonify({
                "message": "Rating submitted successfully!",
                "driver_id": ride.driver_id,
                "new_average_rating": round(average_rating, 2),
                "total_ratings": total_ratings
            }), 201

        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500


@ride_bp.route('/driver/<int:driver_id>/profile', methods=['GET'])
def view_driver_profile(driver_id):
    """Retrieve a driver's profile information including ratings and reviews."""
    with db.SessionLocal() as session:
        try:
            # Validate the driver exists
            driver = session.query(User).filter_by(user_id=driver_id, user_type="driver").first()
            if not driver:
                return jsonify({"error": "Driver not found"}), 404

            # Fetch ratings and reviews
            ratings = session.query(DriverRatings).filter_by(driver_id=driver_id).all()
            ratings_data = [
                {
                    "passenger_id": rating.passenger_id,
                    "ride_id": rating.ride_id,
                    "rating": float(rating.rating),
                    "review": rating.review,
                    "created_at": rating.created_at.strftime("%Y-%m-%d %H:%M:%S")
                }
                for rating in ratings
            ]

            # Return profile information along with ratings
            return jsonify({
                "driver_id": driver.user_id,
                "name": driver.name,
                "phone_number": driver.phone_number,
                "email": driver.email,
                "average_rating": round(driver.average_rating, 2) if driver.average_rating else "No ratings yet",
                "total_ratings": driver.total_ratings or 0,
                "ratings": ratings_data
            }), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

        


# Register the Blueprint
app.register_blueprint(ride_bp, url_prefix='/ride')


if __name__ == '__main__':
    app.run(debug=True)
