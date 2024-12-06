import "react-native-get-random-values";
import React, { useContext } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "@/lib/AuthProvider";
import { View, Text } from "react-native";
import { LogBox } from "react-native"

const Home = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not defined. Ensure AuthProvider is correctly wrapped around the app.");
  }

  LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

  const { user, loading } = authContext;

  // Debugging logs
  console.log("AuthContext User:", user); // Logs the user object or null
  console.log("AuthContext Loading:", loading); // Logs whether the app is still checking auth state

  if (loading) {
    console.log("Loading state active, waiting for auth state check...");
    // Show a loading spinner or placeholder
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (user) {
    console.log("User detected, redirecting to home...");
    // If the user is signed in, redirect to the home screen
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  console.log("No user detected, redirecting to welcome...");
  // If no user is signed in, redirect to the welcome screen
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;