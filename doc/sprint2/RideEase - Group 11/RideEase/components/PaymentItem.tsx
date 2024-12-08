import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define TypeScript interface for Payment prop
interface Payment {
  id: string;
  date: string;
  amount: number;
  rideId: string;
  passengerName: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

interface Props {
  payment: Payment;
  onPress?: (payment: Payment) => void;
}

const PaymentItem: React.FC<Props> = ({ payment, onPress }) => {
  // Determine icon and color based on status
  const getStatusIcon = () => {
    switch (payment.status) {
      case 'Completed':
        return <Ionicons name="checkmark-circle" size={20} color="green" />;
      case 'Pending':
        return <Ionicons name="time" size={20} color="orange" />;
      case 'Cancelled':
        return <Ionicons name="close-circle" size={20} color="red" />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress && onPress(payment)}>
      <View style={styles.leftSection}>
        <Text style={styles.date}>{payment.date}</Text>
        <Text style={styles.rideId}>Ride ID: {payment.rideId}</Text>
        <Text style={styles.passenger}>Passenger: {payment.passengerName}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.amount}>${payment.amount.toFixed(2)}</Text>
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
            {payment.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Helper function to determine status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'green';
    case 'Pending':
      return 'orange';
    case 'Cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 1,
  },
  leftSection: {
    flex: 2,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 14,
    color: '#555555',
  },
  rideId: {
    fontSize: 14,
    color: '#555555',
  },
  passenger: {
    fontSize: 14,
    color: '#555555',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PaymentItem;
