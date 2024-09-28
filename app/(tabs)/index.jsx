// app/(tabs)/index.jsx
import React, { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import HomeScreen from '../home';
import TestPage from '../TestScreen';
import ProfileScreen from './profile';

const Index = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Prevent the default back button behavior
    };

    // Add event listener for the hardware back press
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the event listener on unmount
    return () => backHandler.remove();
  }, []);

  return (
    <HomeScreen />
  );
};

export default Index;