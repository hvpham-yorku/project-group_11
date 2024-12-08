import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageSourcePropType } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating-widget';
import { Link } from 'expo-router';

interface Contact {
phone: string;
email: string;
}

interface Passenger {
name: string;
contact: Contact;
}

const PassengerProfile: React.FC = () => {
const passenger: Passenger = {
name: 'John Doe',
contact: {
phone: '+1 (555) 123-4567',
email: 'johndoe@example.com',
}
}

  return (
  <ScrollView contentContainerStyle={styles.container}>
  <Card containerStyle={styles.card}>
  <View style={styles.header}>
<View style={styles.info}>
<Text style={styles.name}>{passenger.name}</Text>
<View style={styles.ratingContainer}>
</View>
</View>
  </View>
<Divider style={styles.divider} /> 
  <View style={styles.section}>
<Text style={styles.sectionTitle}>Contact Information</Text>
<View style={styles.contactItem}>
<Ionicons name="call" size={20} color="gray" />
<Text style={styles.contactText}>{passenger.contact.phone}</Text>
</View>
<View style={styles.contactItem}>
<Ionicons name="mail" size={20} color="gray" />
<Text style={styles.contactText}>{passenger.contact.email}</Text>
</View>
  </View>
</Card>
 </ScrollView>
);
};

const styles = StyleSheet.create({
container: {
paddingVertical: 50,
padding:16,
flexGrow:1,
alignItems:"center",
backgroundColor: "#fff"
},
card: {
borderRadius: 10,
padding: 15,
elevation: 3,
},
header: {
flexDirection: 'row',
alignItems: 'center',
},
photo: {
width: 80,
height: 80,
borderRadius: 40,
},
info: {
marginLeft: 15,
flex: 1,
},
name: {
fontSize: 22,
fontWeight: 'bold',
},
ratingContainer: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 5,
},
ratingText: {
marginLeft: 10,
fontSize: 16,
color: 'gray',
},
divider: {
marginVertical: 15,
},
section: {
marginBottom: 10,
},
sectionTitle: {
fontSize: 18,
fontWeight: '600',
marginBottom: 5,
},
sectionContent: {
fontSize: 16,
color: 'gray',
},
contactItem: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 5,
},
contactText: {
marginLeft: 10,
fontSize: 16,
color: 'gray',
},
});

export default PassengerProfile;