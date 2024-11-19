import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView} from "react-native";
import { Image } from "react-native";
import { images } from "@/constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import OAuth from "@/components/OAuth";

const SignUp = () => {
  const [form, setForm] = useState({
    name:'',
    email:'',
    password:''
  })
  const onSignUpPress = async () => {};
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[225px]">
          <Image 
            source={images.splash} className="z-0 w-full h-[200px]"
          />
          <Text className="text-xl text-white font-JakartaSemiBold absolute bottom-6 left-4">
            Create Your Account
          </Text>
        </View>
          <View className="p-5">
            <InputField 
              label="Name"
              placeholder="Enter your name"
              icon={icons.person}
              value={form.name}
              onChangeText={(value) => 
                setForm({ ...form, 
                  name: value})}
            />
            <InputField 
              label="Email"
              placeholder="Enter your email"
              icon={icons.email}
              value={form.email}
              onChangeText={(value) => 
                setForm({ ...form, 
                  email: value})}
            />
            <InputField 
              label="Password"
              placeholder="Enter your password"
              icon={icons.lock}
              secureTextEntry={true}
              value={form.password}
              onChangeText={(value) => 
                setForm({ ...form, 
                  password: value})}
            />
            <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6"
            />
                  
            <OAuth />
            <Link href="/sign-in" className="text-lg text-center text-general-200 mt-5">
              <Text>Already have an account?{" "}</Text>
              <Text className="text-blue-500 underline">Sign In</Text>
            </Link>
          </View>
          {/* verification modal */}
      </View>
    </ScrollView>
  )
}
export default SignUp;

