import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const RatingSuccessScreen = () => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Rating Success</Text>

      {/* New Average Rating */}
      <Text style={styles.text}>New Average Rating:</Text>
      <Text style={styles.value}>--</Text> {/* Placeholder for backend value */}

      {/* Total Ratings */}
      <Text style={styles.text}>Total Ratings:</Text>
      <Text style={styles.value}>--</Text> {/* Placeholder for backend value */}

      {/* Back to Home Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/home")}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#65BB6A',
    marginBottom: 20,
  },
  button: {
    marginTop: 40,
    width: '70%', // Adjust button width
    height: 50,
    backgroundColor: '#65BB6A', // Green color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30, // Rounded button
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RatingSuccessScreen;
