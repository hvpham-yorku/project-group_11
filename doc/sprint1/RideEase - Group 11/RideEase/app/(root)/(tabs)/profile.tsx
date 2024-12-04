import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageSourcePropType } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating-widget';
import { Link } from 'expo-router';

interface Car {
make: string;
model: string;
year: number;
licensePlate: string;
}

interface Contact {
phone: string;
email: string;
}

interface Driver {
name: string;
photo: string;
rating: number;
car: Car;
contact: Contact;
bio: string;
}

const DriverProfile: React.FC = () => {
const driver: Driver = {
name: 'John Doe',
photo: 'https://i.pravatar.cc/300', 
rating: 4.5,
car: {
make: 'Toyota',
model: 'Camry',
year: 2018,
licensePlate: 'ABC-1234',
},
contact: {
phone: '+1 (555) 123-4567',
email: 'johndoe@example.com',
},
bio: 'Friendly and experienced driver with a passion for customer service.',
};

  return (
  <ScrollView contentContainerStyle={styles.container}>
  <Card containerStyle={styles.card}>
  <View style={styles.header}>
<Image source={{ uri: driver.photo }} style={styles.photo} />
<View style={styles.info}>
<Text style={styles.name}>{driver.name}</Text>
<View style={styles.ratingContainer}>
<StarRating
rating={driver.rating}
onChange={() => {}}starSize={20}
enableSwiping={false}
enableHalfStar={true}
starStyle={{ marginHorizontal: 1 }}
/>
</View>
</View>
  </View>
<Divider style={styles.divider} />
  <View style={styles.section}>
<Text style={styles.sectionTitle}>Car Details</Text>
<Text style={styles.sectionContent}>
{driver.car.year} {driver.car.make} {driver.car.model}</Text>
<Text style={styles.sectionContent}>
License Plate: {driver.car.licensePlate}
</Text>
  </View>
<Divider style={styles.divider} /> 
  <View style={styles.section}>
<Text style={styles.sectionTitle}>Contact Information</Text>
<View style={styles.contactItem}>
<Ionicons name="call" size={20} color="gray" />
<Text style={styles.contactText}>{driver.contact.phone}</Text>
</View>
<View style={styles.contactItem}>
<Ionicons name="mail" size={20} color="gray" />
<Text style={styles.contactText}>{driver.contact.email}</Text>
</View>
  </View>
<Divider style={styles.divider} />
<View style={styles.section}>
<Text style={styles.sectionTitle}>About Driver</Text>
<Text style={styles.sectionContent}>{driver.bio}</Text>
</View>
</Card>
<Link href={"/(driver)/driver-payment-history"}>Payment History</Link>
<Link href={"/(driver)/availability"}>Availability</Link>
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

export default DriverProfile;