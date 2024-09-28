import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Image, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get('window');

function SignUp(props) {
  const router = useRouter();
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

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Display name"
                placeholderTextColor="#999"
                style={styles.input}
              />
              <TextInput
                placeholder="Username"
                placeholderTextColor="#999"
                style={styles.input}
              />
              <TextInput
                placeholder="Email address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                style={styles.input}
              />
            </View>

            <TouchableOpacity style={styles.signUpButton}>
              <Text style={styles.signUpButtonText}>
                Sign up <EntypoIcon name="chevron-right" style={styles.nextIcon} />
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => router.push('/login')}>
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