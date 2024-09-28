import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import Login from './login'; // Adjust the path accordingly

export default function Index() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate a delay (e.g., for app setup) before rendering the Login component
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 1000); // 1000ms delay for testing

    // Clear the timer when component unmounts
    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    // You can display a loading spinner until the app is ready
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Please wait while loading</Text>
      </View>
    );
  }

  // Render the Login component after the delay
  return <Login />;
}