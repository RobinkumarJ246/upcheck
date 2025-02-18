import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Box, Div, Badge, Text } from "react-native-magnus";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as Progress from "react-native-progress";
import IconF from "react-native-vector-icons/Feather";
import IconFA6 from "react-native-vector-icons/FontAwesome6";
import HomeTopBar from "../../components/HomeTopBar";
import { LineChart } from "react-native-chart-kit";

export default function HomeScreen() {
  const handleRefreshFetch = () => {
    Alert.alert(
      "Data Fetching", // Title of the alert
      "Refetching data from the server. Please wait for a moment of silence because this is in development, for now no legit :)", // Message
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ],
      { cancelable: true }
    );
  };

  // Static data for Water Quality Trends
  const waterQualityData = {
    labels: ["6h", "12h", "18h", "24h"], // x-axis labels
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
    legend: ["pH", "Temperature (°C)", "Dissolved Oxygen (mg/L)"], // Legend labels
  };

  // Static data for Feeding Efficiency Chart
  const feedingEfficiencyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // x-axis labels
    datasets: [
      {
        data: [70, 75, 80, 85, 90, 95, 100], // Feeding efficiency percentages
        color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green line
        strokeWidth: 3, // Thicker line
      },
    ],
    legend: ["Feeding Efficiency (%)"], // Legend label
  };

  {
    /* Metrics Section */
  }
  const [metrics, setMetrics] = useState([
    {
      name: "Rainfall",
      value: 10.7,
      max: 50,
      unit: "mm",
      icon: "cloud-rain",
      color: "#03dac6",
    },
    {
      name: "Humidity",
      value: 60,
      max: 100,
      unit: "%",
      icon: "wind",
      color: "#ff9800",
    },
    {
      name: "Temperature",
      value: 24,
      max: 50,
      unit: "°C",
      icon: "temperature-half",
      color: "#e91e63",
      isFA6: true,
    },
    {
      name: "Cloud Coverage",
      value: 72,
      max: 100,
      unit: "%",
      icon: "cloud",
      color: "#2196f3",
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <HomeTopBar style={styles.topBar} title="Upcheck" />
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/Farm.jpg")}
            style={styles.reactLogo}
            resizeMode="cover"
          />
        }
      >
        <Div row style={styles.subtitleContainer} alignItems="center">
          <ThemedText type="subtitle">Dashboard</ThemedText>
        </Div>

        <Div
          row
          justifyContent="center"
          alignItems="center"
          style={styles.lastFetchedContainer}
        >
          <ThemedText>Last Fetched: 5mins ago</ThemedText>
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={handleRefreshFetch}
          >
            <View style={styles.fetchButtonContent}>
              <IconF name="rotate-ccw" style={styles.refreshIcon} />
            </View>
          </TouchableOpacity>
        </Div>

        {/* Metrics Section */}
        <View style={styles.boxContainer}>
          {metrics.map((metric, index) => (
            <View key={index} style={styles.skillCard}>
              <Progress.Circle
                size={80}
                progress={metric.value / metric.max}
                color={metric.color}
                thickness={5}
                formatText={() => `${metric.value}${metric.unit}`}
                textStyle={styles.progressText}
                showsText
              />
              {metric.isFA6 ? (
                <IconFA6
                  name={metric.icon}
                  style={[styles.icon, { color: metric.color }]}
                />
              ) : (
                <IconF
                  name={metric.icon}
                  style={[styles.icon, { color: metric.color }]}
                />
              )}
              <ThemedText type="subtitle" style={{ color: "#000" }}>
                {metric.name}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Main Metrics Section */}
        <Div mt="lg" style={styles.section}>
          <Text fontSize="lg" fontWeight="bold" mb="md">
            Main Metrics
          </Text>
          <Box style={styles.metricBox}>
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
        <Div mt="lg" style={styles.section}>
          <Text fontSize="lg" fontWeight="bold" mb="md">
            Feeding Status
          </Text>
          <Box style={styles.metricBox}>
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
        <Div mt="lg" style={styles.section}>
          <Text fontSize="lg" fontWeight="bold" mb="md">
            Fish Behavior
          </Text>
          <Box style={styles.metricBox}>
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

        {/* Water Quality Trend Chart */}
        <Div mt="lg" style={styles.section}>
          <Text fontSize="lg" fontWeight="bold" mb="md">
            Graphs
          </Text>
          <Box style={styles.graphBox}>
            <Text fontSize="sm" fontWeight="bold" mb="sm">
              Water Quality Trends (pH, DO, Temp over 24 hrs)
            </Text>
            <LineChart
              data={waterQualityData}
              width={350}
              height={250}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 8,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 8,
              }}
              withInnerLines={false}
              withOuterLines={true}
              withShadow={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
            />
          </Box>

          {/* Feeding Efficiency Chart */}
          <Box style={styles.graphBox}>
            <Text fontSize="sm" fontWeight="bold" mb="sm">
              Feeding Efficiency Chart
            </Text>
            <LineChart
              data={feedingEfficiencyData}
              width={350}
              height={250}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 8,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#6a1b9a",
                },
              }}
              bezier
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
    backgroundColor: "#f5f5f5",
  },
  subtitleContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  reactLogo: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  boxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  skillCard: {
    width: "48%", // Two cards per row
    aspectRatio: 1, // Ensures square shape
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  icon: {
    fontSize: 26,
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
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
    backgroundColor: "#03dac6",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  fetchButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  refreshIcon: {
    fontSize: 20,
    color: "#000",
  },
  lastFetchedContainer: {
    marginVertical: 10,
  },
  metricBox: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  metricIcon: {
    fontSize: 20,
    marginRight: 10,
    color: "#03dac6",
  },
  graphBox: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  section: {
    backgroundColor: "#e0f7fa",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});
