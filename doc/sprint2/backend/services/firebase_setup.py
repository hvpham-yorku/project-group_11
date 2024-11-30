import firebase_admin
from firebase_admin import credentials

def initialize_firebase():
    """Initialize the Firebase app if not already initialized."""
    if not firebase_admin._apps:  # Check if Firebase is already initialized
        cred = credentials.Certificate(r'./project-group_11/doc/sprint2/backend/services/firebase_key.json')
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully!")
    else:
        print("Firebase already initialized!")
