import firebase_admin
from firebase_admin import credentials
import os

def initialize_firebase():
    """Initialize the Firebase app if not already initialized."""
    if not firebase_admin._apps:  # Check if Firebase is already initialized
        current_dir = os.path.dirname(os.path.abspath(__file__))
        firebase_key_path = os.path.join(current_dir, 'firebase_key.json')

        if not os.path.exists(firebase_key_path):
            raise FileNotFoundError(f"Firebase key file not found: {firebase_key_path}")

        cred = credentials.Certificate(firebase_key_path)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully!")
    else:
        print("Firebase already initialized!")

if __name__ == '__main__':
    initialize_firebase()
