import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")


def get_distance_and_duration(origin, destination):
    """
    Calculate distance and duration between origin and destination using Google Maps API.

    Args:
        origin (str): Origin coordinates in the format "lat,lng".
        destination (str): Destination coordinates in the format "lat,lng".

    Returns:
        tuple: distance in meters, duration in seconds.
    """
    try:
        url = f"https://maps.googleapis.com/maps/api/distancematrix/json"
        params = {
            "origins": origin,
            "destinations": destination,
            "key": GOOGLE_MAPS_API_KEY
        }
        response = requests.get(url, params=params)

        if response.status_code != 200:
            raise ValueError("Failed to connect to the Distance Matrix API")

        data = response.json()
        if data.get("status") != "OK":
            raise ValueError(data.get("error_message", "Unknown error"))

        rows = data.get("rows", [])
        if not rows or not rows[0].get("elements", []):
            raise ValueError("No data available for the given locations")

        element = rows[0]["elements"][0]
        distance = element.get("distance", {}).get("value", 0)  # in meters
        duration = element.get("duration", {}).get("value", 0)  # in seconds

        return distance, duration
    except Exception as e:
        raise ValueError(f"Error fetching distance and duration: {e}")

def calculate_fare(distance, duration):
    """
    Calculate fare based on distance and duration.

    Args:
        distance (int): Distance in meters.
        duration (int): Duration in seconds.

    Returns:
        float: Estimated fare.
    """
    # Example fare calculation: $1 per km + $0.50 per minute
    fare = (distance / 1000) * 1 + (duration / 60) * 0.5
    return round(fare, 2)

def reverse_geocode(lat, lng):
    """
    Convert latitude and longitude into a human-readable address using Google Maps API.
    """
    GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
    try:
        url = f"https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            "latlng": f"{lat},{lng}",
            "key": GOOGLE_MAPS_API_KEY
        }
        response = requests.get(url, params=params)

        if response.status_code != 200:
            raise ValueError("Failed to connect to the Geocoding API")

        data = response.json()
        if data.get("status") != "OK":
            raise ValueError(data.get("error_message", "Unknown error"))

        # Return the formatted address
        results = data.get("results", [])
        if results:
            return results[0]["formatted_address"]
        return "Unknown location"
    except Exception as e:
        raise ValueError(f"Error fetching address: {e}")

if __name__ == "__main__":
    latitude = 37.7749  # Latitude of San Francisco, CA
    longitude = -122.4194  # Longitude of San Francisco, CA


    try:
        location = reverse_geocode(latitude, longitude)
        print(location)
    except ValueError as e:
        print(f"Error: {e}")

