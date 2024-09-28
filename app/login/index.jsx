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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Simulated login state (for testing)
const isLoggedIn = false; // Change to true to simulate a logged-in state

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const validateCredentials = () => {
    // Hardcoded username and password for testing
    const validEmail = 'robert@gmail.com';
    const validPassword = '143341';

    if (email === validEmail && password === validPassword) {
      router.replace('/(tabs)');
    } else {
      alert('Invalid email or password'); // Show an alert for invalid credentials
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
              <Text style={styles.labelText}>Phone / E-mail address</Text>
              <TextInput
                placeholder="yourname@example.com"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail} // Update username state
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
                onChangeText={setPassword} // Update password state
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={validateCredentials} // Validate on button press
            >
              <Text style={styles.loginButtonText}>Login <EntypoIcon name="chevron-right" style={styles.nextIcon} /></Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/signup')}>
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