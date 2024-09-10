// components/Menu.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Menu = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.tileText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.tileText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.tileText}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    tile: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tileText: {
        fontSize: 18,
    },
});

export default Menu;