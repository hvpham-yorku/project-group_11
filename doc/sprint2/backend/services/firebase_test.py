import firebase_admin
from firebase_admin import credentials, auth


cred = credentials.Certificate(r'./project-group_11\doc\sprint2\backend\services\firebase_key.json')
firebase_admin.initialize_app(cred)


def create_firebase_user(email, password):
    try:
        # Create a new Firebase user
        user = auth.create_user(email=email, password=password)
        return user.uid  # Return the Firebase user ID
    except Exception as e:
        print(f"Error creating Firebase user: {e}")
        return None

if __name__ == '__main__':
    create_firebase_user('john@gmail.com', 'johnny123')