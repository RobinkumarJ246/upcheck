import React from 'react';
import { Image, StyleSheet, View, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Box, Div, Badge, Text } from 'react-native-magnus';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import IconF from 'react-native-vector-icons/Feather';
import IconFA6 from 'react-native-vector-icons/FontAwesome6';
import HomeTopBar from '../../components/HomeTopBar';
import { LineChart } from 'react-native-chart-kit';

export default function HomeScreen() {
  const handleRefreshFetch = () => {
    Alert.alert(
      'Data Fetching', // Title of the alert
      'Refetching data from the server. Please wait for a moment of silence because this is in development, for now no legit :)', // Message
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      { cancelable: true }
    );
  };

  // Static data for Water Quality Trends
  const waterQualityData = {
    labels: ['6h', '12h', '18h', '24h'], // x-axis labels
    datasets: [
      {
        data: [7.2, 7.4, 7.5, 7.6], // pH values
        color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green line
        strokeWidth: 3, // Thicker line
      },
      {
        data: [23, 24, 24.5, 25], // Temperature values
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red line
        strokeWidth: 3, // Thicker line
      },
      {
        data: [7.8, 8.0, 8.2, 8.1], // Dissolved Oxygen values
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue line
        strokeWidth: 3, // Thicker line
      },
    ],
    legend: ['pH', 'Temperature (°C)', 'Dissolved Oxygen (mg/L)'], // Legend labels
  };

  // Static data for Feeding Efficiency Chart
  const feedingEfficiencyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // x-axis labels
    datasets: [
      {
        data: [70, 75, 80, 85, 90, 95, 100], // Feeding efficiency percentages
        color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green line
        strokeWidth: 3, // Thicker line
      },
    ],
    legend: ['Feeding Efficiency (%)'], // Legend label
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeTopBar style={styles.topBar} title="Upcheck" />
      <ParallaxScrollView
          headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
           headerImage={
        <Image
            source={require('@/assets/images/Farm.jpg')}
            style={styles.reactLogo} // Ensure this style is adjusted
            resizeMode="cover" // Ensures the image covers the entire area
        />
                }
      >
        {/* Dashboard Title */}
        <Div row style={styles.subtitleContainer} alignItems="center">
          <ThemedText type="subtitle">Dashboard</ThemedText>
        </Div>

        {/* Last Fetched Info */}
        <Div row justifyContent="center" alignItems="center">
          <ThemedText>Last Fetched: 5mins ago</ThemedText>
          <TouchableOpacity style={styles.fetchButton} onPress={handleRefreshFetch}>
            <View style={styles.fetchButtonContent}>
              <IconF name="rotate-ccw" style={styles.refreshIcon} />
            </View>
          </TouchableOpacity>
        </Div>

        {/* Existing Metrics Section */}
        <View style={styles.boxContainer}>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems="center">
              <IconF name="cloud-rain" style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Rainfall</ThemedText>
                <ThemedText>10.7 mm</ThemedText>
              </ThemedView>
            </Div>
          </Box>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems="center">
              <IconF name="wind" style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Humidity</ThemedText>
                <ThemedText>60%</ThemedText>
              </ThemedView>
            </Div>
          </Box>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems="center">
              <IconFA6 name="temperature-half" style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Temperature</ThemedText>
                <ThemedText>24 C</ThemedText>
              </ThemedView>
            </Div>
          </Box>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.box}>
            <Div row alignItems="center">
              <IconF name="cloud" style={styles.icon} />
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Cloud Coverage</ThemedText>
                <ThemedText>72%</ThemedText>
              </ThemedView>
            </Div>
          </Box>
        </View>

        {/* Main Metrics Section */}
        <Div mt="lg">
          <Text fontSize="lg" fontWeight="bold" mb="md">
            Main Metrics
          </Text>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.metricBox}>
            <Div row alignItems="center" mb="sm">
              <IconF name="droplet" style={styles.metricIcon} />
              <Div>
                <Text fontSize="sm" fontWeight="bold">
                  pH
                </Text>
                <Text color="green500">7.5 (Green Status)</Text>
              </Div>
            </Div>
            <Div row alignItems="center" mb="sm">
              <IconFA6 name="temperature-half" style={styles.metricIcon} />
              <Div>
                <Text fontSize="sm" fontWeight="bold">
                  Temperature
                </Text>
                <Text>24°C (Normal)</Text>
              </Div>
            </Div>
            <Div row alignItems="center">
              <IconF name="wind" style={styles.metricIcon} />
              <Div>
                <Text fontSize="sm" fontWeight="bold">
                  Dissolved Oxygen
                </Text>
                <Text>8 mg/L (Optimal)</Text>
              </Div>
            </Div>
          </Box>
        </Div>

        {/* Feeding Status Section */}
        <Div mt="lg">
          <Text fontSize="lg" fontWeight="bold" mb="md">
            Feeding Status
          </Text>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.metricBox}>
            <Div row alignItems="center" mb="sm">
              <IconF name="clock" style={styles.metricIcon} />
              <Div>
                <Text fontSize="sm" fontWeight="bold">
                  Last Feeding
                </Text>
                <Text>2 hours ago</Text>
              </Div>
            </Div>
            <Div row alignItems="center">
              <IconF name="package" style={styles.metricIcon} />
              <Div>
                <Text fontSize="sm" fontWeight="bold">
                  Current Feed Level
                </Text>
                <Text>70%</Text>
              </Div>
            </Div>
          </Box>
        </Div>

        {/* Fish Behavior Section */}
        <Div mt="lg">
          <Text fontSize="lg" fontWeight="bold" mb="md">
            Fish Behavior
          </Text>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.metricBox}>
            <Div row alignItems="center" mb="sm">
              <IconF name="activity" style={styles.metricIcon} />
              <Div>
                <Text fontSize="sm" fontWeight="bold">
                  Active
                </Text>
                <Text>95%</Text>
              </Div>
            </Div>
            <Div row alignItems="center">
              <IconF name="alert-triangle" style={styles.metricIcon} />
              <Div>
                <Text fontSize="sm" fontWeight="bold">
                  Stress
                </Text>
                <Text>5%</Text>
              </Div>
            </Div>
          </Box>
        </Div>

        {/* Graph Section */}
        <Div mt="lg">
          <Text fontSize="lg" fontWeight="bold" mb="md">
            Graphs
          </Text>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.graphBox}>
            <Text fontSize="sm" fontWeight="bold" mb="sm">
              Water Quality Trends (pH, DO, Temp over 24 hrs)
            </Text>
            <LineChart
              data={waterQualityData}
              width={350} // Width of the chart
              height={250} // Increased height for better spacing
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1, // Number of decimal places
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 8,
                },
                propsForDots: {
                  r: '6', // Dot radius
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier // Smooth curve
              style={{
                marginVertical: 8,
                borderRadius: 8,
              }}
              withInnerLines={false} // Disable inner grid lines for clarity
              withOuterLines={true} // Keep outer grid lines
              withShadow={false} // Disable shadow for cleaner look
              withHorizontalLabels={true} // Show horizontal labels
              withVerticalLabels={true} // Show vertical labels
            />
          </Box>
          <Box p="md" borderRadius={8} bg="white" shadow="md" m="sm" style={styles.graphBox}>
            <Text fontSize="sm" fontWeight="bold" mb="sm">
              Feeding Efficiency Chart
            </Text>
            <LineChart
              data={feedingEfficiencyData}
              width={350} // Width of the chart
              height={250} // Height of the chart
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0, // No decimal places
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 8,
                },
                propsForDots: {
                  r: '6', // Dot radius
                  strokeWidth: '2',
                  stroke: '#6a1b9a',
                },
              }}
              bezier // Smooth curve
              style={{
                marginVertical: 8,
                borderRadius: 8,
              }}
            />
          </Box>
        </Div>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  subtitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  reactLogo: {
    width: '100%', // Ensure the image takes up the full width
    height: 250,   // Set a fixed height (adjust as needed)
    resizeMode: 'cover', // Ensures the image covers the entire area without distortion
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
    marginLeft: 10,
  },
  fetchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 20,
    color: '#000',
  },
  metricBox: {
    width: '100%',
  },
  metricIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#03dac6',
  },
  graphBox: {
    width: '100%',
  },
});