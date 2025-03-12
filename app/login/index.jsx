import React, { useEffect, useState } from "react";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check login state on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails");
        if (userDetails) {
          router.replace("/(tabs)");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Handle login API request
  const validateCredentials = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("https://upcheck-server.onrender.com/api/v2/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userDetails", JSON.stringify(result));
        router.replace("/(tabs)");
      } else {
        const errorMessage =
          result.message || "Login failed. Please check your credentials.";
        alert(errorMessage);
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#43C0C5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image
            source={require("../../assets/images/upcheck-logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome to Upcheck!</Text>
          <Text style={styles.welcomeText}>Login to your account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <EntypoIcon name="eye" size={20} style={styles.eyeIcon} />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={validateCredentials}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/forgot-password")}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.forgotPassword}>Bypass login (Demo)</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/signup")}>
            <Text style={styles.footerText}>
              Don't have an account? <Text style={styles.link}>Sign up here!</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#43C0C5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#43C0C5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#43C0C5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#43C0C5",
    fontWeight: "bold",
    marginTop: 10,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#666",
  },
  link: {
    color: "#43C0C5",
    fontWeight: "bold",
  },
});

export default Login;
