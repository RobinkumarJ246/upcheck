import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const PondDetailsForm = () => {
  const [pondName, setPondName] = useState('');
  const [pondDepth, setPondDepth] = useState('');
  const [pondArea, setPondArea] = useState('');
  const [pondType, setPondType] = useState('Select Cultivation Type');
  const [pondLocation, setPondLocation] = useState('');
  const [stockingDensity, setStockingDensity] = useState('');
  const [cultureStartDate, setCultureStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const cultivationOptions = ['Shrimp', 'Fish', 'Crabs', 'Lobster', 'Kelp'];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to access your GPS location.');
      }
    })();
  }, []);

  const handleCultivationSelect = (option) => {
    setPondType(option);
    setModalVisible(false);
  };

  const validateInputs = () => {
    if (pondName.trim() === '') {
      Alert.alert('Validation Error', 'Please enter the pond name.');
      return false;
    }
    if (pondDepth.trim() === '' || isNaN(pondDepth) || Number(pondDepth) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid pond depth.');
      return false;
    }
    if (pondArea.trim() === '' || isNaN(pondArea) || Number(pondArea) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid pond area.');
      return false;
    }
    if (stockingDensity.trim() === '' || isNaN(stockingDensity) || Number(stockingDensity) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid stocking density.');
      return false;
    }
    if (!cultureStartDate) {
      Alert.alert('Validation Error', 'Please select a culture start date.');
      return false;
    }
    if (pondType === 'Select Cultivation Type') {
      Alert.alert('Validation Error', 'Please select a cultivation type.');
      return false;
    }
    if (pondLocation.trim() === '') {
      Alert.alert('Validation Error', 'Please enter the pond location.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      const userDetailsString = await AsyncStorage.getItem('userDetails');
      const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
  
      if (!userDetails) {
        Alert.alert('Error', 'User details not found. Please log in again.');
        return;
      }
  
      try {
        const userResponse = await fetch(`https://upcheck-server.onrender.com/api/users/email/${userDetails.email}`, {
          method: 'GET',
        });
  
        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          throw new Error(`Failed to fetch user details: ${errorText}`);
        }
  
        const userData = await userResponse.json();
        const userId = userData._id;
  
        const pondDetails = {
          name: pondName,
          depth: pondDepth,
          area: pondArea,
          stockingDensity,
          cultureStartDate: cultureStartDate.toISOString().split('T')[0],
          type: pondType,
          location: pondLocation,
          owner_email: userDetails.email,
          userId: userId,
        };
  
        const pondResponse = await fetch('https://upcheck-server.onrender.com/api/ponds', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pondDetails),
        });
  
        if (!pondResponse.ok) {
          const errorText = await pondResponse.text();
          throw new Error(`Failed to add pond details: ${errorText}`);
        }
  
        const pondData = await pondResponse.json();
  
        const { _id, ...restOfUserData } = userData;
  
        const updatedUserDetails = {
          ...restOfUserData,
          no_ponds: restOfUserData.no_ponds ? restOfUserData.no_ponds + 1 : 1,
          pondIds: restOfUserData.pondIds ? [...restOfUserData.pondIds, pondData._id] : [pondData._id],
        };
  
        const updateUserResponse = await fetch(`https://upcheck-server.onrender.com/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUserDetails),
        });
  
        if (!updateUserResponse.ok) {
          const errorText = await updateUserResponse.text();
          throw new Error(`Failed to update user details: ${errorText}`);
        }
  
        await AsyncStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
  
        const storedPondsString = await AsyncStorage.getItem('ponds');
        const storedPonds = storedPondsString ? JSON.parse(storedPondsString) : {};
        const newPondId = pondData._id;
  
        storedPonds[newPondId] = pondDetails;
        await AsyncStorage.setItem('ponds', JSON.stringify(storedPonds));
        router.replace('/(tabs)');
  
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  }; 

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to access your GPS location.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (place && place.city) {
      setPondLocation(place.city);
    } else {
      setPondLocation('Location not found');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || cultureStartDate;
    setShowDatePicker(false);
    setCultureStartDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Let's add your first pond!</Text>
          <Text style={styles.subtitle}>
            Please provide details about your pond. Adding at least one pond is required.
          </Text>

          <FormInput
            label="Pond Name"
            value={pondName}
            onChangeText={setPondName}
            placeholder="e.g., Main Shrimp Pond"
            icon="water-outline"
          />

          <FormInput
            label="Pond Depth (in meters)"
            value={pondDepth}
            onChangeText={setPondDepth}
            placeholder="e.g., 2.5"
            keyboardType="numeric"
            icon="resize-outline"
          />

          <FormInput
            label="Pond Area (in square meters)"
            value={pondArea}
            onChangeText={setPondArea}
            placeholder="e.g., 500"
            keyboardType="numeric"
            icon="square-outline"
          />

          <FormInput
            label="Stocking Density (per square meter)"
            value={stockingDensity}
            onChangeText={setStockingDensity}
            placeholder="e.g., 10"
            keyboardType="numeric"
            icon="fish-outline"
          />

          <FormInput
            label="Culture Start Date"
            value={cultureStartDate.toISOString().split('T')[0]}
            onPress={() => setShowDatePicker(true)}
            icon="calendar-outline"
          />

          <FormInput
            label="Pond Cultivation Type"
            value={pondType}
            onPress={() => setModalVisible(true)}
            icon="leaf-outline"
          />

          <View style={styles.locationContainer}>
            <FormInput
              label="Pond Location"
              value={pondLocation}
              onChangeText={setPondLocation}
              placeholder="e.g., Chennai"
              icon="location-outline"
              containerStyle={styles.locationInput}
            />
            <TouchableOpacity style={styles.getLocationButton} onPress={getCurrentLocation}>
              <Ionicons name="locate-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="add-circle-outline" size={24} color="white" style={styles.submitButtonIcon} />
            <Text style={styles.submitButtonText}>Add Pond</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {showDatePicker && (
        <DateTimePicker
          value={cultureStartDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Cultivation Type</Text>
            {cultivationOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalOption}
                onPress={() => handleCultivationSelect(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
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

const FormInput = ({ label, value, onChangeText, placeholder, keyboardType, icon, onPress, containerStyle }) => (
  <View style={[styles.inputContainer, containerStyle]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Ionicons name={icon} size={24} color="#4A90E2" style={styles.inputIcon} />
      {onPress ? (
        <TouchableOpacity style={styles.input} onPress={onPress}>
          <Text style={styles.inputText}>{value}</Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    paddingRight: 10,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    marginRight: 10,
  },
  getLocationButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  submitButtonIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PondDetailsForm;
