import { View, Text } from "react-native";
import CustomButton from "@/components/CustomButton";
import ReverseGeocoding from "./ReverseGeocoding";

const RequestCard = ({
  request: { pickup_location, dropoff_location, fare, status, passenger },
  onAccept,
}: {
  request: {
    pickup_location: string;
    dropoff_location: string;
    fare: number;
    status: string;
    passenger: { name: string; email: string };
  };
  onAccept: () => void;
}) => {
  const [dropoff_latitude, dropoff_longitude] = dropoff_location
    .split(",")
    .map((coord) => coord.trim());
  const [pickup_latitude, pickup_longitude] = pickup_location
    .split(",")
    .map((coord) => coord.trim());

  return (
    <View className="flex flex-col bg-white rounded-lg shadow-md p-4 mb-3">
      <View className="flex flex-row justify-between">
        <Text className="text-lg">Passenger: {passenger.name}</Text>
        <Text className="text-sm text-gray-500">{status}</Text>
      </View>
      <Text className="text-sm my-2">
        From:{" "}
        <ReverseGeocoding
          latitude={Number(pickup_latitude)}
          longitude={Number(pickup_longitude)}
        />
      </Text>
      <Text className="text-sm my-2">
        To:{" "}
        <ReverseGeocoding
          latitude={Number(dropoff_latitude)}
          longitude={Number(dropoff_longitude)}
        />
      </Text>
      <Text className="text-sm my-2">Fare: ${fare}</Text>
      {status === "pending" && (
        <CustomButton
          title="Accept Request"
          onPress={onAccept}
          className="mt-4 bg-general-600 p-2 rounded-lg"
        />
      )}
    </View>
  );
};

export default RequestCard;