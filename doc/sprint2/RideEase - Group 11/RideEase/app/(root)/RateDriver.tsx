// import React from 'react';
// import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
// import { useNavigation, NavigationProp } from '@react-navigation/native';

// import { RootStackParamList } from './index'; // Import the types

// export default function RateYourDriverScreen() {

//     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.form}>
//         <Text style={styles.title}>Rate your driver</Text>

//         <Text style={styles.label}>Passenger ID *</Text>
//         <TextInput style={styles.input} placeholder="Enter Passenger ID" />

//         <Text style={styles.label}>Ride ID *</Text>
//         <TextInput style={styles.input} placeholder="Enter Ride ID" />

//         <Text style={styles.label}>Rating (1-5) *</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Rating (1-5)"
//           keyboardType="numeric"
//         />

//         <Text style={styles.label}>Review *</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           placeholder="Enter your review"
//           multiline={true}
//           numberOfLines={4}
//         />
//       </ScrollView>

//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RatingReview")}>
//         <Text style={styles.buttonText}>Rate</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9F9F9',
//   },
//   form: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#333',
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#CCCCCC',
//     borderRadius: 5,
//     backgroundColor: '#E5E5E5',
//     paddingHorizontal: 10,
//     marginBottom: 15,
//   },
//   textArea: {
//     height: 100, // Custom height for the review text area
//     textAlignVertical: 'top', // Ensures text starts at the top
//     padding: 10, // Adds inner spacing inside the text area
//     marginTop: 5, // Adds space between the label and text area
//   },
//   button: {
//     height: 50,
//     backgroundColor: '#333',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { router } from 'expo-router';

const RateDriverScreen = () => {
    const [rating, setRating] = useState<string>('');
    const [review, setReview] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const backendUrl = "http://192.168.86.76:5000"; // Replace with your backend URL

    const handleRateDriver = async () => {
        if (!rating || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
            Alert.alert('Error', 'Please enter a valid rating between 1 and 5.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/submit-rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passenger_id: 1, // Replace with the actual logged-in passenger ID
                    ride_id: 1234, // Replace with the actual ride ID
                    rating: Number(rating),
                    review,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit rating.');
            }

            const data = await response.json();
            Alert.alert('Success', data.message);

            // Navigate to the RatingSuccessScreen with the response data
            router.push({
                pathname: '/RatingReview',
                params: {
                    newAverageRating: data.new_average_rating,
                    totalRatings: data.total_ratings,
                },
            });
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Rate your driver</Text>

            {/* Complain Button */}
            <TouchableOpacity style={styles.complainButton} onPress={() => router.push('/Complaint')}>
                <Text style={styles.complainText}>Complain</Text>
            </TouchableOpacity>

            {/* Rating Input */}
            <Text style={styles.label}>Rating (1-5) *</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter rating"
                placeholderTextColor="#D3D3D3"
                keyboardType="numeric"
                value={rating}
                onChangeText={setRating}
            />

            {/* Review Input */}
            <Text style={styles.label}>Review *</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your review"
                placeholderTextColor="#D3D3D3"
                multiline={true}
                numberOfLines={4}
                value={review}
                onChangeText={setReview}
            />

            {/* Rate Button */}
            <TouchableOpacity style={styles.rateButton} onPress={handleRateDriver} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Rate'}</Text>
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/home')}>
                <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
        </View>
    );
};

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
    complainButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#65BB6A',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    complainText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
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
        height: 100,
        textAlignVertical: 'top',
    },
    rateButton: {
        height: 50,
        backgroundColor: '#65BB6A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30, // Rounded button
        marginTop: 20,
    },
    skipButton: {
        height: 50,
        backgroundColor: '#D3D3D3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30, // Rounded button
        marginTop: 15,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RateDriverScreen;
