import { View, Text } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { DriverStore, MarkerData } from "@/types/type";
import { useEffect, useState } from "react";
import { icons } from "@/constants";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  });

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        if (!userLatitude || !userLongitude) return;

        const response = await axios.post("http://192.168.86.76:5000/ride/view-requests", {
          driver_id: 1, // Replace with the actual driver ID if required
          address: `${userLatitude},${userLongitude}`, // Use user's current location
        });

        const { ride_requests } = response.data; // Assuming response contains 'ride_requests' array

        // Set the drivers in the store
        setDrivers(ride_requests);

        // Generate markers from the fetched data
        const newMarkers = generateMarkersFromData({
          data: ride_requests,
          userLatitude,
          userLongitude,
        });
        setMarkers(newMarkers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, [userLatitude, userLongitude]);

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker) => (
        <Marker
          key={marker.driver_id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.driver_id ? icons.selectedMarker : icons.marker
          }
        />
      ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />

          <MapViewDirections
            origin={{
              latitude: userLatitude!,
              longitude: userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey='IzaSyCLJN1yOyQVj7jk6cTAtwpjOLSzFRGnf70'
            strokeColor="#4ade80"
            strokeWidth={3}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;