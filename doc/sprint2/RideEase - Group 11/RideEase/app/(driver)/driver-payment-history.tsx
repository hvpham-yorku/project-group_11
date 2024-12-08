import PaymentItem from '@/components/PaymentItem';
import React, { useEffect, useState } from 'react';
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
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const backendUrl = "http://192.168.86.76:5000"; // Replace with your backend URL

    useEffect(() => {
        fetchPaymentHistory(1); // Replace `1` with dynamic driver ID if needed
    }, []);

    const fetchPaymentHistory = async (driverId: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/driver-payment-history/${driverId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch payment history.");
            }
            const data = await response.json();

            // Transform the data to match the Payment interface
            const formattedPayments: Payment[] = data.payment_history.map((payment: any) => ({
                id: payment.ride_id,
                date: payment.date,
                amount: payment.amount,
                rideId: payment.ride_id,
                passengerName: "N/A", // Backend does not return passengerName, update if needed
                status: payment.payment_status === "completed" ? "Completed" : "Pending",
            }));

            setPayments(formattedPayments);
            setLoading(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch payment history.');
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPaymentHistory(1); // Replace `1` with dynamic driver ID if needed
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: Payment }) => <PaymentItem payment={item} />;

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
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
