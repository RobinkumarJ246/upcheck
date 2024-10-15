// components/ProfileScreen.js

import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Div, Badge } from 'react-native-magnus';
import MatIcons from '@expo/vector-icons/MaterialIcons';
import TopBar from '../../components/TopBar';
import { SafeAreaView, View, Text, StyleSheet, Image, Button, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';

const ProfileScreen = () => {
    const [Name, setName] = useState('Upcheck_User');
    const [Bio, setBio] = useState('No bio set');
    const [Address, setAddress] = useState('No address set');
    const [Exp, setExp] = useState('0');
    const [Phone, setPhone] = useState('Not provided');
    const [Email, setEmail] = useState('example@upcheck.com');
    const [Cultivation, setCultivation] = useState('Shrimp');
    const [userName, setUserName] = useState('upcheck_user_1234');
    const [modalVisible, setModalVisible] = useState(false);
    const [profilePicture, setProfilePicture] = useState(require('@/assets/images/avatar_default.jpg')); // Default profile picture

    const profilePictures = [
        require('@/assets/images/uifaces-human-image6.jpg'),
        require('@/assets/images/uifaces-human-image5.jpg'),
        require('@/assets/images/uifaces-human-image4.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-human-image3.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-human-image2.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-human-image.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-alien-image.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-alien-image2.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-cartoon-image2.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-cartoon-image.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-abstract-image2.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-abstract-image.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-robot-image.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-popular-image.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-popular-image2.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-popular-image3.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-popular-image4.jpg'), // Add your profile image paths here
        require('@/assets/images/uifaces-popular-image5.jpg'), // Add your profile image paths here
        // Add more images as needed
    ];

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetailsString = await AsyncStorage.getItem('userDetails');
                if (userDetailsString) {
                    const userDetails = JSON.parse(userDetailsString);
                    setName(userDetails.displayName);
                    setUserName(userDetails.username);
                    setExp(userDetails.experience);
                    setPhone(userDetails.phoneNumber);
                    setEmail(userDetails.email);
                    setBio(userDetails.bio);
                    setCultivation(userDetails.cultivation);
                    setAddress(userDetails.address);
                }
            } catch (error) {
                console.error('Failed to fetch user details from AsyncStorage:', error);
            }
        };

        fetchUserDetails(); // Fetch the user name when the component mounts
    }, []);

    const user = {
        name: Name,
        username: userName,
        bio: Bio,
        cultivationType: Cultivation,
        farmerID: 'MS07CSK',
        address: Address,
        numberOfPonds: 1,
        experience: Exp,
        email: Email,
        phone: Phone,
    };

    const handleProfilePictureSelect = (picture) => {
        setProfilePicture(picture);
        setModalVisible(false); // Close modal after selection
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TopBar title={'Profile'} />
            <ScrollView style={styles.container}>
                {/* Banner Image */}
                {/* Uncomment and modify if you want to use a banner image */}
                {/* <View style={styles.banner}>
                    <Image
                        source={require('@/assets/images/profile_banner.png')}
                        style={styles.bannerImage}
                    />
                </View> */}

                {/* Profile Picture */}
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profilePictureContainer}>
                    <Image
                        source={profilePicture}
                        style={styles.profilePicture}
                    />
                </TouchableOpacity>

                {/* User Name */}
                <Div row justifyContent='center' alignItems='center'>
                    <Text style={styles.userName}>{user.username}</Text>
                    <MatIcons style={styles.verifiedIcon} size={20} color="#03dac6" name='verified' />
                </Div>

                {/* Bio Section */}
                <Text style={styles.userBio}>{user.bio}</Text>

                {/* User Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.row}>
                        <Text style={styles.labelText}>Farmer Name:</Text>
                        <Text style={styles.valueText}>{user.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.labelText}>Farmer ID:</Text>
                        <Text style={styles.valueText}>{user.farmerID}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.labelText}>Cultivation:</Text>
                        <Text style={styles.valueText}>{user.cultivationType}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.labelText}>Address:</Text>
                        <Text style={styles.valueText}>{user.address}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.labelText}>Number of Ponds:</Text>
                        <Text style={styles.valueText}>{user.numberOfPonds}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.labelText}>Experience:</Text>
                        <Text style={styles.valueText}>{user.experience}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.labelText}>Email:</Text>
                        <Text style={styles.valueText}>{user.email}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.labelText}>Phone:</Text>
                        <Text style={styles.valueText}>{user.phone}</Text>
                    </View>
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

                {/* Profile Picture Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={profilePictures}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleProfilePictureSelect(item)} style={styles.pictureOption}>
                                    <Image source={item} style={styles.modalImage} />
                                </TouchableOpacity>
                            )}
                            numColumns={3} // Adjust number of columns as needed
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
                            <Text style={styles.closeModalText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
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
        marginTop: 50,
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
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2, // Add shadow for Android
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 1 }, // Shadow offset for iOS
        shadowOpacity: 0.2, // Shadow opacity for iOS
        shadowRadius: 1, // Shadow radius for iOS
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    labelText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    valueText: {
        fontSize: 16,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        backgroundColor: '#03dac6',
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    shareButton: {
        backgroundColor: '#6200ee',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    pictureOption: {
        flex: 1,
        alignItems: 'center',
        margin: 5,
    },
    modalImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    closeModalButton: {
        padding: 10,
        backgroundColor: '#6200ee',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    closeModalText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    verifiedIcon: {
        marginLeft: 5,
    },
});

export default ProfileScreen;