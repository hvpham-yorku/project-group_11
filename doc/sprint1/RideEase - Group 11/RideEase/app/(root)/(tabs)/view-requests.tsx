import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View, Text } from "react-native";
import { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import RequestCard from "@/components/RequestCard";
import Map from "@/components/Map";
import ReverseGeocoding from "@/components/ReverseGeocoding";

export type Request = {
  requestId: number;
  passenger: {
    name: string;
    email: string;
  };
  origin_address: string;
  destination_address: string;
  fare: number;
  status: string;
  created_at: string;
};

const rideRequests: Request[] = [
  {
    requestId: 1,
    passenger: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    origin_address: "40.4215,-75.6972",
    destination_address: "45.4235,-75.6952",
    fare: 20.0,
    status: "pending",
    created_at: "2024-12-02T08:00:00Z",
  },
  {
    requestId: 2,
    passenger: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    origin_address: "60.4215,-75.6972",
    destination_address: "62.4235,-75.6952",
    fare: 25.0,
    status: "pending",
    created_at: "2024-12-02T09:00:00Z",
  },
];

export default function ViewRequests() {
  const [requests, setRequests] = useState<Request[]>(rideRequests);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isPickedUp, setIsPickedUp] = useState<boolean>(false); // Track pickup status

  const handleAcceptRequest = (id: number) => {
    const foundRequest = requests.find((req) => req.requestId === id);
    if (foundRequest) {
      setRequests((prev) =>
        prev.map((req) =>
          req.requestId === id ? { ...req, status: "accepted" } : req
        )
      );
      setSelectedRequest(foundRequest); // Only set if the request exists
    }
  };

  const handlePickupConfirmation = () => {
    console.log("Passenger picked up.");
    setIsPickedUp(true); // Mark as picked up
  };

  const handleDropoffConfirmation = () => {
    console.log("Passenger dropped off.");
    setIsPickedUp(false); // Reset pickup status
    setSelectedRequest(null); // Return to the list view
  };

  useEffect(() => {
    setRequests(rideRequests); // Initialize requests
  }, []);

  if (selectedRequest) {
    const [dropoff_latitude, dropoff_longitude] = selectedRequest.destination_address
      .split(",")
      .map((coord) => coord.trim());
    const [pickup_latitude, pickup_longitude] = selectedRequest.origin_address
      .split(",")
      .map((coord) => coord.trim());

    return (
      <SafeAreaView className="bg-white-400 flex-1 p-5">
        <>
          <Text className="text-xl mt-5 mb-3">Your Current Location</Text>
          <View className="flex flex-row items-center bg-transparent h-[300px]">
            <Map />
          </View>
        </>
        <View className="mb-5">
          <Text className="text-lg">Passenger: {selectedRequest.passenger.name}</Text>
          <Text className="text-lg">From: <ReverseGeocoding latitude={Number(pickup_latitude)} longitude={Number(pickup_longitude)}/></Text>
          <Text className="text-lg">To: <ReverseGeocoding latitude={Number(dropoff_latitude)} longitude={Number(dropoff_longitude)}/></Text>
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
            onAccept={() => handleAcceptRequest(item.requestId)}
          />
        )}
        keyExtractor={(item) => item.requestId.toString()}
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