import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { icons } from "@/constants";
import { DriverCardProps } from "@/types/type";

const DriverCard: React.FC<DriverCardProps> = ({ item, selected, setSelected }) => {
    return (
        <TouchableOpacity
            onPress={setSelected}
            className={`${
                selected === item.driver_id ? "bg-general-600" : "bg-white"
            } flex flex-row items-center justify-between py-5 px-3 rounded-xl`}
        >
            <Text>{item.name}</Text>

            <View className="flex-1 flex flex-col items-start justify-center mx-3">
                <View className="flex flex-row items-center justify-start mb-1">
                    <Text className="text-lg">{item.title}</Text>

                    <View className="flex flex-row items-center space-x-1 ml-2">
                        <Image source={icons.star} className="w-3.5 h-3.5" />
                        <Text className="text-sm">{item.price || "N/A"}</Text>
                    </View>
                </View>

                <View className="flex flex-row items-center justify-start">
                    <View className="flex flex-row items-center">
                        <Image source={icons.dollar} className="w-4 h-4" />
                        <Text className="text-sm ml-1">${item.time || "N/A"}</Text>
                    </View>

                    <Text className="text-sm text-general-800 mx-1">|</Text>

                    <Text className="text-sm text-general-800">{item.time || "N/A"}</Text>

                    <Text className="text-sm text-general-800 mx-1">|</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default DriverCard;