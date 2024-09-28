import MatIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import TopBar from '../../components/TopBar';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const boxSize = width / 2 - 30; // Two boxes in a row with some spacing

const SettingsScreen = () => {
    const router = useRouter();
    const options = [
        { title: 'Account', icon: 'account-circle', onPress: () => router.replace('login') },
        { title: 'Privacy', icon: 'lock', onPress: () => alert('Privacy Pressed!') },
        { title: 'Notification', icon: 'notifications', onPress: () => alert('Notification Pressed!') },
        { title: 'Language', icon: 'language', onPress: () => alert('Language Pressed!') },
        { title: 'About', icon: 'info', onPress: () => alert('About Pressed!') },
        { title: 'Help', icon: 'help', onPress: () => alert('About Pressed!') },
        { title: 'Invite user', icon: 'person-add-alt-1', onPress: () => alert('Update Pressed!') },
        { title: 'Update', icon: 'update', onPress: () => alert('Update Pressed!') },
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