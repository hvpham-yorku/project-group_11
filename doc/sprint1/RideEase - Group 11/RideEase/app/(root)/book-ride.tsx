import React, { useContext } from "react";
import { Image, Text, View, Alert } from "react-native";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useDriverStore, useLocationStore } from "@/store";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { AuthContext } from "@/lib/AuthProvider"; 

const BookRide = () => {
    //const { user } = useContext(AuthContext); // Access the authenticated user from the context
    const { userAddress, destinationAddress } = useLocationStore();
    const { drivers, selectedDriver } = useDriverStore();

    const driverDetails = drivers?.filter(
        (driver) => +driver.driver_id === selectedDriver
    )[0];

    const handleConfirmRide = () => {
        Alert.alert(
            //"Your ride has been confirmed!",
            "Looking for drivers, you will be notified when your request has been accepted",
            "",
            [
                {
                    text: "OK",
                    onPress: () => {
                        // Ensure navigation executes
                        setTimeout(() => {
                            router.push("/(root)/(tabs)/home");
                            
                        }, 0);
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <RideLayout title="Confirm Ride Request">
            
                <Text className="text-xl mb-3">Ride Information</Text>

                <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
                    <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                        <Text className="text-lg">Ride Price</Text>
                        <Text className="text-lg text-[#0CC25F]">
                            {/*fare*/}
                            ${driverDetails?.price}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                        <Text className="text-lg">Trip Duration</Text>
                        {/*duration_min*/}
                        <Text className="text-lg">{driverDetails?.time!}</Text>
                    </View>

                    <View className="flex flex-row items-center justify-between w-full py-3">
                        <Text className="text-lg">Trip Distance</Text>
                        {/* <Text className="text-lg">{driverDetails?.distance_km!}</Text> */}
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
                        <CustomButton title="Confirm Request" onPress={handleConfirmRide} />
                    </View>
                </View>
            
        </RideLayout>
    );
};

export default BookRide;