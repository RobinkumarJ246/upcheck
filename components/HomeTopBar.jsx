// components/HomeTopBar.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import IconFA6 from 'react-native-vector-icons/FontAwesome6';
import { Link, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';


const HomeTopBar = ({ title, onButtonPress }) => {
    const router = useRouter();

    const navigateToTest = () => {
        if (onButtonPress) {
            onButtonPress();
        }
        router.push('/pondform');
    };

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <TouchableOpacity style={styles.button} onPress={navigateToTest}>
                <View style={styles.buttonContent}>
                    <IconFA6 name='location-dot' style={styles.icon} />
                    <ThemedText style={styles.buttonText}>PondOne</ThemedText>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        marginTop: 28, // Adjust if needed, 0 to avoid margin issues
        paddingTop: 0, // Ensure no additional padding is affecting visibility
    },
    title: {
        fontSize: 20,
        color: '#000000', // Black color for visibility
    },
    button: {
        backgroundColor: '#03dac6', // Teal color
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000', // Black color
        fontWeight: 'bold',
    },
    icon: {
        marginRight: 8,
    },
});

export default HomeTopBar;