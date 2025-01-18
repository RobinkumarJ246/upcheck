import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../../components/TopBar';
import { useRouter } from 'expo-router';

const ProfileForm = () => {
  const [cultivation, setCultivation] = useState('Example: Shrimp');
  const [experience, setExperience] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState(''); // New state for bio
  const [modalVisible, setModalVisible] = useState(false);

  const cultivationOptions = ['Fish', 'Shrimp', 'Crabs', 'Lobster', 'Kelp'];
  const router = useRouter();

  const handleCultivationSelect = (option) => {
    setCultivation(option);
    setModalVisible(false);
  };

  const validateInputs = () => {
    if (cultivation === 'Example: Shrimp') {
      Alert.alert('Validation Error', 'Please select your major cultivation.');
      return false;
    }
    if (address.trim() === '') {
      Alert.alert('Validation Error', 'Please enter your residential address.');
      return false;
    }
    if (experience.trim() === '' || isNaN(experience) || Number(experience) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid number for experience.');
      return false;
    }
    if (bio.length < 30 || bio.length > 80) {
      Alert.alert('Validation Error', 'Your bio must be between 30 and 80 characters.');
      return false;
    }
    return true;
  };

  const saveUserDetails = async () => {
    try {
      const userDetailsString = await AsyncStorage.getItem('userDetails'); // Retrieve user details
      const userDetails = JSON.parse(userDetailsString);
      const email = userDetails?.email; // Extract email

      // Check if email is available
      if (!email) {
        Alert.alert('Error', 'User email not found in AsyncStorage.');
        return;
      }

      const response = await fetch('https://upcheck-server.onrender.com/api/v2/auth/updateProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,  // Identify the user based on their email
          cultivation,
          experience: Number(experience), // Ensure experience is a number
          address,
          phoneNumber,
          bio,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message);
        router.replace('/pondform');  // Redirect to another page after success
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.log("Error submitting profile form:", error);
      Alert.alert('Error', 'Failed to save profile information.');
    }
  };  

  const handleSubmit = () => {
    if (validateInputs()) {
      saveUserDetails();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Profile Information</Text>
        <Text style={styles.subtitle}>We need a bit more details about you to set the profile up!</Text>
        
        {/* Cultivation Title and Selection */}
        <Text style={styles.inputLabel}>What is your Major Cultivation?</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.placeholderText}>{cultivation}</Text>
        </TouchableOpacity>

        {/* Address Title and Input */}
        <Text style={styles.inputLabel}>What is your Residential address?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 123 Main St, City"
          value={address}
          onChangeText={setAddress}
        />

        {/* Experience Title and Input */}
        <Text style={styles.inputLabel}>What is your overall experience (in years)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 5"
          keyboardType="numeric"
          value={experience}
          onChangeText={setExperience}
        />

        {/* Short Bio Title and Input */}
        <Text style={styles.inputLabel}>Write a short bio (30-80 characters)</Text>
        <TextInput
          style={styles.input}
          placeholder="Tell us about yourself..."
          value={bio}
          onChangeText={setBio}
          maxLength={80} // Limit input length to 80 characters
        />

        {/* Optional Phone Number Title and Input */}
        <Text style={styles.inputLabel}>What is your Phone Number (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 9876543210"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Cultivation Options */}
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  optionButton: {
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProfileForm;