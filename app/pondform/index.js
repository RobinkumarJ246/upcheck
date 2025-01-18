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
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../../components/TopBar';
import IconFA6 from 'react-native-vector-icons/FontAwesome6';
import MatIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

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
        // Fetch user document by email
        const userResponse = await fetch(`https://upcheck-server.onrender.com/api/users/email/${userDetails.email}`, {
          method: 'GET',
        });
  
        if (!userResponse.ok) {
          const errorText = await userResponse.text(); // Get the error message
          throw new Error(`Failed to fetch user details: ${errorText}`);
        }
  
        const userData = await userResponse.json(); // Get user details including _id
        const userId = userData._id; // Get the user's _id
  
        // Create pond details object
        const pondDetails = {
          name: pondName,
          depth: pondDepth,
          area: pondArea,
          stockingDensity,
          cultureStartDate: cultureStartDate.toISOString().split('T')[0],
          type: pondType,
          location: pondLocation,
          owner_email: userDetails.email, // Owner's email from user details
          userId: userId, // User ID from fetched user data
        };
        console.log('Pond Details:', pondDetails);
  
        // Send pond details to the ponds collection in the database
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
  
        const pondData = await pondResponse.json(); // Get the created pond document
  
        // Update user details in the users collection
        const { _id, ...restOfUserData } = userData; // Extract _id and get the rest
  
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
  
        // Store updated userDetails in AsyncStorage
        await AsyncStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
  
        // Step to update ponds in AsyncStorage
        const storedPondsString = await AsyncStorage.getItem('ponds');
        const storedPonds = storedPondsString ? JSON.parse(storedPondsString) : {};
        const newPondId = pondData._id;
  
        // Add the new pond to the ponds array in AsyncStorage
        storedPonds[newPondId] = pondDetails; // Assuming ponds are keyed by their IDs
        await AsyncStorage.setItem('ponds', JSON.stringify(storedPonds));
  
        // Show success message
        Alert.alert('Success', 'Pond details submitted successfully!');
        router.replace('/email_verif');
  
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  }; 

  // Function to get current location and reverse geocode it
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

  // Function to handle date change from DateTimePicker
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || cultureStartDate;
    setShowDatePicker(false);
    setCultureStartDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar title={'Upcheck'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Let's add your first pond!</Text>
        <Text style={styles.subtitle}>
          Please provide details about your pond. Adding at least one pond is required.
        </Text>

        <Text style={styles.inputLabel}>Pond Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Main Shrimp Pond"
          value={pondName}
          onChangeText={setPondName}
        />

        <Text style={styles.inputLabel}>Pond Depth (in meters)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2.5"
          keyboardType="numeric"
          value={pondDepth}
          onChangeText={setPondDepth}
        />

        <Text style={styles.inputLabel}>Pond Area (in square meters)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 500"
          keyboardType="numeric"
          value={pondArea}
          onChangeText={setPondArea}
        />

        <Text style={styles.inputLabel}>Stocking Density (per square meter)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 10"
          keyboardType="numeric"
          value={stockingDensity}
          onChangeText={setStockingDensity}
        />

        <Text style={styles.inputLabel}>Culture Start Date</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <MatIcons name='date-range' style={styles.calIcon} color="black" />
          <Text style={styles.placeholderText}>
            {cultureStartDate.toISOString().split('T')[0]}
          </Text>
        </TouchableOpacity>

        <Text style={styles.inputLabel}>Pond Cultivation Type</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <IconFA6 name='shrimp' style={styles.icon} color="black" />
          <Text style={styles.placeholderText}>{pondType}</Text>
        </TouchableOpacity>

        <Text style={styles.inputLabel}>Pond Location</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="e.g., Chennai"
            value={pondLocation}
            onChangeText={setPondLocation}
          />
          <TouchableOpacity style={styles.getLocationButton} onPress={getCurrentLocation}>
            <IconFA6 name='location-dot' style={styles.icon} color="white" />
            <Text style={styles.getLocationText}>My Location</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <IconFA6 name='plus' style={styles.icon} color="white" /><Text style={styles.AddPondButtonText}>Add pond</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={cultureStartDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
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
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    flexDirection: 'row',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center',
    flexDirection: 'row', // Use row direction for icon and text
    alignItems: 'center',
  },
  placeholderText: {
    color: 'gray',
    alignSelf: 'center',
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  getLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  getLocationText: {
    color: '#ffffff',
    marginLeft: 3,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  calIcon: {
    fontSize: 20,
    marginRight: 5,
    justifyContent: 'flex-start',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
  },
  AddPondButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
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
    borderRadius: 10,
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
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  dateInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'flex-start', // Align items to the start
    flexDirection: 'row', // Use row direction for icon and text
    alignItems: 'center', // Center align items vertically
  },
});

export default PondDetailsForm;