import { View, Text } from "react-native"
import MapView, {Marker, PROVIDER_DEFAULT} from "react-native-maps"
import { calculateRegion, generateMarkersFromData } from "@/lib/map"
import { useDriverStore, useLocationStore } from "@/store"
import { DriverStore } from "@/types/type"
import { useEffect, useState } from "react"
import { MarkerData } from "@/types/type"
import { icons } from "@/constants"

const drivers = [
    {
        "driver_id": 1,
        "name": "James Wilson",
        "capacity": 3,
        "rating": "4.90"
    },
    {
        "driver_id": 2,
        "name": "David Brown",
        "capacity": 5,
        "rating": "4.60"
    },
]

const Map = () => {
    
    const {
        userLongitude, 
        userLatitude, 
        destinationLatitude, 
        destinationLongitude,
    } = useLocationStore();
    const { selectedDriver, setDrivers } = useDriverStore();
    const [markers, setMarkers] = useState<MarkerData[]>( [])

    const region = calculateRegion({
        userLongitude, 
        userLatitude, 
        destinationLatitude, 
        destinationLongitude,
    })

    useEffect(() => {
        // TODO: Remove
        setDrivers(drivers);

        if(Array.isArray(drivers)) {
            if(!userLatitude || !userLongitude) return;

            const newMarkers = generateMarkersFromData({
                data: drivers,
                userLatitude,
                userLongitude,

            })
            setMarkers(newMarkers)
        }
    }, [drivers])

    return(
        <MapView provider={PROVIDER_DEFAULT} 
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
                    latitude:marker.latitude,
                    longitude: marker.longitude
                }}
                title={marker.title}
                image={
                    selectedDriver === marker.driver_id ? icons.selectedMarker :
                    icons.marker
                }
                />
            ))}
        </MapView>
    )
}

export default Map