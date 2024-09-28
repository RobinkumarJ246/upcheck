// components/ProfileScreen.js

import React from 'react';
import { Box, Div, Badge } from 'react-native-magnus';
import MatIcons from '@expo/vector-icons/MaterialIcons';
import TopBar from '../../components/TopBar';
import { SafeAreaView, View, Text, StyleSheet, Image, Button, TouchableOpacity, ScrollView } from 'react-native';

const ProfileScreen = () => {
    const user = {
        name: 'MS Dhoni',
        bio: 'Passionate strawberry farmer with helicopter irrigation system.',
        cultivationType:'Strawberry',
        farmerID: 'MS07CSK',
        address: 'Ranchi, Jharkhand, India',
        numberOfPonds: 1,
        experience: '5 years',
        email: 'msdhoni@csk.com',
        phone: '+91 7777777',
    };

    return (
        <SafeAreaView style = {styles.safeArea}>
        <TopBar title={'Profile'} />
        <ScrollView style={styles.container}>
            {/* Banner Image}
            <View style={styles.banner}>
                <Image
                    source={require('@/assets/images/profile_banner.png')} // Replace with your banner image URL
                    style={styles.bannerImage}
                />
            </View>

            {/* Profile Picture */}
            <View style={styles.profilePictureContainer}>
                <Image
                    source={require('@/assets/images/Ms_dhoni.png')} // Replace with your profile image URL
                    style={styles.profilePicture}
                />
            </View>

            {/* User Name */}
            <Div row justifyContent='center' alignItems='center'>
            <Text style={styles.userName}>{user.name}</Text>
            <MatIcons style= {styles.verifiedIcon} size={20} color="#03dac6" name='verified'/>
            </Div>

            {/* Bio Section */}
            <Text style={styles.userBio}>{user.bio}</Text>

            {/* User Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Farmer Name: {user.name}</Text>
                <Text style={styles.detailText}>Farmer ID: {user.farmerID}</Text>
                <Text style={styles.detailText}>Cultivation: {user.cultivationType}</Text>
                <Text style={styles.detailText}>Address: {user.address}</Text>
                <Text style={styles.detailText}>Number of Ponds: {user.numberOfPonds}</Text>
                <Text style={styles.detailText}>Experience: {user.experience}</Text>
                <Text style={styles.detailText}>Email: {user.email}</Text>
                <Text style={styles.detailText}>Phone: {user.phone}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>View Ponds</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.shareButton]}>
                    <Text style={styles.buttonText}>Share Profile</Text>
                </TouchableOpacity>
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
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 15,
    },
    banner: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 50
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    userBio: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 15,
    },
    detailsContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        elevation: 2,
        marginBottom: 20,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        backgroundColor: '#6200ee',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    shareButton: {
        backgroundColor: '#03dac6',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    verifiedIcon:{
      marginLeft: 5,
    }
});

export default ProfileScreen;