import PaymentItem from '@/components/PaymentItem';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';

// Define TypeScript interfaces for payment data
interface Payment {
id: string;
date: string;
amount: number;
rideId: string;
passengerName: string;
status: 'Completed' | 'Pending' | 'Cancelled';
}

const DriverPaymentHistory: React.FC = () => {
// const { driver } = useContext(DriverContext);
const [payments, setPayments] = useState<Payment[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [refreshing, setRefreshing] = useState<boolean>(false);

useEffect(() => {

fetchPaymentHistory(1);

}, []);

const fetchPaymentHistory = async (driverId: number) => {
try {
// Replace with actual API call
setTimeout(() => {
const samplePayments: Payment[] = [
{
id: '1',
date: '2023-08-15',
amount: 25.5,
rideId: 'RIDE1234',
passengerName: 'Alice Johnson',
status: 'Completed',
},
{
id: '2',
date: '2023-08-14',
amount: 30.0,
rideId: 'RIDE1235',
passengerName: 'Bob Smith',
status: 'Completed',
},
{
id: '3',
date: '2023-08-13',
amount: 0.0,
rideId: 'RIDE1236',
passengerName: 'Charlie Brown',
status: 'Cancelled',
},
// Add more sample data as needed
];

setPayments(samplePayments);
setLoading(false);
}, 1500);
} catch (error) {
Alert.alert('Error', 'Failed to fetch payment history.');
setLoading(false);
}
};

const onRefresh = async () => {
setRefreshing(true);
await fetchPaymentHistory(1); 
setRefreshing(false);
};

const renderItem = ({ item }: { item: Payment }) => (
<PaymentItem payment={item} />
);

return (
<View style={styles.container}>
<Text style={styles.title}>Payment History</Text>
{loading && !refreshing ? (
<ActivityIndicator size="large" color="#0000ff" />
) : payments.length === 0 ? (
<Text style={styles.noDataText}>No payment history available.</Text>
) : (
<FlatList
data={payments}
renderItem={renderItem}
keyExtractor={(item) => item.id}
contentContainerStyle={styles.list}
refreshControl={
<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
}
/>
)}
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 16,
backgroundColor: '#ffffff',
},
title: {
fontSize: 24,
fontWeight: 'bold',
marginBottom: 16,
textAlign: 'center',
},
list: {
paddingBottom: 20,
},
noDataText: {
fontSize: 16,
color: 'gray',
textAlign: 'center',
marginTop: 20,
},
});

export default DriverPaymentHistory;