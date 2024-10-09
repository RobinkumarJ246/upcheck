import { React, useState, useEffect } from 'react';
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
        const response = await fetch('https://upcheck-server.onrender.com/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                displayName,
                username,
                email,
                password, // Password will be hashed on the server side
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // If the sign-up is successful, navigate to the login screen or other actions
            Alert.alert("Success", "Account created successfully!");
            router.push('/login');
        } else {
            // Handle common HTTP error codes and show alerts
            switch (response.status) {
                case 400:
                    Alert.alert("Error", data.message || "Invalid data provided.");
                    break;
                case 401:
                    Alert.alert("Error", "Unauthorized. Please try again.");
                    break;
                case 403:
                    Alert.alert("Error", "Forbidden. You don't have permission.");
                    break;
                case 409:
                    Alert.alert("Error", "Username or email already exists.");
                    break;
                case 500:
                    Alert.alert("Error", "Server error. Please try again later.");
                    break;
                default:
                    Alert.alert("Error", "An unknown error occurred.");
            }
        }
    } catch (error) {
        Alert.alert("Error", "Network error. Please check your connection.");
    } finally {
        setIsSubmitting(false); // End loading state
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
    marginLeft: 10,
  },
  loginText: {
    marginTop: 20,
    color: '#1a20c3',
    textDecorationLine: 'underline',
  },
});

export default SignUp;