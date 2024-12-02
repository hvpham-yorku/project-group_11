import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

// Define the props for the component
interface GeoapifyExampleProps {
  latitude: number;
  longitude: number;
}

const ReverseGeocoding: React.FC<GeoapifyExampleProps> = ({ latitude, longitude }) => {
  const [address, setAddress] = useState<string | null>(null); // Address can be a string or null

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_REVERSE_GEOCODING_API_KEY}`,
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
      }
    };

    fetchAddress();
  }, [latitude, longitude]);

  return (
    <View>
      <Text className="text-xs">{address || "Loading..."}</Text>
    </View>
  );
};

export default ReverseGeocoding;