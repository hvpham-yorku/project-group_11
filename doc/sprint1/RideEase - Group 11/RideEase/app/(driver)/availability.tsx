import ToggleSwitch from '@/components/ToggleSwitch';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Button } from 'react-native-elements';

const SetAvailability: React.FC = () => {
const [isOnline, setIsOnline] = useState<boolean>(false);
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
fetchAvailabilityStatus(1);

}, []);

const fetchAvailabilityStatus = async (driverId: number) => {
try {
// Simulate API call delay
setTimeout(() => {
// Sample status data
const sampleStatus = true; 
setIsOnline(sampleStatus);
setLoading(false);
}, 1000);
} catch (error) {
Alert.alert('Error', 'Failed to fetch availability status.');
setLoading(false);
}
};

const toggleSwitch = async () => {


try {
setLoading(true);
// Simulate API call to update status
setTimeout(() => {
// Update the status locally. Replace with actual API call.
const newStatus = !isOnline;
setIsOnline(newStatus);
setLoading(false);
Alert.alert('Success', `You are now ${newStatus ? 'Online' : 'Offline'}.`);
}, 10);
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
button: {
backgroundColor: '#2089dc',
},
buttonContainer: {
marginTop: 20,
},
});

export default SetAvailability;