import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View, Text, TouchableOpacity, Image, Alert } from "react-native";
import RideCard from "@/components/RideCard";
import { icons } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import { useEffect, useState } from "react";
import axios from "axios";
import * as Location from "expo-location";
import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { Ride } from "@/types/type";

export default function HomePage() {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [hasPermissions, setHasPermissions] = useState(false);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.replace("/(auth)/sign-in");
      Alert.alert("Success", "You have been signed out.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred during sign-out.");
    }
  };

  const handleDestinationPress = (location: { latitude: number; longitude: number; address: string }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.post(
          "http://192.168.86.76:5000/ride/view-requests",
          {
            driver_id: 1, // Replace with the actual driver ID
            address: "123 Main St", // Replace with the driver's current location address
          }
        );
        const { ride_requests } = response.data; // Assuming the API response contains a 'ride_requests' field
        setRecentRides(ride_requests);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, []);

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };

    requestLocation();
  }, []);

  return (
    <SafeAreaView className="bg-white">
      <FlatList
        data={recentRides}
        renderItem={({ item }: { item: Ride }) => <RideCard ride={item} />}
        keyExtractor={(item) => item.request_id.toString()}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl mx-3">Welcome Back to RideEase!</Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 pr-5 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-7 h-7" />
              </TouchableOpacity>
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />

            <>
              <Text className="text-xl mt-5 mb-3">Your Current Location</Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>

            <Text className="text-xl mt-5 mb-3">Recent Rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
}