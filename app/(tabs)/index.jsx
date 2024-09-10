import React from 'react';
import { Image, StyleSheet, View, SafeAreaView, Alert } from 'react-native';
import { Box, Div, Badge } from 'react-native-magnus';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import IconF from 'react-native-vector-icons/Feather';
import IconFA6 from 'react-native-vector-icons/FontAwesome6';
import HomeTopBar from '../../components/HomeTopBar';
import Menu from '../../components/Menu';

export default function HomeScreen() {
  const handleButtonPress = () => {
    Alert.alert('Button Pressed!', 'You clicked the button.');
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
        <View style={styles.boxContainer}>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems='center'>
              <IconF name='cloud-rain' style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Rainfall</ThemedText>
                <ThemedText>Sample data</ThemedText>
              </ThemedView>
            </Div>
          </Box>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems='center'>
              <IconF name='wind' style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Humidity</ThemedText>
                <ThemedText>Sample data</ThemedText>
              </ThemedView>
            </Div>
          </Box>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems='center'>
              <IconFA6 name='temperature-half' style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Temperature</ThemedText>
                <ThemedText>Sample data</ThemedText>
              </ThemedView>
            </Div>
          </Box>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems='center'>
              <IconF name='cloud' style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Cloud coverage</ThemedText>
                <ThemedText>Sample data</ThemedText>
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
});