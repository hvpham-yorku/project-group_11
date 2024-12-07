import { create } from "zustand";
import axios from "axios";
import { LocationStore, DriverStore, MarkerData } from "@/types/type";

// Define the type for ride requests
export interface Request {
  requestId: number;
  origin: string;
  destination: string;
  fare: number;
  status: "pending" | "accepted" | "completed";
}

// Define the store type for requests
interface RequestsStore {
  rideRequests: Request[];
  setRideRequests: () => void;
  acceptRideRequest: (id: number) => void;
}

// Define constants for routes
const VIEW_REQUESTS_ROUTE = "http://192.168.86.76:5000/ride/view-requests";
const ACCEPT_REQUEST_ROUTE = "http://192.168.86.76:5000/ride/accept-request";
const CALCULATE_FARE_ROUTE = "http://192.168.86.76:5000/ride/calculate-fare";

// Location Store
export const useLocationStore = create<LocationStore>((set) => ({
  userAddress: null,
  userLongitude: null,
  userLatitude: null,
  destinationLongitude: null,
  destinationLatitude: null,
  destinationAddress: null,

  setUserLocation: ({ latitude, longitude, address }: { latitude: number; longitude: number; address: string }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));
  },

  setDestinationLocation: async ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    try {
      const { userLatitude, userLongitude } = useLocationStore.getState();
      const response = await axios.post(CALCULATE_FARE_ROUTE, {
        origin: `${userLatitude},${userLongitude}`,
        destination: `${latitude},${longitude}`,
      });

      console.log("Fare calculation:", response.data);
    } catch (error) {
      console.error("Error calculating fare:", error);
    }
  },
}));

// Driver Store
export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[],
  selectedDriver: null,

  setSelectedDriver: (driverId: number) => set(() => ({ selectedDriver: driverId })),

  setDrivers: async () => {
    try {
      const { userLatitude, userLongitude } = useLocationStore.getState();
      const response = await axios.post(VIEW_REQUESTS_ROUTE, {
        address: `${userLatitude},${userLongitude}`,
        driver_id: 1, // Replace with dynamic driver ID if needed
      });

      const { ride_requests } = response.data;
      set(() => ({ drivers: ride_requests }));
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  },

  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));

// Ride Requests Store
export const useRideRequestsStore = create<RequestsStore>((set) => ({
  rideRequests: [],

  setRideRequests: async () => {
    try {
      const { userLatitude, userLongitude } = useLocationStore.getState();
      const response = await axios.post(VIEW_REQUESTS_ROUTE, {
        address: `${userLatitude},${userLongitude}`,
        driver_id: 1, // Replace with dynamic driver ID if needed
      });

      const { ride_requests } = response.data;
      set(() => ({ rideRequests: ride_requests }));
    } catch (error) {
      console.error("Error fetching ride requests:", error);
    }
  },

  acceptRideRequest: async (id: number) => {
    try {
      const response = await axios.post(ACCEPT_REQUEST_ROUTE, {
        driver_id: 1, // Replace with dynamic driver ID if needed
        request_id: id,
        driver_location: "Driver's current location", // Replace with actual driver location
      });

      console.log("Accepted ride request:", response.data);

      set((state) => ({
        rideRequests: state.rideRequests.map((request: Request) =>
          request.requestId === id ? { ...request, status: "accepted" } : request
        ),
      }));
    } catch (error) {
      console.error("Error accepting ride request:", error);
    }
  },
}));