import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { router } from 'expo-router';

export default function DriverSignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType] = useState('driver'); // Fixed to "driver"
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountType, setAccountType] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [sin, setSin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !userType ||
      !phoneNumber ||
      !bankAccount ||
      !accountType ||
      !initialBalance ||
      !licenseNumber ||
      !eligibility ||
      !insuranceNumber ||
      !sin
    ) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true);

      // Construct request payload
      const payload = {
        name,
        email,
        password,
        user_type: userType,
        phone_number: phoneNumber,
        account_number: bankAccount,
        account_type: accountType.toLowerCase(), // Ensure lowercase for validation
        initial_balance: parseFloat(initialBalance), // Convert balance to float
        drivers_license: licenseNumber,
        work_eligibility: eligibility,
        car_insurance: insuranceNumber,
        sin,
      };

      // Make a POST request to the backend
      const response = await axios.post('http://192.168.86.76:5000/auth/signup', payload);

      // Handle success response
      Alert.alert('Success', 'Account created successfully!');
      router.push('/sign-in');
    } catch (error: any) {
      // Handle error response
      const errorMessage = error.response?.data?.error || 'An error occurred during sign-up.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>Sign Up for Drivers</Text>

        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Bank Account Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your bank account number"
          keyboardType="numeric"
          value={bankAccount}
          onChangeText={setBankAccount}
        />

        <Text style={styles.label}>Account Type *</Text>
        <TextInput
          style={styles.input}
          placeholder="Savings or Checking"
          value={accountType}
          onChangeText={setAccountType}
        />

        <Text style={styles.label}>Initial Balance *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter initial balance"
          keyboardType="numeric"
          value={initialBalance}
          onChangeText={setInitialBalance}
        />

        <Text style={styles.label}>Driver's License Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your driver's license number"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
        />

        <Text style={styles.label}>Work Eligibility *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your work eligibility status"
          value={eligibility}
          onChangeText={setEligibility}
        />

        <Text style={styles.label}>Car Insurance Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your car insurance number"
          value={insuranceNumber}
          onChangeText={setInsuranceNumber}
        />

        <Text style={styles.label}>SIN *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your SIN"
          value={sin}
          onChangeText={setSin}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
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
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});