import React, { useState } from "react"
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const ProfileForm = () => {
  const [cultivation, setCultivation] = useState("Example: Shrimp")
  const [experience, setExperience] = useState("")
  const [address, setAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [bio, setBio] = useState("")
  const [modalVisible, setModalVisible] = useState(false)

  const cultivationOptions = ["Fish", "Shrimp", "Crabs", "Lobster", "Kelp"]
  const router = useRouter()

  const handleCultivationSelect = (option) => {
    setCultivation(option)
    setModalVisible(false)
  }

  const validateInputs = () => {
    if (cultivation === "Example: Shrimp") {
      Alert.alert("Validation Error", "Please select your major cultivation.")
      return false
    }
    if (address.trim() === "") {
      Alert.alert("Validation Error", "Please enter your residential address.")
      return false
    }
    if (experience.trim() === "" || isNaN(experience) || Number(experience) <= 0) {
      Alert.alert("Validation Error", "Please enter a valid number for experience.")
      return false
    }
    if (bio.length < 30 || bio.length > 80) {
      Alert.alert("Validation Error", "Your bio must be between 30 and 80 characters.")
      return false
    }
    return true
  }

  const saveUserDetails = async () => {
    try {
      const userDetailsString = await AsyncStorage.getItem("userDetails")
      const userDetails = JSON.parse(userDetailsString)
      const email = userDetails?.email

      if (!email) {
        Alert.alert("Error", "User email not found in AsyncStorage.")
        return
      }

      const response = await fetch("https://upcheck-server.onrender.com/api/v2/auth/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          cultivation,
          experience: Number(experience),
          address,
          phoneNumber,
          bio,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        router.replace("/pondform")
      } else {
        Alert.alert("Error", data.message)
      }
    } catch (error) {
      console.log("Error submitting profile form:", error)
      Alert.alert("Error", "Failed to save profile information.")
    }
  }

  const handleSubmit = () => {
    if (validateInputs()) {
      saveUserDetails()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.header}>Profile Information</Text>
          <Text style={styles.subtitle}>We need a bit more details about you to set the profile up!</Text>

          <FormInput
            label="What is your Major Cultivation?"
            value={cultivation}
            onPress={() => setModalVisible(true)}
            icon="water-outline"
          />

          <FormInput
            label="What is your Residential address?"
            value={address}
            onChangeText={setAddress}
            placeholder="e.g., 123 Main St, City"
            icon="home-outline"
          />

          <FormInput
            label="What is your overall experience (in years)"
            value={experience}
            onChangeText={setExperience}
            placeholder="e.g., 5"
            keyboardType="numeric"
            icon="briefcase-outline"
          />

          <FormInput
            label="Write a short bio (30-80 characters)"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            maxLength={80}
            multiline
            icon="person-outline"
          />

          <FormInput
            label="What is your Phone Number (optional)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="e.g., 9876543210"
            keyboardType="phone-pad"
            icon="call-outline"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {cultivationOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleCultivationSelect(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const FormInput = ({ label, value, onChangeText, placeholder, keyboardType, multiline, icon, onPress }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Ionicons name={icon} size={24} color="#4A90E2" style={styles.inputIcon} />
      {onPress ? (
        <TouchableOpacity style={styles.input} onPress={onPress}>
          <Text style={value === "Example: Shrimp" ? styles.placeholderText : styles.inputText}>{value}</Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      )}
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fa",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: "#1C1C1C",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#888",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
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
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  inputText: {
    color: "#333",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#4A90E2",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
})

export default ProfileForm

