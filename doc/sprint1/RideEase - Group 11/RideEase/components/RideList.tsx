import React, { useEffect, useState } from "react";
import { FlatList, View, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import RideCard from "@/components/RideCard";
import { Ride } from "@/types/type";

const RidesList = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.post("http://192.168.86.76:5000/ride/view-requests", {
          driver_id: 1, // Replace with dynamic driver_id if needed
          address: "45.4215,-75.6972", // Replace with user's actual location
          radius_km: 10, // Example radius
        });

        const { ride_requests } = response.data;
        setRides(ride_requests);
      } catch (error) {
        console.error("Error fetching ride requests:", error);
        Alert.alert("Error", "Failed to fetch ride requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.request_id.toString()}
        renderItem={({ item }) => <RideCard ride={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default RidesList;