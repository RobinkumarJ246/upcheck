import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import { Box, Div } from 'react-native-magnus';
import IconF from 'react-native-vector-icons/Feather';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconFA6 from 'react-native-vector-icons/FontAwesome6';
import HomeTopBar from '../../components/HomeTopBar';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const handleRefreshFetch = () => {
    Alert.alert(
      'Data Fetching',
      'Refetching data from the server. Please wait for a moment of silence because this is in development.',
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeTopBar title="Upcheck" />

      <ParallaxScrollView
        headerBackgroundColor="#A1CEDC"
        headerImage={
          <Image
            source={require('@/assets/images/upcheck-logo.png')}
            style={styles.logo}
          />
        }
      >
        <Div row justifyContent="center" style={styles.subtitleContainer}>
          <ThemedText type="subtitle" style={styles.subtitleText}>
            Dashboard
          </ThemedText>
        </Div>

        <Div row justifyContent="center" style={styles.lastFetched}>
          <Text style={styles.lastFetchedText}>Last Fetched: 5 mins ago</Text>
          <TouchableOpacity style={styles.fetchButton} onPress={handleRefreshFetch}>
            <IconFA name="refresh" style={styles.refreshIcon} />
          </TouchableOpacity>
        </Div>

        <View style={styles.boxContainer}>
          <Box style={styles.box}>
            <Div row alignItems="center">
              <IconF name="cloud-rain" style={styles.icon} />
              <View>
                <Text style={styles.boxTitle}>Rainfall</Text>
                <Text style={styles.boxValue}>10.7 mm</Text>
              </View>
            </Div>
          </Box>

          <Box style={styles.box}>
            <Div row alignItems="center">
              <IconF name="wind" style={styles.icon} />
              <View>
                <Text style={styles.boxTitle}>Humidity</Text>
                <Text style={styles.boxValue}>60%</Text>
              </View>
            </Div>
          </Box>

          <Box style={styles.box}>
            <Div row alignItems="center">
              <IconFA6 name="temperature-half" style={styles.icon} />
              <View>
                <Text style={styles.boxTitle}>Temperature</Text>
                <Text style={styles.boxValue}>24 °C</Text>
              </View>
            </Div>
          </Box>

          <Box style={styles.box}>
            <Div row alignItems="center">
              <IconF name="cloud" style={styles.icon} />
              <View>
                <Text style={styles.boxTitle}>Cloud Coverage</Text>
                <Text style={styles.boxValue}>72%</Text>
              </View>
            </Div>
          </Box>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Ensures the background doesn't depend on system theme
  },
  logo: {
    height: 150,
    width: width * 0.8,
    alignSelf: 'center',
    marginTop: 20,
    resizeMode: 'contain',
  },
  subtitleContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  lastFetched: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  lastFetchedText: {
    fontSize: 14,
    color: '#555',
  },
  fetchButton: {
    marginLeft: 10,
    backgroundColor: '#03DAC6',
    padding: 8,
    borderRadius: 5,
  },
  refreshIcon: {
    fontSize: 18,
    color: '#FFF',
  },
  boxContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  box: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  icon: {
    fontSize: 30,
    color: '#03DAC6',
    marginRight: 10,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  boxValue: {
    fontSize: 14,
    color: '#777',
  },
});
