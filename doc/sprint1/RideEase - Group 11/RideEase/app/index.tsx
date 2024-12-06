import "react-native-get-random-values";
import React, { useContext } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "@/lib/AuthProvider"; // Ensure this matches your file structure

const Home = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext is not defined. Ensure AuthProvider is correctly wrapped around the app.");
  }

  const { user, loading } = context;

  if (user) {
    // If user is signed in, redirect to the home screen
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  // If user is not signed in, redirect to the welcome screen
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;