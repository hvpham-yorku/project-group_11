import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '@/firebaseConfig';

const auth = getAuth(firebaseApp);

// Sign Up Function
export const signUp = async (email: string, password: string): Promise<any> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    if (error instanceof Error)
    console.error('Error signing up:', error.message);
    throw error;
  }
};

// Sign In Function
export const signIn = async (email: string, password: string): Promise<any> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    if (error instanceof Error)
    console.error('Error signing in:', error.message);
    throw error;
  }
};