import { Platform } from 'react-native';

export const Theme = {
  background: {
    primary: '#F5F7F6',      // Very light off-white/mint background
    secondary: '#FFFFFF',    // Pure white background for text inputs and modal sheets
    card: '#FFFFFF',         // White card background
    cardHover: '#EBF0ED',    // Subtle grey-green for hover or active highlights
  },
  green: {
    primary: '#135E2D',      // Deep forest green accent
    secondary: '#1E8547',    // Vibrant leaf green accent
    dark: '#0B3B1C',         // Dark forest green for active/pressed states
  },
  text: {
    primary: '#1C2E24',      // Deep charcoal green-black for high contrast readability
    secondary: '#4A5E53',    // Medium grey-green for sub-headings and descriptions
    muted: '#82968C',        // Muted slate-green for helper text and page indexes
  },
  border: '#E2E8E5',        // Subtle light border color
};

export const Colors = {
  light: {
    text: '#1C2E24',
    background: '#F5F7F6',
    tint: '#135E2D',
    icon: '#4A5E53',
    tabIconDefault: '#82968C',
    tabIconSelected: '#135E2D',
  },
  dark: {
    text: '#1C2E24',
    background: '#F5F7F6',
    tint: '#135E2D',
    icon: '#4A5E53',
    tabIconDefault: '#82968C',
    tabIconSelected: '#135E2D',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
