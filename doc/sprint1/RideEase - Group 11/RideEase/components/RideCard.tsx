import { View, Text, Image } from "react-native";
import { Ride } from "@/types/type";
import { icons } from "@/constants";
import ReverseGeocoding from "./ReverseGeocoding";

const RideCard = ({ ride: {
    pickup_location, 
    dropoff_location, 
    pickup_time, 
    dropoff_time,
    fare,
    status,
    driver_id,
    user_email,
    created_at,
    driver,
    },
}: 
{ride: Ride}) => {
    const [dropoff_latitude, dropoff_longitude] = dropoff_location.split(",").map((coord) => coord.trim());
    const [pickup_latitude, pickup_longitude] = pickup_location.split(",").map((coord) => coord.trim());
    return(
    <View className="flex flex-row items-center justify-center bg-white 
    rounded-lg shadow-sm shadow-netural-300 mb-3">
        <View className="flex flex-col items-center justify-center p-3">
            <View className="flex flex-row items-center justify-between">
                <Image 
                    source={{
                        uri:`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${dropoff_longitude},${dropoff_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
                    }}
                    className="w-[80px] h-[90px] rounded-lg"
                />
                <View className="flex flex-col mx-3 gapy-y-5 flex-1">
                    <View className="flex flex-row items-center gap-x-2">
                        <Image source={icons.to} className="w-5 h-5" />
                        <Text className="text-xxxs" numberOfLines={1}><ReverseGeocoding latitude={Number(pickup_latitude)} longitude={Number(pickup_longitude)}/></Text>
                    </View>

                    <View className="flex flex-row items-center gap-x-2">
                        <Image source={icons.point} className="w-5 h-5" />
                        <Text className="text-xxxs" numberOfLines={1}><ReverseGeocoding latitude={Number(dropoff_latitude)} longitude={Number(dropoff_longitude)}/></Text>
                    </View>
                </View>
            </View>
            <View className="flex flex-col w-full mt-5 bg-general-500 rounded-lg p-3 items-start justify-center">
                    <View className="flex flex-row items-center w-full justify-between mb-5">
                        <Text className="text-md text-gray-500">
                            Date & Time
                        </Text>
                        <Text className="text-md text-gray-500">
                            {created_at}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center w-full justify-between mb-5">
                        <Text className="text-md text-gray-500">
                            Driver
                        </Text>
                        <Text className="text-md text-gray-500">
                            {driver.name}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center w-full justify-between mb-5">
                        <Text className="text-md text-gray-500">
                           Capacity
                        </Text>
                        <Text className="text-md text-gray-500">
                            {driver.capacity}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center w-full justify-between mb-5">
                        <Text className="text-md text-gray-500">
                            Payment Status
                        </Text>
                        <Text className="text-md text-gray-500">
                            {status}
                        </Text>
                    </View>

            </View>
        </View>
    </View>
    )
}


export default RideCard;