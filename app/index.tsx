import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAppState = async () => {
      const pinCreated = await AsyncStorage.getItem('pinCreated');
      if (pinCreated === 'true') {
        router.replace('/enter-pin');
      } else {
        router.replace('/login');
      }
    };
    checkAppState();
  }, [router]);

  return null;
}