
import sys
import os
# Dynamically add 'sprint2' to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from flask import Flask, Blueprint, request, jsonify
from firebase_admin import auth
from sqlalchemy.exc import IntegrityError
from backend.models.models import User, DriverDetails, BankAccount
from backend.db.database_setup import db
from backend.services.firebase_setup import initialize_firebase
import requests
from dotenv import load_dotenv


app = Flask(__name__)

# Initialize Firebase
initialize_firebase()

# Initialize Blueprint
auth_bp = Blueprint('auth', __name__)


# Load environment variables and set up Firebase authentication URL
load_dotenv()
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
FIREBASE_AUTH_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

# Access session and Base
session = db.SessionLocal()
Base = db.Base

@auth_bp.route('/signup', methods=['POST'])
def signup_user():
    """Handle user registration."""
    session = db.SessionLocal()
    try:
        # Get user data from request
        data = request.json
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        user_type = data.get("user_type")
        phone_number = data.get("phone_number")
        account_number = data.get("account_number")
        account_type = data.get("account_type")
        initial_balance = data.get("initial_balance", 0.00)

        # Validate required fields for all users
        if not all([email, password, name, user_type, phone_number, account_number, account_type]):
            return jsonify({"error": "Missing required fields"}), 400

        # Validate user_type
        if user_type not in ["passenger", "driver"]:
            return jsonify({"error": "Invalid user type. Must be 'passenger' or 'driver'"}), 400

        # Validate account type
        if account_type not in ['savings', 'checking']:
            return jsonify({"error": "Invalid account type. Must be 'savings' or 'checking'"}), 400

        # Create user in Firebase
        firebase_user = auth.create_user(email=email, password=password)
        firebase_uid = firebase_user.uid

        # Save common user data to PostgreSQL
        new_user = User(
            firebase_uid=firebase_uid,
            name=name,
            email=email,
            password=password,  # Add the password here (use hashing in production)
            user_type=user_type,
            phone_number=phone_number
        )
        session.add(new_user)
        session.commit()  # Commit to generate user_id

        # Add banking information for all users
        new_bank_account = BankAccount(
            user_id=new_user.user_id,
            account_number=account_number,
            account_type=account_type,
            balance=initial_balance
        )
        session.add(new_bank_account)

        # Handle driver-specific registration
        if user_type == "driver":
            drivers_license = data.get("drivers_license")
            work_eligibility = data.get("work_eligibility")
            car_insurance = data.get("car_insurance")
            sin = data.get("sin")

            # Validate driver-specific fields
            if not all([drivers_license, work_eligibility, car_insurance, sin]):
                session.rollback()
                return jsonify({"error": "Missing driver-specific fields"}), 400

            # Validate SIN
            if not sin.isdigit() or len(sin) != 9 or sin.startswith("0"):
                session.rollback()
                return jsonify({"error": "Invalid SIN provided"}), 400

            # Save driver-specific data to Driver_Details table
            driver_details = DriverDetails(
                user_id=new_user.user_id,
                drivers_license=drivers_license,
                work_eligibility=work_eligibility,
                car_insurance=car_insurance,
                sin=int(sin)  # Convert to integer
            )
            session.add(driver_details)

        session.commit()  # Commit all changes
        return jsonify({"message": "User registered successfully!"}), 201

    except IntegrityError:
        session.rollback()
        return jsonify({"error": "Email already exists"}), 400
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@auth_bp.route('/login', methods=['POST'])
def login_user():
    """Handle user login."""
    try:
        # Get login data
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Validate input
        if not all([email, password]):
            return jsonify({"error": "Missing email or password"}), 400

        # Call Firebase Authentication REST API
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        response = requests.post(FIREBASE_AUTH_URL, json=payload)

        if response.status_code == 200:
            # Successful login
            user_info = response.json()
            return jsonify({"message": f"User {user_info['email']} logged in successfully!", "idToken": user_info['idToken']}), 200
        else:
            # Handle authentication failure
            error_message = response.json().get("error", {}).get("message", "Authentication failed.")
            return jsonify({"error": error_message}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout_user():
    """
    Revoke the Firebase token to log the user out across devices,
    and set driver status to offline if applicable.
    """
    with db.SessionLocal() as session:
        try:
            # Debugging: Check request data
            print("Headers:", request.headers)
            print("Request JSON Body:", request.json)

            # Parse the JSON body
            data = request.json

            if not data:
                return jsonify({"error": "Request body is empty or invalid JSON"}), 400

            id_token = data.get("idToken")

            if not id_token:
                return jsonify({"error": "Missing idToken"}), 400

            # Verify the idToken and get the user details
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']

            # Fetch user details from the database using Firebase UID
            user = session.query(User).filter_by(firebase_uid=uid).first()
            if not user:
                return jsonify({"error": "User not found"}), 404

            # If the user is a driver, set their status to offline
            if user.user_type == "driver":
                user.availability = False
                session.commit()

            # Revoke the user's session
            auth.revoke_refresh_tokens(uid)

            return jsonify({
                "message": "User logged out successfully!",
                "driver_status": "offline" if user.user_type == "driver" else "N/A"
            }), 200

        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid idToken"}), 400
        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500
    
@auth_bp.route('/update-profile', methods=['PATCH'])
def update_profile():
    """Allow a user to update their profile information."""
    with db.SessionLocal() as session:
        try:
            data = request.json
            user_id = data.get("user_id")

            # Validate user exists
            user = session.query(User).filter_by(user_id=user_id).first()
            if not user:
                return jsonify({"error": "User not found"}), 404

            # Track email update for Firebase
            updated_email = None

            # Update user details
            if "name" in data:
                user.name = data["name"]
            if "email" in data:
                updated_email = data["email"]
                user.email = updated_email
            if "phone_number" in data:
                user.phone_number = data["phone_number"]

            # Update bank account details if provided
            if "account_number" in data or "account_type" in data or "balance" in data:
                bank_account = session.query(BankAccount).filter_by(user_id=user_id).first()
                if not bank_account:
                    return jsonify({"error": "Bank account not found"}), 404

                if "account_number" in data:
                    bank_account.account_number = data["account_number"]
                if "account_type" in data:
                    bank_account.account_type = data["account_type"]
                if "balance" in data:
                    bank_account.balance = data["balance"]

            # Commit updates to the database
            session.commit()

            # Update Firebase if the email was changed
            if updated_email:
                try:
                    # Retrieve Firebase user by UID
                    firebase_user = auth.get_user(user.firebase_uid)
                    auth.update_user(firebase_user.uid, email=updated_email)
                except auth.UserNotFoundError:
                    return jsonify({"error": "Firebase user not found"}), 404
                except Exception as firebase_error:
                    return jsonify({"error": f"Failed to update email in Firebase: {str(firebase_error)}"}), 500

            # Return updated user info
            updated_user = {
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "phone_number": user.phone_number,
                "bank_account": {
                    "account_number": bank_account.account_number,
                    "account_type": bank_account.account_type,
                    "balance": float(bank_account.balance)
                } if bank_account else None
            }
            return jsonify({"message": "Profile updated successfully!", "updated_user": updated_user}), 200

        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
