import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';

export default function FileAComplaintScreen() {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>File a complaint</Text>

      {/* Complaint Type Input */}
      <Text style={styles.label}>Complaint Type *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter complaint type"
        placeholderTextColor="#D3D3D3"
      />

      {/* Complaint Text Area */}
      <Text style={styles.label}>Complaint *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter your complaint"
        placeholderTextColor="#D3D3D3"
        multiline={true}
        numberOfLines={4}
      />

      {/* Submit Button (Should take you home)*/} 
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>File a complaint</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 5,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100, // Custom height for the text area
    textAlignVertical: 'top', // Ensures text starts at the top
  },
  button: {
    height: 50,
    backgroundColor: '#65BB6A', // Green color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30, // Rounded button
    marginTop: 20, // Space between the text area and button
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
