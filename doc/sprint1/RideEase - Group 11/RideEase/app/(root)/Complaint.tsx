import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';

export default function FileAComplaintScreen() {
    const [complaintType, setComplaintType] = useState<string>('');
    const [complaintText, setComplaintText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const backendUrl = "http://192.168.86.76:5000"; // Replace with your backend URL

    const handleFileComplaint = async () => {
        if (!complaintType || !complaintText) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/submit-complaint`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 1, // Replace with the actual logged-in user ID
                    ride_id: null, // Optional: Replace with actual ride ID if applicable
                    complaint_type: complaintType,
                    complaint_text: complaintText,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit complaint.');
            }

            const data = await response.json();
            Alert.alert('Success', data.message);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

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
                value={complaintType}
                onChangeText={setComplaintType}
            />

            {/* Complaint Text Area */}
            <Text style={styles.label}>Complaint *</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your complaint"
                placeholderTextColor="#D3D3D3"
                multiline={true}
                numberOfLines={4}
                value={complaintText}
                onChangeText={setComplaintText}
            />

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleFileComplaint}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'File a complaint'}</Text>
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
