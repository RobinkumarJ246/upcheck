import React, { useEffect, useState } from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  BackHandler, 
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Simulated login state (for testing)
const isLoggedIn = false; // Change to true to simulate a logged-in state

function Login() {

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
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check login state on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Function to handle API request for login
  const validateCredentials = async () => {
    setIsSubmitting(true);
  
    try {
      const response = await fetch('https://upcheck-server.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Login successful, navigate to the tabs page
        router.replace('/(tabs)');
      } else {
        // Handle various response codes
        switch (response.status) {
          case 400: // Bad Request
            alert('Invalid email or password. Please try again.');
            break;
          case 401: // Unauthorized
            alert('Invalid email or password. Please check your credentials.');
            break;
          case 403: // Forbidden
            alert('Access denied. Please contact support.');
            break;
          case 404: // Not Found
            alert('User not found. Please check your email.');
            break;
          case 500: // Internal Server Error
            alert('Server error. Please try again later.');
            break;
          default:
            alert(result.message || 'Login failed. Please check your credentials.');
            break;
        }
      }
    } catch (error) {
      // Catch any errors and display an alert
      alert('An error occurred. Please try again later.');
    } finally {
      // Set loading back to false once request completes
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#50e3c2" />
      </View>
    );
  }

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
          <View style={styles.loginContainer}>
            <Image
              source={require('../../assets/images/upcheck-logo.png')}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.welcomeText}>Welcome to Upcheck!</Text>
            <Text style={styles.loginText}>Login to your account</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>E-mail address</Text>
              <TextInput
                placeholder="yourname@example.com"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={validateCredentials}
              disabled={isSubmitting} // Disable the button while submitting
            >
              <Text style={styles.loginButtonText}>
                {isSubmitting ? 'Logging in...' : 'Login'}
                {!isSubmitting && <EntypoIcon name="chevron-right" style={styles.nextIcon} />}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace('/signup')}>
              <Text style={styles.signupText}>
                Don't have an account? Sign up here!
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
  nextIcon: {
    color: '#fff',
    fontSize: 17,
    marginLeft: 10,
  },
  loginContainer: {
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  loginText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  labelText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: '#50e3c2',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 20,
    color: '#1a20c3',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Login;