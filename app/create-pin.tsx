import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert, Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';

export default function CreatePinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');

  const handlePress = (num: string) => {
    if (step === 'create') {
      if (pin.length < 4) {
        const newPin = pin + num;
        setPin(newPin);
        if (newPin.length === 4) {
          setTimeout(() => setStep('confirm'), 300);
        }
      }
    } else {
      if (confirmPin.length < 4) {
        const newConfirm = confirmPin + num;
        setConfirmPin(newConfirm);
        if (newConfirm.length === 4) {
          setTimeout(() => handleConfirm(newConfirm), 300);
        }
      }
    }
  };

  const handleDelete = () => {
    if (step === 'create') {
      setPin(p => p.slice(0, -1));
    } else {
      setConfirmPin(p => p.slice(0, -1));
    }
  };

  const handleConfirm = async (enteredConfirm: string) => {
    if (pin === enteredConfirm) {
      await AsyncStorage.setItem('userPin', pin);
      await AsyncStorage.setItem('pinCreated', 'true');
      router.replace('/(tabs)');
    } else {
      Alert.alert('PIN Mismatch', 'PINs do not match. Please try again.');
      setPin('');
      setConfirmPin('');
      setStep('create');
    }
  };

  const currentPin = step === 'create' ? pin : confirmPin;

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
        <Text style={styles.title}>
          {step === 'create' ? 'Create Your PIN' : 'Confirm Your PIN'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'create'
            ? 'Set a 4-digit PIN for quick access'
            : 'Enter the same PIN again to confirm'}
        </Text>

        {/* PIN Dots */}
        <View style={styles.dotsRow}>
          {[0,1,2,3].map(i => (
            <View
              key={i}
              style={[styles.dot, currentPin.length > i && styles.dotFilled]}
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

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Theme.background.primary },
  container:   { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  logo:        { width: 170, height: 50, marginBottom: 32 },
  title:       { fontSize: 24, fontWeight: '900', color: Theme.text.primary, marginBottom: 8, textAlign: 'center' },
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
});