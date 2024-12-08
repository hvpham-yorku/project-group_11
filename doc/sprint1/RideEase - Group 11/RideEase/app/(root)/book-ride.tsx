import React, { useContext, useState, useEffect } from "react";
import { Image, Text, View, Alert } from "react-native";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { AuthContext } from "@/lib/AuthProvider";
import axios from "axios";

const BookRide = () => {
  const { userAddress, destinationAddress } = useLocationStore();
  const { user } = useContext(AuthContext) ?? {};

  const [fare, setFare] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirmRide = async () => {
    try {
      setLoading(true);

      const response = await axios.post("http://192.168.86.76:5000/ride/create-request", {
        passenger_id: user?.uid, // Ensure this matches your backend field
        pickup_location: userAddress,
        destination: destinationAddress,
      });

      const { fare: fetchedFare, message } = response.data;

      Alert.alert(
        "Ride Request Submitted",
        `${message}\nFare: $${fetchedFare.toFixed(2)}`,
        [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                router.push("/(root)/(tabs)/home");
              }, 0);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error creating ride request:", error);
      Alert.alert("Error", "Failed to create ride request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch fare when the component loads
    const fetchFare = async () => {
      try {
        setLoading(true);

        const response = await axios.post("http://127.0.0.1:5000/ride/calculate-fare", {
          origin: userAddress,
          destination: destinationAddress,
        });

        setFare(response.data.fare);
      } catch (error) {
        console.error("Error fetching fare:", error);
        Alert.alert("Error", "Failed to calculate fare.");
      } finally {
        setLoading(false);
      }
    };

    fetchFare();
  }, [userAddress, destinationAddress]);

  return (
    <RideLayout title="Confirm Ride Request">
      <Text className="text-xl mb-3">Ride Information</Text>

      <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
        <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
          <Text className="text-lg">Ride Price</Text>
          <Text className="text-lg text-[#0CC25F]">
            {fare !== null ? `$${fare.toFixed(2)}` : "Calculating..."}
          </Text>
        </View>

        <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
          <Text className="text-lg">Trip Duration</Text>
          <Text className="text-lg">Estimated Duration</Text>
        </View>

        <View className="flex flex-row items-center justify-between w-full py-3">
          <Text className="text-lg">Trip Distance</Text>
          <Text className="text-lg">Estimated Distance</Text>
        </View>
      </View>

      <View className="flex flex-col w-full items-start justify-center mt-5">
        <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
          <Image source={icons.to} className="w-6 h-6" />
          <Text className="text-lg ml-2">{userAddress}</Text>
        </View>

        <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
          <Image source={icons.point} className="w-6 h-6" />
          <Text className="text-lg ml-2">{destinationAddress}</Text>
        </View>

        <View className="flex flex-row items-center justify-start w-full py-12">
          <CustomButton
            title={loading ? "Processing..." : "Confirm Request"}
            onPress={handleConfirmRide}
            disabled={loading}
          />
        </View>
      </View>
    </RideLayout>
  );
};

export default BookRide;