import { create } from "zustand"
import { LocationStore, DriverStore } from "@/types/type"
import { MarkerData } from "@/types/type"

export const useLocationStore = create<LocationStore>((set) => ({
    userAddress: null,
    userLongitude: null,
    userLatitude: null,
    destinationLongitude: null,
    destinationLatitude: null,
    destinationAddress: null,
        setUserLocation: ({ latitude, longitude, address} : { latitude: number, longitude: number, address: string 
        }) => {
            set(() => ({
                userLatitude: latitude,
                userLongitude: longitude,
                userAddress: address,
            }))
        },  
        setDestinationLocation: ({ latitude, longitude, address} : { latitude: number, longitude: number, address: string 
        }) => {
            set(() => ({
                destinationLatitude: latitude,
                destinationLongitude: longitude,
                destinationAddress: address,
            }))
        },
    
}))

export const useDriverStore = create<DriverStore>((set) => ({
    drivers:[] as MarkerData[],
    selectedDriver: null,
    setSelectedDriver: (driverId: number) => set(() => ({
        selectedDriver: driverId
    })),
    setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers: drivers })),
    clearSelectedDriver: () => set(() => ({ selectedDriver: null })),

}))

export type RideRequest = {
    id: number;
    origin: string;
    destination: string;
    fare: number;
    status: "pending" | "accepted" | "completed";
};

type RideRequestsStore = {
    rideRequests: RideRequest[];
    setRideRequests: (requests: RideRequest[]) => void;
    acceptRideRequest: (id: number) => void;
};

export const useRideRequestsStore = create<RideRequestsStore>((set) => ({
    rideRequests: [],
    setRideRequests: (requests: RideRequest[]) =>
        set(() => ({ rideRequests: requests })),
    acceptRideRequest: (id: number) =>
        set((state) => ({
            rideRequests: state.rideRequests.map((request: RideRequest) =>
                request.id === id ? { ...request, status: "accepted" } : request
            ),
        })),
}));

