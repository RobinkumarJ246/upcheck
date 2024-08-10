import React from 'react';
import { Image, StyleSheet, Platform, View } from 'react-native';
import { Button, Div, Box, Badge } from 'react-native-magnus';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFA6 from 'react-native-vector-icons/FontAwesome6';
import IconF from 'react-native-vector-icons/Feather';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/shrimp-bg.jpeg')}
          style={styles.reactLogo}
        />
      }
    >
      <Div row style={{ justifyContent: 'center' }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontSize: 25 }}>Welcome to Upcheck!</ThemedText>
          <HelloWave />
        </ThemedView>
      </Div>
      <Div row style={{ justifyContent: 'center' }}>
        <ThemedText type='subtitle'>
          Dashboard
          <Badge ml="md" bg="red500">Live</Badge>
        </ThemedText>
      </Div>
      <Div row><IconF name = 'cloud-rain' style = {{marginEnd:10}}/>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Rainfall</ThemedText>
        <ThemedText>Sample data</ThemedText>
      </ThemedView></Div>
      <Div row><IconF name = 'wind' style = {{marginEnd:10}}/>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Humidity</ThemedText>
        <ThemedText>Sample data</ThemedText>
      </ThemedView></Div>
      <Div row><IconFA6 name = 'temperature-half' style = {{marginEnd:10}}/><ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Temperature</ThemedText>
        <ThemedText>Sample data</ThemedText>
      </ThemedView></Div>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});