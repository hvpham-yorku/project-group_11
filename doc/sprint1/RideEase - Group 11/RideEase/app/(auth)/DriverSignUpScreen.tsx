import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DriverSignUpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>Sign Up for Drivers</Text>

        <Text style={styles.label}>Name *</Text>
        <TextInput style={styles.input} placeholder="Enter your name" />

        <Text style={styles.label}>Email *</Text>
        <TextInput style={styles.input} placeholder="Enter your email" keyboardType="email-address" />

        <Text style={styles.label}>Password *</Text>
        <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry={true} />

        <Text style={styles.label}>User Type *</Text>
        <TextInput style={styles.input} placeholder="Driver or Passenger" />

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput style={styles.input} placeholder="Enter your phone number" keyboardType="phone-pad" />

        <Text style={styles.label}>Bank Account Number *</Text>
        <TextInput style={styles.input} placeholder="Enter your bank account number" keyboardType="numeric" />

        <Text style={styles.label}>Account Type *</Text>
        <TextInput style={styles.input} placeholder="Savings or Checking" />

        <Text style={styles.label}>Initial Balance *</Text>
        <TextInput style={styles.input} placeholder="Enter initial balance" keyboardType="numeric" />

        <Text style={styles.label}>Driver's License Number *</Text>
        <TextInput style={styles.input} placeholder="Enter your driver's license number" />

        <Text style={styles.label}>Work Eligibility *</Text>
        <TextInput style={styles.input} placeholder="Enter your work eligibility status" />

        <Text style={styles.label}>Car Insurance Number *</Text>
        <TextInput style={styles.input} placeholder="Enter your car insurance number" />

        <Text style={styles.label}>SIN *</Text>
        <TextInput style={styles.input} placeholder="Enter your SIN" />

        {/* Move the button inside the ScrollView */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    height: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20, // Adds spacing between the form fields and the button
    marginBottom: 30
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
