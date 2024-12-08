import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View, Text, Alert } from "react-native";
import { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import RequestCard from "@/components/RequestCard";
import Map from "@/components/Map";
import ReverseGeocoding from "@/components/ReverseGeocoding";
import axios from "axios";

export type Request = {
  request_id: number;
  passenger: {
    name: string;
    email: string;
  };
  pickup_location: string;
  dropoff_location: string;
  fare: number;
  status: string;
  created_at: string;
};

export default function ViewRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isPickedUp, setIsPickedUp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRideRequests = async () => {
    try {
      setLoading(true);

      // // Hardcoded driver ID and address
      // const payload = {
      //   driver_id: 1, 
      //   address: "123 Main St", 
      //   radius_km: 10, 
      // };

      const response = await axios.post("http://192.168.86.76:5000/ride/view-requests");

      if (response.status === 200) {
        const { ride_requests } = response.data;
        setRequests(
          ride_requests.map((req: any) => ({
            request_id: req.request_id,
            passenger: {
              name: req.passenger_name,
              email: req.passenger_email || "N/A",
            },
            pickup_location: req.pickup_location,
            dropoff_location: req.dropoff_location,
            fare: req.fare,
            status: req.status,
            created_at: req.created_at,
          }))
        );
      } else {
        Alert.alert("Error", "Failed to fetch ride requests.");
      }
    } catch (error) {
      console.error("Error fetching ride requests:", error);
      Alert.alert("Error", "Unable to load ride requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = (id: number) => {
    const foundRequest = requests.find((req) => req.request_id === id);
    if (foundRequest) {
      setRequests((prev) =>
        prev.map((req) =>
          req.request_id === id ? { ...req, status: "accepted" } : req
        )
      );
      setSelectedRequest(foundRequest);
    }
  };

  const handlePickupConfirmation = () => {
    console.log("Passenger picked up.");
    setIsPickedUp(true);
  };

  const handleDropoffConfirmation = () => {
    console.log("Passenger dropped off.");
    setIsPickedUp(false);
    setSelectedRequest(null);
  };

  useEffect(() => {
    fetchRideRequests();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Loading ride requests...</Text>
      </SafeAreaView>
    );
  }

  if (selectedRequest) {
    const [dropoff_latitude, dropoff_longitude] = selectedRequest.dropoff_location
      .split(",")
      .map((coord) => coord.trim());
    const [pickup_latitude, pickup_longitude] = selectedRequest.pickup_location
      .split(",")
      .map((coord) => coord.trim());

    return (
      <SafeAreaView className="bg-white flex-1 p-5">
        <>
          <Text className="text-xl mt-5 mb-3">Your Current Location</Text>
          <View className="flex flex-row items-center bg-transparent h-[300px]">
            <Map />
          </View>
        </>
        <View className="mb-5">
          <Text className="text-lg">Passenger: {selectedRequest.passenger.name}</Text>
          <Text className="text-lg">
            From: <ReverseGeocoding latitude={Number(pickup_latitude)} longitude={Number(pickup_longitude)} />
          </Text>
          <Text className="text-lg">
            To: <ReverseGeocoding latitude={Number(dropoff_latitude)} longitude={Number(dropoff_longitude)} />
          </Text>
          <Text className="text-lg">Fare: ${selectedRequest.fare}</Text>
        </View>
        {!isPickedUp ? (
          <CustomButton
            title="Confirm Pickup"
            onPress={handlePickupConfirmation}
            className="mb-3"
          />
        ) : (
          <CustomButton
            title="Confirm Dropoff"
            onPress={handleDropoffConfirmation}
            className="mt-3"
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-green-400 flex-1">
      <FlatList
        data={requests.filter((req) => req.status === "pending")}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            onAccept={() => handleAcceptRequest(item.request_id)}
          />
        )}
        keyExtractor={(item) => item.request_id.toString()}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
          backgroundColor: "transparent",
        }}
        ListHeaderComponent={() => (
          <View className="bg-green-400 flex-1">
            <Text className="text-2xl mx-3 my-5">Pending Ride Requests</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}