// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC9j6wS3nATXaNzaTMs1zVhYDyh7WwyWDE',
  authDomain: "rideease-3fdf3.firebaseapp.com",
  projectId: "rideease-3fdf3",
  storageBucket: "rideease-3fdf3.firebasestorage.app",
  messagingSenderId: "1075916104347",
  appId: "1:1075916104347:web:76e71637fcb48e80ca5c3e",
  measurementId: "G-NSMELGZ0F9"
};

// Initialize Firebase App if no apps are already initialized
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
//const analytics = getAnalytics(app);

// Initialize Auth with AsyncStorage
const auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  

export default firebaseApp;