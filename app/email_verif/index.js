import React, { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
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
  Alert,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

function EmailVerification() {
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const router = useRouter()

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetailsString = await AsyncStorage.getItem("userDetails")
        if (userDetailsString) {
          const userDetails = JSON.parse(userDetailsString)
          setEmail(userDetails.email)
        }
      } catch (error) {
        console.error("Failed to fetch user details from AsyncStorage:", error)
      }
    }

    fetchUserDetails()
  }, [])

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ])
      return true
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

    return () => backHandler.remove()
  }, [])

  const handleVerification = async () => {
    if (!verificationCode || !email) {
      Alert.alert("Error", "Please enter both email and verification code")
      return
    }

    setIsSubmitting(true)
    setLoading(true)
    try {
      const userDetailsString = await AsyncStorage.getItem("userDetails")
      const userDetails = JSON.parse(userDetailsString)
      const userId = userDetails.userId

      console.log("Sending verification request with:", {
        email,
        verificationCode,
        userId,
      })

      const response = await fetch("https://upcheck-server.onrender.com/api/v1/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          verificationCode,
          userId,
        }),
      })

      const data = await response.json()
      console.log("API Response:", data)

      if (data.message === "Email verified successfully") {
        router.replace("/profileform")
      } else {
        Alert.alert("Verification Failed", "Please check your code and try again.")
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.")
      console.error("Error during verification:", error)
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!isTimerActive) {
      console.log("Resending verification code...")
      setIsTimerActive(true)
      setTimeRemaining(30)
      try {
        const response = await fetch("https://upcheck-server.onrender.com/api/v1/auth/resend-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const data = await response.json()
        if (data.success) {
          Alert.alert("Success", "Verification code sent!")
        } else {
          Alert.alert("Error", "Failed to resend verification code.")
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while resending the code.")
        console.error("Error during resend:", error)
      }
    }
  }

  useEffect(() => {
    let timer
    if (isTimerActive) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsTimerActive(false)
            return 30
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isTimerActive])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#50e3c2" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#E1F5FE", "#B3E5FC", "#81D4FA"]} style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.verificationContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/upcheck-logo.png")}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>
            <Text style={styles.title}>Email Verification</Text>
            <Text style={styles.description}>Please enter the verification code sent to your email</Text>
            <Text style={styles.emailText}>{email}</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>Verification Code</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={24} color="#50e3c2" style={styles.inputIcon} />
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
            </View>

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerification} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.verifyButtonText}>
                  Verify
                  <Ionicons name="chevron-forward-outline" size={20} color="#fff" style={styles.nextIcon} />
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResendVerification} disabled={isTimerActive} style={styles.resendButton}>
              <Text style={[styles.resendText, isTimerActive && styles.resendTextDisabled]}>
                {isTimerActive ? `Resend code in ${timeRemaining}s` : "Didn't receive the code? Resend it."}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  )
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
    justifyContent: "center",
  },
  verificationContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 30,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    color: "#666",
  },
  emailText: {
    fontSize: 18,
    marginBottom: 25,
    textAlign: "center",
    color: "#50e3c2",
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  verifyButton: {
    backgroundColor: "#50e3c2",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  nextIcon: {
    marginLeft: 10,
  },
  resendButton: {
    marginTop: 20,
  },
  resendText: {
    color: "#1a20c3",
    fontSize: 16,
    fontWeight: "600",
  },
  resendTextDisabled: {
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
})

export default EmailVerification

