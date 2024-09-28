import React from 'react';
import { Image, StyleSheet, View, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Box, Div, Badge } from 'react-native-magnus';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import IconF from 'react-native-vector-icons/Feather';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconFA6 from 'react-native-vector-icons/FontAwesome6';
import HomeTopBar from '../../components/HomeTopBar';
import Menu from '../../components/Menu';

export default function HomeScreen() {
  const handleRefreshFetch = () => {
    Alert.alert(
        'Data Fetching', // Title of the alert
        'Refetching data from the server. Please wait for a moment of silence because this in development, for now no legit :)', // Message
        [
            {
                text: 'OK',
                onPress: () => console.log('OK Pressed')
            },
        ],
        { cancelable: true }
    );
};

  return (
    <SafeAreaView style={styles.container}>
      <HomeTopBar style={styles.topBar} title = "Upcheck"/>
      
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/upcheck-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        {/*}<Div row style={styles.titleContainer}>
          <ThemedView>
            <ThemedText type="title" style={styles.titleText}>Welcome to Upcheck!</ThemedText>
            <HelloWave style={styles.helloWave} />
          </ThemedView>
        </Div>{*/}
        <Div row style={styles.subtitleContainer} alignItems = 'center'>
          <ThemedText type='subtitle'>
            Dashboard
            {/*}<Badge ml="md" bg="red500">Live</Badge>{*/}
          </ThemedText>
        </Div>
        <Div row justifyContent='center' alignItems='center'><ThemedText>Last Fetched: 5mins ago</ThemedText>
        <TouchableOpacity style={styles.fetchButton} onPress={handleRefreshFetch}>
                <View style={styles.fetchButtonContent}>
                    <IconFA name='refresh' style={styles.refreshIcon} />
                    {/*}<ThemedText style={styles.fetchButtonText}>PondOne</ThemedText>{*/}
                </View>
            </TouchableOpacity>
        </Div>
        <View style={styles.boxContainer}>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems='center'>
              <IconF name='cloud-rain' style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Rainfall</ThemedText>
                <ThemedText>10.7 mm</ThemedText>
              </ThemedView>
            </Div>
          </Box>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems='center'>
              <IconF name='wind' style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Humidity</ThemedText>
                <ThemedText>60%</ThemedText>
              </ThemedView>
            </Div>
          </Box>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems='center'>
              <IconFA6 name='temperature-half' style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Temperature</ThemedText>
                <ThemedText>24 C</ThemedText>
              </ThemedView>
            </Div>
          </Box>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems='center'>
              <IconF name='cloud' style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Cloud coverage</ThemedText>
                <ThemedText>72%</ThemedText>
              </ThemedView>
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
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 10,
    
  },
  titleText: {
    fontSize: 25,
    marginRight: 10,
  },
  helloWave: {
    marginLeft: 10,
  },
  subtitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  boxContainer: {
    paddingHorizontal: 10,
  },
  box: {
    width: '100%', 
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  topBar: {
    paddingTop: 0,
    zIndex: 1,
  },
  fetchButton: {
    backgroundColor: '#03dac6', // Teal color
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginLeft: 10
},
fetchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
},
fetchButtonText: {
    color: '#000000', // Black color
    fontWeight: 'bold',
},
refreshIcon: {
},
});