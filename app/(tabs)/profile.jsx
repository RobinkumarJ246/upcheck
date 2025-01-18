// components/ProfileScreen.js

import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Div, Badge } from 'react-native-magnus';
import MatIcons from '@expo/vector-icons/MaterialIcons';
import FA6 from '@expo/vector-icons/FontAwesome6';
import TopBar from '../../components/TopBar';
import { useRouter } from 'expo-router';
import { SafeAreaView, View, Text, StyleSheet, Image, Button, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';

const ProfileScreen = () => {
    const router = useRouter();
    const [Name, setName] = useState('Upcheck_User');
    const [Id, setId] = useState('UP_1234_DEFAULT');
    const [Bio, setBio] = useState('No bio set');
    const [Address, setAddress] = useState('No address set');
    const [Exp, setExp] = useState('0');
    const [NoPonds, setNoPonds] = useState('Cannot GET');
    const [Phone, setPhone] = useState('Not provided');
    const [Email, setEmail] = useState('example@upcheck.com');
    const [Cultivation, setCultivation] = useState('Shrimp');
    const [userName, setUserName] = useState('upcheck_user_1234');
    const [modalVisible, setModalVisible] = useState(false);
    const [profilePicture, setProfilePicture] = useState(require('@/assets/images/avatar_default.jpg')); // Default profile picture
    const [loading, setLoading] = useState(true); // Loading state

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
            setLoading(true); // Start loading
            try {
                const userDetailsString = await AsyncStorage.getItem('userDetails');
                const userId = await AsyncStorage.getItem('userId');
                console.log(userDetailsString);
                console.log(userId);
                setId(userId);
                if (userDetailsString) {
                    const userDetails = JSON.parse(userDetailsString);
                    setName(userDetails.displayName);
                    setUserName(userDetails.username);
                    setExp(userDetails.experience);
                    setNoPonds(userDetails.no_ponds);
                    setPhone(userDetails.phoneNumber);
                    setEmail(userDetails.email);
                    setBio(userDetails.bio);
                    setCultivation(userDetails.cultivation);
                    setAddress(userDetails.address);
                }
            } catch (error) {
                console.error('Failed to fetch user details from AsyncStorage:', error);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchUserDetails(); // Fetch the user name when the component mounts
    }, []);

    const user = {
        name: Name,
        username: userName,
        bio: Bio,
        cultivationType: Cultivation,
        farmerID: Id,
        address: Address,
        numberOfPonds: NoPonds,
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
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
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
                    {loading ? (
                        <View style={styles.skeletonText} />
                    ) : (
                        <>
                            <Text style={styles.userName}>{user.username}</Text>
                            <MatIcons style={styles.verifiedIcon} size={20} color="#03dac6" name='verified' />
                        </>
                    )}
                </Div>

                {/* Bio Section */}
                {loading ? (
                    <View style={styles.skeletonText} />
                ) : (
                    <Text style={styles.userBio}>{user.bio}</Text>
                )}

                {/* User Details */}
                <View style={styles.detailsContainer}>
                    {loading ? (
                        <View style={styles.skeletonDetails} />
                    ) : (
                        <>
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
                        </>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => router.push('/ponds')}>
                        <Div row alignItems="center" style={styles.buttonContent}>
                            <FA6 name='shrimp' color='white' style={styles.icon} />
                            <Text style={styles.buttonText}>View ponds</Text>
                        </Div>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.shareButton]}>
                        <Div row alignItems="center" style={styles.buttonContent}>
                            <FA6 name='share' color='white' style={styles.icon} />
                            <Text style={styles.buttonText}>Share profile</Text>
                        </Div>
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
                                    <Image source={item} style={styles.profileOptionImage} />
                                </TouchableOpacity>
                            )}
                            numColumns={3}
                            contentContainerStyle={styles.pictureOptionsContainer}
                        />
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    profilePictureContainer: {
        alignSelf: 'center',
        marginVertical: 16,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#03dac6',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    verifiedIcon: {
        marginLeft: 8,
    },
    userBio: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12,
    },
    detailsContainer: {
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    labelText: {
        fontWeight: 'bold',
    },
    valueText: {
        color: '#666',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        margin: 4,
        backgroundColor: '#03dac6',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    shareButton: {
        backgroundColor: '#6200ee',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    icon: {
        marginRight: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pictureOption: {
        margin: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    profileOptionImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    pictureOptionsContainer: {
        padding: 16,
    },
    skeletonText: {
        width: '80%',
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        alignSelf: 'center',
        marginVertical: 4,
    },
    skeletonDetails: {
        height: 200,
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        alignSelf: 'center',
    },
});

export default ProfileScreen;