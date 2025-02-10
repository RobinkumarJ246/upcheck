import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { List, Divider, Card, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
    const router = useRouter();

    const clearUserDetails = async () => {
        try {
            await AsyncStorage.removeItem('userDetails');
            console.log('User details cleared');
        } catch (error) {
            console.error('Error clearing user details:', error);
        }
    };

    const clearPondDetails = async () => {
        try {
            await AsyncStorage.removeItem('ponds');
            console.log('Pond details cleared');
            const userDetailsString = await AsyncStorage.getItem('userDetails');
            const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
            if (userDetails) {
                userDetails.pondsCount = 0;
                await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
            }
        } catch (error) {
            console.error('Error clearing pond details:', error);
        }
    };

    const clearFarmDetails = async () => {
        try {
            await AsyncStorage.removeItem('farms');
            console.log('Farm details cleared');
        } catch (error) {
            console.error('Error clearing farm details:', error);
        }
    };

    const options = [
      { title: 'My Profile', icon: 'account', onPress: () => router.push('profile') },
      { title: 'My Account', icon: 'account-cog', onPress: () => alert('Account Pressed!') },
      { title: 'Notifications', icon: 'bell', onPress: () => alert('Notification Pressed!') },
      { title: 'Language', icon: 'translate', onPress: () => alert('Language Pressed!') },
      { title: 'Clear Farm Storage', icon: 'database-remove', onPress: () => clearFarmDetails() },
      { title: 'Clear Pond Storage', icon: 'database-minus', onPress: () => clearPondDetails() },
      { title: 'Clear User Storage', icon: 'backup-restore', onPress: () => clearUserDetails() },
      {
          title: 'Logout',
          icon: 'logout-variant',
          onPress: async () => {
              await clearUserDetails();
              router.replace('login');
          },
      },
  ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card style={styles.profileCard}>
                    <Card.Title
                        title="User Settings"
                        subtitle="Manage your preferences"
                        left={(props) => <Avatar.Icon {...props} icon="cog" />}
                    />
                </Card>

                <View style={styles.listContainer}>
                    {options.map((option, index) => (
                        <React.Fragment key={index}>
                            <List.Item
                                title={option.title}
                                left={(props) => <List.Icon {...props} icon={option.icon} />}
                                onPress={option.onPress}
                                style={styles.listItem}
                            />
                            <Divider />
                        </React.Fragment>
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
        flexGrow: 1,
        padding: 15,
    },
    profileCard: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    listContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 3,
        paddingVertical: 5,
    },
    listItem: {
        paddingVertical: 12,
    },
});

export default SettingsScreen;
