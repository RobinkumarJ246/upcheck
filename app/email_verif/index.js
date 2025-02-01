import React, { useEffect, useState } from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

function EmailVerification() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const router = useRouter();

  // Fetch email from AsyncStorage
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetailsString = await AsyncStorage.getItem('userDetails');
        if (userDetailsString) {
          const userDetails = JSON.parse(userDetailsString);
          setEmail(userDetails.email); // Set the user email from AsyncStorage
        }
      } catch (error) {
        console.error('Failed to fetch user details from AsyncStorage:', error);
      }
    };

    fetchUserDetails(); // Fetch the user email when the component mounts
  }, []);

  // Handle back button action on Android
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
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // Handle the verification code submission
  const handleVerification = async () => {
    if (!verificationCode || !email) {
      alert('Please enter both email and verification code');
      return;
    }
  
    setIsSubmitting(true);
    setLoading(true); // Start loading state
    try {
      const userDetailsString = await AsyncStorage.getItem('userDetails');
      const userDetails = JSON.parse(userDetailsString);
      const userId = userDetails.userId;
  
      console.log('Sending verification request with:', {
        email,
        verificationCode,
        userId,
      });
  
      const response = await fetch('https://upcheck-server.onrender.com/api/v1/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode,
          userId,
        }),
      });
  
      const data = await response.json();
      console.log('API Response:', data);
  
      // Check if the response contains the expected success message
      if (data.message === "Email verified successfully") {
        alert(data.message); // Show success message
        router.replace('/profileform'); // Navigate on success
      } else {
        alert('Verification failed. Please check your code and try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Error during verification:', error);
    } finally {
      setIsSubmitting(false);
      setLoading(false); // End loading state
    }
  };
  
  // Handle resending the verification code
  const handleResendVerification = async () => {
    if (!isTimerActive) {
      console.log('Resending verification code...');
      setIsTimerActive(true);
      setTimeRemaining(30);
      try {
        // Simulate sending the verification code
        const response = await fetch('https://upcheck-server.onrender.com/api/v1/auth/resend-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (data.success) {
          alert('Verification code sent!');
        } else {
          alert('Failed to resend verification code.');
        }
      } catch (error) {
        alert('An error occurred while resending the code.');
        console.error('Error during resend:', error);
      }
    }
  };

  // Timer logic for resend code
  useEffect(() => {
    let timer;
    if (isTimerActive) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimerActive(false);
            return 30; // Reset time to 30 for the next attempt
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerActive]);

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
          <View style={styles.verificationContainer}>
            <Image
              source={require('../../assets/images/upcheck-logo.png')}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.title}>Email Verification</Text>
            <Text style={styles.description}>
              Please enter the verification code sent to your email
            </Text>
            <Text style={styles.email_text}>
              {email}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>Verification Code</Text>
              <TextInput
                placeholder="Enter your verification code"
                placeholderTextColor="#999"
                style={styles.input}
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerification}
              disabled={isSubmitting}
            >
              <Text style={styles.verifyButtonText}>
                {isSubmitting ? 'Verifying...' : 'Verify'}
                {!isSubmitting && <EntypoIcon name="chevron-right" style={styles.nextIcon} />}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResendVerification} disabled={isTimerActive}>
              <Text style={styles.resendText}>
                {isTimerActive
                  ? `Resend code in ${timeRemaining}s`
                  : "Didn't receive the code? Resend it."}
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
  verificationContainer: {
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'center',
    color: '#666',
  },
  email_text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#286',
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
  verifyButton: {
    backgroundColor: '#50e3c2',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendText: {
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

export default EmailVerification;
