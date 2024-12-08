import { Stack } from 'expo-router';
import 'react-native-reanimated';

const Layout = () => {
  return (
    <Stack>
    <Stack.Screen name="welcome" options={{ headerShown: false }} />
    {/* <Stack.Screen name="sign-up" options={{ headerShown: false }} /> */}
    <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    <Stack.Screen name="SignUpAsScreen" options={{ headerShown: false }} />
    <Stack.Screen name="PassengerSignUpScreen" options={{ headerShown: false }} />
    <Stack.Screen name="DriverSignUpScreen" options={{ headerShown: false }} />
  </Stack>
  );
};

export default Layout;
