import { Text, View, Alert } from "react-native";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import { images } from "@/constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, useRouter } from "expo-router";
import axios from "axios";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // For button state
  const router = useRouter(); // Navigation handler

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onSignInPress = async () => {
    const { email, password } = form;

    // Validation
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true); // Start loading

      // Construct request payload
      const payload = {
        email,
        password,
      };

      // Make a POST request to the backend
      const response = await axios.post("http://192.168.86.76:5000/auth/login", payload);

      if (response.status === 200) {
        // Successful login
        const { message, user_id, user_type, idToken } = response.data;
        Alert.alert("Success", message);
        
        // You can save the token to secure storage or context for session management
        console.log("User ID:", user_id);
        console.log("User Type:", user_type);
        console.log("ID Token:", idToken);

        router.push("/home"); // Navigate to the main app screen
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[225px]">
          <Image source={images.splash} className="z-0 w-full h-[200px]" />
          <Text className="text-xl text-white absolute bottom-6 left-4">
            Welcome Back
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title={loading ? "Signing In..." : "Sign In"}
            onPress={onSignInPress}
            className="mt-6"
            disabled={loading} // Disable button while loading
          />
          <Link href="/SignUpAsScreen" className="text-lg text-center text-general-200 mt-5">
            <Text>Don't have an account?{" "}</Text>
            <Text className="text-blue-500 underline">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;