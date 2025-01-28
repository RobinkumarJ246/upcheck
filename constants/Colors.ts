/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0A7EA4'; // Primary light theme accent
const tintColorDark = '#4FD1C5'; // Primary dark theme accent

export const Colors = {
  light: {
    text: '#11181C', // Main text color
    background: '#FFFFFF', // Page background
    cardBackground: '#F5F5F5', // Background for cards or containers
    tint: tintColorLight, // Accent color
    icon: '#687076', // Default icon color
    border: '#E2E8F0', // Border color for elements
    tabIconDefault: '#A0AEC0', // Inactive tab icon
    tabIconSelected: tintColorLight, // Active tab icon
    buttonBackground: '#0A7EA4', // Button background
    buttonText: '#FFFFFF', // Button text
    danger: '#E53E3E', // Error or destructive actions
    success: '#38A169', // Success or confirmation
    info: '#3182CE', // Informational elements
  },
  dark: {
    text: '#ECEDEE', // Main text color
    background: '#1A202C', // Page background
    cardBackground: '#2D3748', // Background for cards or containers
    tint: tintColorDark, // Accent color
    icon: '#9BA1A6', // Default icon color
    border: '#4A5568', // Border color for elements
    tabIconDefault: '#A0AEC0', // Inactive tab icon
    tabIconSelected: tintColorDark, // Active tab icon
    buttonBackground: '#4FD1C5', // Button background
    buttonText: '#1A202C', // Button text
    danger: '#F56565', // Error or destructive actions
    success: '#48BB78', // Success or confirmation
    info: '#63B3ED', // Informational elements
  },
};
