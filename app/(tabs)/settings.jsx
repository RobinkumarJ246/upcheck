import MatIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import TopBar from '../../components/TopBar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');
const boxSize = width / 2 - 30; // Two boxes in a row with some spacing

const SettingsScreen = () => {
      
    const clearUserDetails = async () => {
        try {
          await AsyncStorage.removeItem('userDetails');
          console.log('User details cleared from Async Storage');
          // You can also navigate to the login page after clearing user details
        } catch (error) {
          console.error('Error clearing user details:', error);
        }
      };

      const clearPondDetails = async () => {
        try {
          await AsyncStorage.removeItem('ponds');
          console.log('Pond details cleared from Async Storage');
          // You can also navigate to the login page after clearing user details
          // Retrieve user details from AsyncStorage
          const userDetailsString = await AsyncStorage.getItem('userDetails');
          const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
      
          if (userDetails) {
            // Set pondsCount to 0
            userDetails.pondsCount = 0;
      
            // Save updated user details back to AsyncStorage
            await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
      
            console.log('Ponds count reset to 0');
          } else {
            console.log('User details not found');
          }
        } catch (error) {
          console.error('Error clearing user details:', error);
        }
      };

      const clearFarmDetails = async () => {
        try {
          await AsyncStorage.removeItem('farms');
          console.log('Farms details cleared from Async Storage');
          // You can also navigate to the login page after clearing user details
        } catch (error) {
          console.error('Error clearing user details:', error);
        }
      };

    const router = useRouter();
    const options = [
      { title: 'My profile', icon: 'account-circle', onPress: () => router.push('profile') },
      { title: 'My account', icon: 'manage-accounts', onPress: () => alert('Account Pressed!') },
      { title: 'Notification', icon: 'notifications', onPress: () => alert('Notification Pressed!') },
      { title: 'Language', icon: 'language', onPress: () => alert('Language Pressed!') },
      { title: 'Show verif', icon: 'lock', onPress: () => router.replace('email_verif') },
      { title: 'ClearFarmStorage', icon: 'help', onPress: () => clearFarmDetails() },
      { title: 'ClearPondStorage', icon: 'person-add-alt-1', onPress: () => clearPondDetails() },
      { title: 'ClearUserStorage', icon: 'update', onPress: () => clearUserDetails() },
      { title: 'Logout', icon: 'logout', onPress: async () => {
          await clearUserDetails(); // Clear user details
          router.replace('login'); // Navigate to login screen
      }},
  ];
  

    return (
        <SafeAreaView style={styles.safeArea}>
            <TopBar title={'Settings'} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.grid}>
                    {options.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.box} onPress={option.onPress}>
                            <MatIcons name={option.icon} size={40} color="#6200ee" />
                            <Text style={styles.boxText}>{option.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flexGrow: 1, // Ensures the scroll view takes full height
        padding: 15,
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    box: {
        width: boxSize,
        height: boxSize,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        elevation: 3, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    boxText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default SettingsScreen;