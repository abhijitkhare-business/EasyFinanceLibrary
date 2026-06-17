import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"       options={{ headerShown: false }} />
      <Stack.Screen name="login"       options={{ headerShown: false }} />
      <Stack.Screen name="create-pin"  options={{ headerShown: false }} />
      <Stack.Screen name="enter-pin"   options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)"      options={{ headerShown: false }} />
      <Stack.Screen name="book-detail" options={{ headerShown: false }} />
      <Stack.Screen name="reader"      options={{ headerShown: false }} />
    </Stack>
  );
}