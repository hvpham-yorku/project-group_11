import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

interface ReverseGeocodingProps {
  latitude: number; // Latitude of the location
  longitude: number; // Longitude of the location
}

const ReverseGeocoding: React.FC<ReverseGeocodingProps> = ({ latitude, longitude }) => {
  const [address, setAddress] = useState<string | null>(null); // Address state
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_REVERSE_GEOCODING_API_KEY}`
        );

        const data = await response.json();
        if (data.features && data.features.length > 0) {
          setAddress(data.features[0].properties.formatted); // Set the formatted address
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Error fetching address");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAddress();
  }, [latitude, longitude]);

  return (
    <View>
      {loading ? (
        <Text className="text-xs text-gray-500">Fetching address...</Text>
      ) : (
        <Text className="text-xs text-black">{address || "Address not found"}</Text>
      )}
    </View>
  );
};

export default ReverseGeocoding;