import ToggleSwitch from '@/components/ToggleSwitch';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const SetAvailability: React.FC = () => {
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const backendUrl = "http://192.168.86.76:5000"; // Backend URL

    useEffect(() => {
        fetchAvailabilityStatus(1); // Replace with dynamic driver ID if applicable
    }, []);

    const fetchAvailabilityStatus = async (driverId: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/set-availability/${driverId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch availability status.");
            }
            const data = await response.json();
            setIsOnline(data.availability); // Assuming the backend returns "availability"
            setLoading(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch availability status.');
            setLoading(false);
        }
    };

    const toggleSwitch = async () => {
        try {
            setLoading(true);
            const newStatus = !isOnline;
            const response = await fetch(`${backendUrl}/set-availability/1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    availability: newStatus ? "online" : "offline",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update availability status.");
            }

            const data = await response.json();
            setIsOnline(newStatus);
            setLoading(false);
            Alert.alert('Success', data.message);
        } catch (error) {
            Alert.alert('Error', 'Failed to update availability status.');
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Set Availability</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ToggleSwitch
                    label="Driver Status"
                    value={isOnline}
                    onValueChange={toggleSwitch}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
});

export default SetAvailability;
