import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import {
    Alert,
    BackHandler,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Theme } from '../constants/theme';

export default function EnterPinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Load saved email
    AsyncStorage.getItem('userEmail').then(email => {
      if (email) setUserEmail(email);
    });

    // Back button closes app
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => verifyPin(newPin), 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(p => p.slice(0, -1));
  };

  const verifyPin = async (enteredPin: string) => {
    const savedPin = await AsyncStorage.getItem('userPin');
    if (enteredPin === savedPin) {
      router.replace('/(tabs)');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      if (newAttempts >= 5) {
        Alert.alert(
          'Too Many Attempts',
          'You have entered wrong PIN 5 times. Please reset your PIN.',
          [{ text: 'Reset PIN', onPress: handleResetPin }]
        );
      } else {
        Alert.alert('Wrong PIN', `Incorrect PIN. ${5 - newAttempts} attempts remaining.`);
      }
    }
  };

  const handleResetPin = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase signOut failed during PIN reset:", error);
    }
    await AsyncStorage.removeItem('userPin');
    await AsyncStorage.removeItem('pinCreated');
    await AsyncStorage.removeItem('userEmail');
    router.replace('/login');
  };

  const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar backgroundColor={Theme.background.primary} barStyle="dark-content" />

      <View style={styles.container}>

        {/* Logo */}
        <Image
          source={require('../assets/images/easy-finance-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Welcome Back! 👋</Text>
        {userEmail ? (
          <Text style={styles.emailText}>{userEmail}</Text>
        ) : null}
        <Text style={styles.subtitle}>Enter your 4-digit PIN to continue</Text>

        {/* PIN Dots */}
        <View style={styles.dotsRow}>
          {[0,1,2,3].map(i => (
            <View
              key={i}
              style={[styles.dot, pin.length > i && styles.dotFilled]}
            />
          ))}
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          {KEYS.map((key, i) => (
            key === '' ? (
              <View key={i} style={styles.keyEmpty} />
            ) : key === '⌫' ? (
              <TouchableOpacity key={i} style={styles.keyDelete} onPress={handleDelete} activeOpacity={0.7}>
                <Text style={styles.keyDeleteText}>⌫</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity key={i} style={styles.key} onPress={() => handlePress(key)} activeOpacity={0.7}>
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            )
          ))}
        </View>

        {/* Forgot PIN */}
        <TouchableOpacity style={styles.forgotBtn} onPress={handleResetPin} activeOpacity={0.7}>
          <Text style={styles.forgotText}>Forgot PIN? Reset with Email & Password</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Theme.background.primary },
  container:   { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  logo:        { width: 170, height: 50, marginBottom: 32 },
  title:       { fontSize: 24, fontWeight: '900', color: Theme.text.primary, marginBottom: 8, textAlign: 'center' },
  emailText:   { fontSize: 15, color: Theme.green.primary, fontWeight: '600', marginBottom: 4 },
  subtitle:    { fontSize: 13, color: Theme.text.secondary, marginBottom: 36, textAlign: 'center' },
  dotsRow:     { flexDirection: 'row', gap: 20, marginBottom: 48 },
  dot:         { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Theme.green.primary, backgroundColor: 'transparent' },
  dotFilled:   { backgroundColor: Theme.green.primary },
  keypad:      { flexDirection: 'row', flexWrap: 'wrap', width: 280, gap: 16, justifyContent: 'center' },
  key:         { width: 72, height: 72, borderRadius: 36, backgroundColor: Theme.background.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Theme.border },
  keyText:     { fontSize: 24, fontWeight: '700', color: Theme.text.primary },
  keyEmpty:    { width: 72, height: 72 },
  keyDelete:   { width: 72, height: 72, borderRadius: 36, backgroundColor: Theme.background.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Theme.border },
  keyDeleteText:{ fontSize: 22, color: '#FF4D4D' },
  forgotBtn:   { marginTop: 32 },
  forgotText:  { color: Theme.text.muted, fontSize: 13, fontWeight: '600', textAlign: 'center', textDecorationLine: 'underline' },
});