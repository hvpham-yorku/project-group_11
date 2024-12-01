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
    

def parse_wkt_point(wkt_point):
    """
    Parse a WKT point string and return coordinates in 'latitude,longitude' format.
    
    Args:
        wkt_point (str): WKT point string like 'POINT(longitude latitude)'
        
    Returns:
        str: Coordinates in 'latitude,longitude' format.
    """
    try:
        # Ensure the string starts with 'POINT(' and ends with ')'
        if not wkt_point.startswith('POINT(') or not wkt_point.endswith(')'):
            raise ValueError("Invalid WKT POINT format")
        
        # Extract the coordinates part and split into longitude and latitude
        coords = wkt_point[6:-1].strip().split()
        if len(coords) != 2:
            raise ValueError("WKT POINT does not contain valid coordinates")
        
        longitude, latitude = coords
        return f"{latitude},{longitude}"
    except Exception as e:
        raise ValueError(f"Error parsing WKT point: {e}")

if __name__ == "__main__":
    origin = "37.7749,-122.4194"  # San Francisco, CA
    destination = "34.0522,-118.2437"  # Los Angeles, CA
    
    distance, duration = get_distance_and_duration(origin, destination)

    print(distance, duration)
