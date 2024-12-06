// import React from 'react';
// import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';

// export default function PassengerSignUpScreen() {
//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.form}>
//         <Text style={styles.title}>Sign Up for Passengers</Text>

//         <Text style={styles.label}>Name *</Text>
//         <TextInput style={styles.input} placeholder="Enter your phone number" keyboardType="phone-pad" />
        
//         <Text style={styles.label}>Phone Number *</Text>
//         <TextInput style={styles.input} placeholder="Enter your full name" keyboardType="phone-pad" />

//         <Text style={styles.label}>Address *</Text>
//         <TextInput style={styles.input} placeholder="Enter your address" />

//         <Text style={styles.label}>Email *</Text>
//         <TextInput style={styles.input} placeholder="Enter your email" keyboardType="email-address" />

//         <Text style={styles.label}>Credit Card *</Text>
//         <TextInput style={styles.input} placeholder="Enter your credit card number" keyboardType="numeric" />
//       </ScrollView>

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Sign Up</Text>
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
//   button: {
//     height: 50,
//     backgroundColor: '#333',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//     marginHorizontal: 20,
//     marginBottom: 20, // Adds some spacing at the bottom
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PassengerSignUpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>Sign Up for Passengers</Text>

        <Text style={styles.label}>Name *</Text>
        <TextInput style={styles.input} placeholder="Enter your phone number" keyboardType="phone-pad" />
        
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput style={styles.input} placeholder="Enter your full name" keyboardType="phone-pad" />

        <Text style={styles.label}>Address *</Text>
        <TextInput style={styles.input} placeholder="Enter your address" />

        <Text style={styles.label}>Email *</Text>
        <TextInput style={styles.input} placeholder="Enter your email" keyboardType="email-address" />

        <Text style={styles.label}>Credit Card *</Text>
        <TextInput style={styles.input} placeholder="Enter your credit card number" keyboardType="numeric" />

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
    marginTop: 20, // Adds some spacing at the top
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
