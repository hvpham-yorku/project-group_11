import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { useRef, useState } from "react";
import { onboarding } from "@/constants";
import { Image } from "react-native";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-green-400">
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md">Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View
            className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0]
                rounded-full"
          />
        }
        activeDot={
          <View
            className="w-[32px] h-[4px] mx-1 bg-[#0286FF]
                rounded-full"
          />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex items-center justify-center p-5">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <Text className="text-x1 font-bold">{item.title}</Text>
          </View>
        ))}
      </Swiper>

      {/* Conditionally render the Sign Up and Sign In buttons on the last screen */}
      {activeIndex === onboarding.length - 1 && (
        <View className="flex flex-row space-x-4 mt-5">
          <TouchableOpacity
          // TODO:
          // Change to SignUpAs
            onPress={() => router.push("/(auth)/SignUpAsScreen")}
            className="bg-blue-500 px-4 py-2 rounded-full"
          >
            <Text className="text-white text-lg">Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/sign-in")}
            className="bg-gray-500 px-4 py-2 rounded-full"
          >
            <Text className="text-white text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Onboarding;