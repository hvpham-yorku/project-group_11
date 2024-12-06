import {TextInputProps, TouchableOpacityProps} from "react-native";

declare interface Driver {
    driver_id: number;
    user_id: number;
    name:string;
    drivers_license: string;
    work_eligibility: string;
    car_insurance: string;
    sin: string;
    bank_details: string;
}

declare interface Request {
    requestId: number; // Unique identifier for the request
    passenger: {
      name: string; // Passenger's name
      email: string; // Passenger's email
    };
    origin_address: string; // Pickup address
    destination_address: string; // Dropoff address
    fare: number; // Fare amount
    status: string // Status of the request
    created_at: string; // Timestamp of when the request was created
  };

declare interface Vehicles {
    vehicle_id: number;
    driver_id: number;
    make: string;
    model: string;
    year: number;
    license_plate: string;
    capacity: number;
}

declare interface Driver_rating {
    rating_id: number;
    driver_id: number;
    passenger_id: number;
    ride_id: number;
    rating: number;
    review: string;
    created_at: string
}

declare interface MarkerData {
    latitude: number;
    longitude: number;
    driver_id: number;
    title: string;
    //capacity: number;
    //rating: number;
    name: string;
    time?: number;
    price?: string;
}

declare interface MapProps {
    destinationLatitude?: number;
    destinationLongitude?: number;
    onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
    selectedDriver?: number | null;
    onMapReady?: () => void;
}

declare interface Ride {
    pickup_location: string;
    dropoff_location: string;
    pickup_time: string;
    dropoff_time: string;
    fare: number;
    status: string;
    driver_id: number;
    user_email: string;
    created_at: string;
    driver: {
        driver_id: number;
        name: string;
        make: string;
        model: string;
        year: number;
        license_plate: string;
        capacity: number;
        rating: number;
    };
}

declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}

declare interface GoogleInputProps {
    icon?: string;
    initialLocation?: string;
    containerStyle?: string;
    textInputBackgroundColor?: string;
    handlePress: ({
                      latitude,
                      longitude,
                      address,
                  }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
}

declare interface PaymentProps {
    fullName: string;
    email: string;
    amount: string;
    driver_id: number;
    rideTime: number;
}

declare interface LocationStore {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
    destinationAddress: string | null;
    setUserLocation: ({
                          latitude,
                          longitude,
                          address,
                      }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
    setDestinationLocation: ({
                                 latitude,
                                 longitude,
                                 address,
                             }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

declare interface DriverStore {
    drivers: MarkerData[];
    selectedDriver: number | null;
    setSelectedDriver: (driverId: number) => void;
    setDrivers: (drivers: MarkerData[]) => void;
    clearSelectedDriver: () => void;
}

declare interface DriverCardProps {
    item: MarkerData;
    selected: number;
    setSelected: () => void;
}