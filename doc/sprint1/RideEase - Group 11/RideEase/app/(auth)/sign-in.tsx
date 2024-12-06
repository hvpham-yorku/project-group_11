import { Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import { images } from "@/constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, useRouter } from "expo-router"; // Added useRouter for navigation
import { signIn } from "@/lib/auth"; // Import the Firebase sign-in function

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
      const user = await signIn(email, password); // Call Firebase sign-in function
      Alert.alert("Success", `Welcome back, ${user.email}!`);
      router.push("/home"); // Navigate to the main app screen or dashboard
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Invalid password. Please try again.");
      } else {
        Alert.alert("Error", error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[225px]">
          <Image source={images.splash} className="z-0 w-full h-[200px]" />
          <Text className="text-xl text-white font-JakartaSemiBold absolute bottom-6 left-4">
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