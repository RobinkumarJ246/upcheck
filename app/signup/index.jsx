import React, { useState, useEffect } from "react"
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
  ActivityIndicator,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { BackHandler } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import CryptoJS from "crypto-js"

const { width, height } = Dimensions.get("window")

function SignUp() {
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ])
      return true
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

    return () => backHandler.remove()
  }, [])

  const handleSignUp = async () => {
    setIsSubmitting(true)
    if (!displayName || !username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.")
      setIsSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.")
      setIsSubmitting(false)
      return
    }

    try {
      const token = CryptoJS.SHA256(displayName + username + email + password).toString()

      const response = await fetch("https://upcheck-server.onrender.com/api/v2/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          username,
          email,
          password,
          token,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const existingDetails = await AsyncStorage.getItem("userDetails")
        const userId = data.userId
        await AsyncStorage.setItem("userId", userId)
        const userDetails = existingDetails ? JSON.parse(existingDetails) : {}

        userDetails.displayName = displayName
        userDetails.username = username
        userDetails.email = email
        userDetails.token = token
        userDetails.userId = data.userId

        await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails))

        await sendVerificationCode(email, displayName)

        router.replace("/email_verif")
      } else {
        Alert.alert("Error", data.message || "Registration failed.")
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const sendVerificationCode = async (email, displayName) => {
    try {
      const response = await fetch("https://upcheck-server.onrender.com/api/v1/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          userName: displayName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to send verification code.")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send verification code. Please try again later.")
    }
  }

  const sendWelcomeEmail = async (email, displayName) => {
    try {
      const response = await fetch("https://upcheck-server.onrender.com/api/v1/mailing/welcome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          userName: displayName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to send welcome email.")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send welcome email. Please try again later.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#E1F5FE", "#B3E5FC", "#81D4FA"]} style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.signUpContainer}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/images/upcheck-logo.png")}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </View>
              <Text style={styles.upcheck}>UPCHECK</Text>
              <Text style={styles.subText}>Sign up once and start using Upcheck now!</Text>

              <View style={styles.inputContainer}>
                <FormInput
                  placeholder="Display name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  icon="person-outline"
                />
                <FormInput placeholder="Username" value={username} onChangeText={setUsername} icon="at-outline" />
                <FormInput
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  icon="mail-outline"
                  keyboardType="email-address"
                />
                <FormInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  icon="lock-closed-outline"
                  secureTextEntry={!showPassword}
                  showPasswordToggle
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
                <FormInput
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  icon="lock-closed-outline"
                  secureTextEntry={!showConfirmPassword}
                  showPasswordToggle
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                />
              </View>

              <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signUpButtonText}>
                    Sign up
                    <Ionicons name="chevron-forward-outline" size={20} color="#fff" style={styles.nextIcon} />
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/login")} style={styles.loginTextContainer}>
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginTextBold}>Login</Text>
                </Text>
              </TouchableOpacity>

              {verificationSent && (
                <Text style={styles.verificationText}>
                  A verification email has been sent. Please check your inbox.
                </Text>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  )
}

const FormInput = ({
  placeholder,
  value,
  onChangeText,
  icon,
  keyboardType,
  secureTextEntry,
  showPasswordToggle,
  showPassword,
  setShowPassword,
}) => (
  <View style={styles.inputWrapper}>
    <Ionicons name={icon} size={24} color="#007AFF" style={styles.inputIcon} />
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#999"
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
    {showPasswordToggle && (
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#007AFF" />
      </TouchableOpacity>
    )}
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  signUpContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  logoContainer: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  logo: {
    width: "80%",
    height: "80%",
  },
  upcheck: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  subText: {
    fontSize: 16,
    marginBottom: 30,
    color: "#666",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F7",
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 10,
  },
  signUpButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  nextIcon: {
    marginLeft: 8,
  },
  loginTextContainer: {
    marginTop: 20,
  },
  loginText: {
    color: "#666",
    fontSize: 16,
  },
  loginTextBold: {
    color: "#007AFF",
    fontWeight: "600",
  },
  verificationText: {
    fontSize: 14,
    marginTop: 20,
    color: "#ff5733",
  },
})

export default SignUp

