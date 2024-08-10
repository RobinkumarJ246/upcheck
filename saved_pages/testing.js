import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Div } from "react-native-magnus";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
  const loginWithFacebook = () => {
    // Define your login logic here
    console.log('Login with Facebook');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Centered Text!!!</Text>
      <Div row>
        <Button
          mt="lg"
          px="xl"
          py="lg"
          bg="white"
          borderWidth={1}
          borderColor="red500"
          color="red500"
          underlayColor="red100"
        >
          Test
        </Button>
      </Div>
      <View style={styles.buttonWrapper}>
        <Icon.Button
          name="facebook"
          backgroundColor="#3b5998"
          onPress={loginWithFacebook}
        >
          Login with Facebook
        </Icon.Button>
      </View>
      <View style={styles.buttonWrapper}>
        <Icon.Button
          name="google"
          backgroundColor='green'
          onPress={loginWithFacebook}
        >
          Login with Google
        </Icon.Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginTop: 20,  // Adjust the margin value as needed
  },
});