import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, View, Text, TouchableOpacity, Image } from 'react-native';
import RideCard from '@/components/RideCard';
import { icons } from '@/constants';
import { useUser } from '@clerk/clerk-expo';
import GoogleTextInput from '@/components/GoogleTextInput';
import Map from '@/components/Map';
import { useLocationStore } from '@/store';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location'
import { router } from 'expo-router';

const recentRides = [
  {
    driver: {
      driver_id: 1,
      name: "testName",
      make: "BMW",
      model: "M4",
      year: 2024,
      license_plate: "GAJK 768",
      capacity: 4,
      rating: 4,
    },
    origin_address: "123 Main St",
    destination_address: "456 Elm St",
    origin_latitude: 45.4215,
    origin_longitude: -75.6972,
    destination_latitude: 45.4235,
    destination_longitude: -75.6952,
    pickup_location: "45.4215,-75.6972",
    dropoff_location: "45.4235,-75.6952",
    pickup_time: "2024-12-02T10:00:00Z",
    dropoff_time: "2024-12-02T10:30:00Z",
    fare: 25.0,
    status: "completed",
    driver_id: 1,
    user_email: "user@example.com",
    created_at: "2024-12-01T08:00:00Z",
  },
  {
    driver: {
      driver_id: 2,
      name: "testName2",
      make: "BMW",
      model: "M340i",
      year: 2024,
      license_plate: "KLGR 457",
      capacity: 4,
      rating: 4.5,
    },
    origin_address: "789 Oak St",
    destination_address: "321 Pine St",
    origin_latitude: 45.4216,
    origin_longitude: -75.6973,
    destination_latitude: 45.4236,
    destination_longitude: -75.6953,
    pickup_location: "45.4216,-75.6973",
    dropoff_location: "45.4236,-75.6953",
    pickup_time: "2024-12-02T11:00:00Z",
    dropoff_time: "2024-12-02T11:30:00Z",
    fare: 30.0,
    status: "completed",
    driver_id: 2,
    user_email: "user2@example.com",
    created_at: "2024-12-01T09:00:00Z",
  },
];

export default function Page() {
  const { setUserLocation, setDestinationLocation } = useLocationStore()
  const { user } = useUser();

  const handleSignOut = () => {}
  const handleDestinationPress = (location: { 
    latitude: number, 
    longitude: number, 
    address: string }) => {
      setDestinationLocation(location);

      router.push("/(root)/find-ride");
    };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if(status !== 'granted') {
        setHasPermissions(false)
        return;
      }
    

    let location = await Location.getCurrentPositionAsync();

    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords?.latitude!,
      longitude: location.coords?.longitude!,
    });

    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: `${address[0].name}, ${address[0].region}`,
    })
  }
    
    requestLocation();
  }, [])

const [hasPermissions, setHasPermissions] = useState(false);

  return (
    
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides.slice(0,2)}
        renderItem={({ item }) => <RideCard ride={item} 
        />}
        keyboardShouldPersistTaps="handled"  
        contentContainerStyle={{
          paddingBottom: 100,
        }}  
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl mx-3">
                Welcome {user?.emailAddresses[0].emailAddress.split("@")[0]}
              </Text>
              <TouchableOpacity onPress={handleSignOut} className="justify-center items-center w-10 h-10 rounded-full bg-white">
                <Image source={icons.out} className="w-7 h-7"/>
              </TouchableOpacity>
            </View>

          <GoogleTextInput
            icon={icons.search}
            containerStyle="bg-white shadow-md shadow-neutral-300"
            handlePress={handleDestinationPress}

          />

          <>
            <Text className="text-xl mt-5 mb-3">
              Your Current Location
            </Text>
            <View className="flex flex-row items-center bg-transparent h-[300px]">
              <Map />
            </View>
          </>

          <Text className="text-xl mt-5 mb-3">
              Recent Rides
            </Text>

          </>
  )}
  />

      
    </SafeAreaView>
  );
}