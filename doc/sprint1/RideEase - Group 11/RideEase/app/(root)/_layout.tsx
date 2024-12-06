import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

const Layout = () => {
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="find-ride" options={{ headerShown: false }} />
        <Stack.Screen name="confirm-ride" options={{ headerShown: false }} />          
        <Stack.Screen name="book-ride" options={{ headerShown: false }} />
        <Stack.Screen name="Complaint" options={{ headerShown: false }} />
        <Stack.Screen name="RateDriver" options={{ headerShown: false }} />
        <Stack.Screen name="RatingReview" options={{ headerShown: false }} />

      </Stack>
  );
}

export default Layout
