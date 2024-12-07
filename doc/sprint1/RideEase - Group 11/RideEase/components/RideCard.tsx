import React from "react";
import { View, Text, Image } from "react-native";
import { Ride } from "@/types/type";
import { icons } from "@/constants";
import ReverseGeocoding from "./ReverseGeocoding";

interface RideCardProps {
  ride: Ride;
}

const RideCard: React.FC<RideCardProps> = ({
  ride: {
    pickup_location,
    dropoff_location,
    created_at,
    driver,
    status,
    fare,
  },
}) => {
  const [pickup_latitude, pickup_longitude] = pickup_location.split(",").map((coord) => parseFloat(coord.trim()));
  const [dropoff_latitude, dropoff_longitude] = dropoff_location.split(",").map((coord) => parseFloat(coord.trim()));

  return (
    <View className="flex flex-col bg-white rounded-lg shadow-md p-4 mb-3">
      {/* Map Image */}
      <Image
        source={{
          uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${pickup_longitude},${pickup_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
        }}
        className="w-full h-40 rounded-lg mb-4"
      />

      {/* Pickup and Dropoff Locations */}
      <View className="flex flex-row justify-between mb-2">
        <Text className="text-sm font-bold">Pickup:</Text>
        <Text className="text-sm">
          <ReverseGeocoding latitude={pickup_latitude} longitude={pickup_longitude} />
        </Text>
      </View>
      <View className="flex flex-row justify-between mb-2">
        <Text className="text-sm font-bold">Dropoff:</Text>
        <Text className="text-sm">
          <ReverseGeocoding latitude={dropoff_latitude} longitude={dropoff_longitude} />
        </Text>
      </View>

      {/* Ride Details */}
      <View className="flex flex-col space-y-2 mt-3">
        <View className="flex flex-row justify-between">
          <Text className="text-sm font-bold">Driver:</Text>
          <Text className="text-sm">{driver.name}</Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="text-sm font-bold">Fare:</Text>
          <Text className="text-sm">${fare.toFixed(2)}</Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="text-sm font-bold">Status:</Text>
          <Text className="text-sm">{status}</Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="text-sm font-bold">Date:</Text>
          <Text className="text-sm">{new Date(created_at).toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

export default RideCard;