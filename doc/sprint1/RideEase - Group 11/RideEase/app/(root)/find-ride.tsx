import { useLocationStore } from "@/store";
import { View, Text, Alert } from "react-native";
import RideLayout from "@/components/RideLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import axios from "axios"; // Import axios for API calls

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  const handleFindRide = async () => {
    if (!userAddress || !destinationAddress) {
      Alert.alert("Error", "Please select both origin and destination.");
      return;
    }

    try {
      // Send data to the backend
      const response = await axios.post("http://192.168.86.76:5000/ride/calculate-fare", {
        origin: userAddress, // Directly use if it's a string
        destination: destinationAddress,
      });

      const data = response.data;
      Alert.alert(
        "Fare Details",
        `Distance: ${data.distance_km} km\nDuration: ${data.duration_min} minutes\nFare: $${data.fare}`
      );

      // Navigate to the booking page (if needed)
      router.push("/(root)/book-ride");

    } catch (error) {
        if (error instanceof Error) {
          console.error(error.message); // Safely access the message
        } else {
          console.error("An unknown error occurred.");
        }
      }
  };

  return (
    <RideLayout title="Ride" snapPoints={["85%"]}>
      <View className="my-3">
        <Text className="text-lg mb-3">From</Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
        />
      </View>

      <View className="my-3">
        <Text className="text-lg mb-3">To</Text>
        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>

      <CustomButton
        title="Find now"
        onPress={handleFindRide} // Connect button to backend logic
        className="mt-5"
      />
    </RideLayout>
  );
};

export default FindRide;