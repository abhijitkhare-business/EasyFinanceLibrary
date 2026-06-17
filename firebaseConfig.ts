import { initializeApp, getApp, getApps } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB5jfYVUFH8EhIFpWsWsaXHEHKT2Dzhyq4",
  authDomain: "easy-finance-library.firebaseapp.com",
  projectId: "easy-finance-library",
  storageBucket: "easy-finance-library.firebasestorage.app",
  messagingSenderId: "1080515464985",
  appId: "1:1080515464985:web:d5917fc3ba6f117576bf88",
};

// Avoid initializing app twice during Metro hot-reload (HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Avoid initializing auth twice during Metro hot-reload (HMR)
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error: any) {
  authInstance = getAuth(app);
}

export const auth = authInstance;