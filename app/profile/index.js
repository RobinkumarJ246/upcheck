import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Div, Badge } from 'react-native-magnus';
import MatIcons from '@expo/vector-icons/MaterialIcons';
import FA6 from '@expo/vector-icons/FontAwesome6';
import TopBar from '../../components/TopBar';
import { useRouter } from 'expo-router';
import { SafeAreaView, View, Text, StyleSheet, Image, Button, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

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
                setLoading(false); // Update loading state after fetching
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
            <ScrollView style={styles.container}>
                {loading ? ( // Show skeletal loading while fetching data
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item alignItems="center">
                            <SkeletonPlaceholder.Item width={100} height={100} borderRadius={50} />
                            <SkeletonPlaceholder.Item marginTop={20} width={120} height={20} borderRadius={4} />
                            <SkeletonPlaceholder.Item marginTop={6} width={150} height={10} borderRadius={4} />
                            <SkeletonPlaceholder.Item marginTop={20} width="90%" height={10} borderRadius={4} />
                            <SkeletonPlaceholder.Item marginTop={10} width="90%" height={10} borderRadius={4} />
                            <SkeletonPlaceholder.Item marginTop={10} width="90%" height={10} borderRadius={4} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                ) : (
                    <>
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
                            <TouchableOpacity style={styles.button} onPress={() => router.push('/ponds')}>
                                <Div row alignItems="center" style={styles.buttonContent}>
                                    <FA6 name='shrimp' color='white' style={styles.icon} />
                                    <Text style={styles.buttonText}>View ponds</Text>
                                </Div>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.shareButton]}>
                                <Div row alignItems="center" style={styles.buttonContent}>
                                    <MatIcons name='share' size={20} color='white' />
                                    <Text style={styles.buttonText}>Share</Text>
                                </Div>
                            </TouchableOpacity>
                        </View>

                        {/* Modal for Profile Picture Selection */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <FlatList
                                    data={profilePictures}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => handleProfilePictureSelect(item)}>
                                            <Image source={item} style={styles.modalImage} />
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={3}
                                />
                                <Button title="Close" onPress={() => setModalVisible(false)} />
                            </View>
                        </Modal>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    container: {
        padding: 20,
    },
    profilePictureContainer: {
        alignItems: 'center',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#03dac6',
        marginBottom: 10,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    verifiedIcon: {
        marginLeft: 5,
    },
    userBio: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
    },
    detailsContainer: {
        marginVertical: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    labelText: {
        fontWeight: 'bold',
        color: '#333',
    },
    valueText: {
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#03dac6',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    shareButton: {
        backgroundColor: '#007BFF',
    },
    buttonContent: {
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalImage: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 10,
    },
});

export default ProfileScreen;