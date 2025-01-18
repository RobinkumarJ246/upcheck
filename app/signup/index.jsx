import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

const { width, height } = Dimensions.get('window');

function SignUp(props) {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const router = useRouter();

  const handleSignUp = async () => {
    setIsSubmitting(true); // Start loading state
    if (!displayName || !username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      setIsSubmitting(false); // End loading state
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      setIsSubmitting(false); // End loading state
      return;
    }
  
    try {
      const token = CryptoJS.SHA256(displayName + username + email + password).toString(); // Token generation (SHA-256 hash)
  
      const response = await fetch('https://upcheck-server.onrender.com/api/v2/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName,
          username,
          email,
          password, // Password will be hashed on the server side
          token, // Sending token to the server
        }),
      });
  
      const data = await response.json();
      console.log('Server Response:', data);
  
      if (response.ok) {
          // Retrieve existing user details from AsyncStorage
          const existingDetails = await AsyncStorage.getItem('userDetails');
          const userId = data.userId;
          await AsyncStorage.setItem('userId', userId);
          const userDetails = existingDetails ? JSON.parse(existingDetails) : {};
  
          // Update user details to include userId
          userDetails.displayName = displayName;
          userDetails.username = username;
          userDetails.email = email;
          userDetails.token = token;
          userDetails.userId = data.userId; // Store the userId from new endpoint
  
          // Save the updated user details back to AsyncStorage
          await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
  
          // Call the email verification endpoint
          await sendVerificationCode(email, displayName);
          await sendWelcomeEmail(email, displayName); // New function for verification code
  
          Alert.alert("Success", "Account created successfully!");
          router.replace('/profileform');
        }
      else {
        // Handle errors from the server
        Alert.alert("Error", data.message || "Registration failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false); // End loading state
    }
  };
  
  // New function to send verification code
  const sendVerificationCode = async (email, displayName) => {
    try {
      const response = await fetch('https://upcheck-server.onrender.com/api/v1/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userName: displayName, // Assuming you want to use displayName as userName
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to send verification code.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send verification code. Please try again later.");
    }
  };
  
  // New function to send the welcome email
  const sendWelcomeEmail = async (email, displayName) => {
    try {
      const response = await fetch('https://upcheck-server.onrender.com/api/v1/mailing/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userName: displayName, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to send welcome email.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send welcome email. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#a7e7e9', '#c7c5f7', '#e7cded']}
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.signUpContainer}>
            <Image
              source={require('../../assets/images/upcheck-logo.png')}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.upcheck}>UPCHECK</Text>
            <Text style={styles.subText}>
              Sign up once and start using Upcheck now!
            </Text>

            <ScrollView style={styles.inputScrollContainer} keyboardShouldPersistTaps="handled">
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Display name"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                />
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                />
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
                <TextInput
                  placeholder="Confirm password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}
            disabled={isSubmitting}>
              <Text style={styles.signUpButtonText}>
              {isSubmitting ? 'Signing in...' : 'Signin'}
                {!isSubmitting && <EntypoIcon name="chevron-right" style={styles.nextIcon} />}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginText}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  signUpContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 20,
  },
  upcheck: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  inputScrollContainer: {
    width: '100%',
    maxHeight: height * 0.35, 
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: '#50e3c2',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextIcon: {
    color: '#fff',
    fontSize: 17,
    marginLeft: 5,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default SignUp;