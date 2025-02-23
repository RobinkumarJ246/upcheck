import React, { useState, useRef } from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { Image, StyleSheet, View, SafeAreaView, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { Box, Div, Text } from 'react-native-magnus';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Progress from 'react-native-progress';
import IconF from 'react-native-vector-icons/Feather';
import IconFA6 from 'react-native-vector-icons/FontAwesome6';
import HomeTopBar from '../../components/HomeTopBar';
import { LineChart } from 'react-native-chart-kit';

const { width: windowWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const handleRefreshFetch = () => {
    Alert.alert(
      'Data Fetching',
      'Refetching data from the server. Please wait for a moment of silence because this is in development, for now no legit :)',
      [{
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      }],
      { cancelable: true }
    );
  };

  // Static data for Water Quality Trends
  const waterQualityData = {
    labels: ['6h', '12h', '18h', '24h'], // x-axis labels
    datasets: [
      {
        data: [7.2, 7.4, 7.5, 7.6], // pH values
        color: (opacity = 1) => `rgba(67, 160, 71, ${opacity})`, // Better green
        strokeWidth: 2, // Thicker line
      },
      {
        data: [23, 24, 24.5, 25], // Temperature values
        color: (opacity = 1) => `rgba(229, 57, 53, ${opacity})`, // Better red
        strokeWidth: 2, // Thicker line
      },
      {
        data: [7.8, 8.0, 8.2, 8.1], // Dissolved Oxygen values
        color: (opacity = 1) => `rgba(30, 136, 229, ${opacity})`, // Better blue
        strokeWidth: 2, // Thicker line
      },
    ],
    legend: ['pH Level', 'Temperature', 'Dissolved O₂'], // Simplified labels
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

  // Add animation values for each progress circle
  const [activeProgress, setActiveProgress] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (id) => {
    setActiveProgress(id);
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setActiveProgress(null);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getProgressStyle = (id) => ({
    transform: [{ scale: activeProgress === id ? scaleAnim : 1 }],
  });

  const [metrics, setMetrics] = useState([
    { name: 'Rainfall', value: 10.7, max: 50, unit: 'mm', icon: 'cloud-rain', color: '#03dac6' },
    { name: 'Humidity', value: 60, max: 100, unit: '%', icon: 'wind', color: '#ff9800' },
    { name: 'Temperature', value: 24, max: 50, unit: '°C', icon: 'temperature-half', color: '#e91e63', isFA6: true },
    { name: 'Cloud Coverage', value: 72, max: 100, unit: '%', icon: 'cloud', color: '#2196f3' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <HomeTopBar style={styles.topBar} title="Upcheck" />
      <ParallaxScrollView 
        headerBackgroundColor={{ light: '#1a73e8', dark: '#1D3D47' }}
        headerImage={
          <View style={styles.headerContainer}>
            <Image
              source={require('@/assets/images/Farm.jpg')}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.headerOverlay}>
              <Text style={styles.headerTitle}>Farm Overview</Text>
              <Text style={styles.headerSubtitle}>Last updated 5 mins ago</Text>
            </View>
          </View>
        }
      >
        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Current Metrics Card */}
          <Box style={styles.metricsCard}>
            <View style={styles.refreshContainer}>
              <Text style={styles.refreshText}>Refresh</Text>
              <TouchableOpacity onPress={handleRefreshFetch}>
              <IconF name="rotate-cw" style={styles.refreshIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.boxContainer}>
              <View style={styles.gridRow}>
                {metrics.map((metric, index) => (
                  <TouchableWithoutFeedback 
                    key={index} 
                    onPressIn={() => handlePressIn(`condition${index}`)} 
                    onPressOut={handlePressOut}
                  >
                    <Animated.View style={[
                      styles.skillCard,
                      getProgressStyle(`condition${index}`)
                    ]}>
                      <Progress.Circle 
                        size={100}
                        progress={metric.value / metric.max}
                        color={metric.color}
                        thickness={8}
                        formatText={() => `${metric.value}${metric.unit}`}
                        textStyle={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}
                        showsText
                        borderWidth={1}
                        strokeCap="round"
                        borderColor="#eee"
                      />
                      {metric.isFA6 ? (
                        <IconFA6 name={metric.icon} style={[styles.icon, { fontSize: 34, marginTop: 16, color: metric.color }]} />
                      ) : (
                        <IconF name={metric.icon} style={[styles.icon, { fontSize: 34, marginTop: 16, color: metric.color }]} />
                      )}
                      <Text style={{ 
                        fontSize: 18, 
                        color: "#000", 
                        marginTop: 12,
                        fontWeight: '500',
                        textAlign: 'center'
                      }}>{metric.name}</Text>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
            </View>
          </Box>

          {/* Fish Behavior Card */}
          <Box style={styles.metricsCard}>
            <Text style={styles.cardTitle}>Fish Behavior</Text>
            <View style={styles.metricsStack}>
              <TouchableWithoutFeedback onPressIn={() => handlePressIn('activity')} onPressOut={handlePressOut}>
                <Animated.View style={[styles.metricBox, getProgressStyle('activity')]}>
                  <View style={styles.metricContent}>
                    <Progress.Circle 
                      size={60} 
                      progress={0.95}
                      showsText
                      formatText={() => '95%'}
                      color="#51cf66"
                      thickness={8}
                      borderWidth={1}
                      strokeCap="round"
                      borderColor="#eee"
                      style={styles.progressCircle}
                    />
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>Activity Level</Text>
                      <Text style={styles.metricValue}>95%</Text>
                      <Text style={styles.metricSubtext}>Very Active</Text>
                    </View>
                    <IconF name="activity" style={styles.metricIcon} />
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPressIn={() => handlePressIn('stress')} onPressOut={handlePressOut}>
                <Animated.View style={[styles.metricBox, getProgressStyle('stress')]}>
                  <View style={styles.metricContent}>
                    <Progress.Circle 
                      size={60} 
                      progress={0.05}
                      showsText
                      formatText={() => '5%'}
                      color="#ff6b6b"
                      thickness={8}
                      borderWidth={1}
                      strokeCap="round"
                      borderColor="#eee"
                      style={styles.progressCircle}
                    />
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>Stress Level</Text>
                      <Text style={styles.metricValue}>5%</Text>
                      <Text style={styles.metricSubtext}>Very Low</Text>
                    </View>
                    <IconF name="alert-triangle" style={styles.metricIcon} />
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </Box>

          {/* Water Quality Card */}
          <Box style={styles.metricsCard}>
            <Text style={styles.cardTitle}>Water Quality</Text>
            <View style={styles.metricsStack}>
              <TouchableWithoutFeedback onPressIn={() => handlePressIn('ph')} onPressOut={handlePressOut}>
                <Animated.View style={[styles.metricBox, getProgressStyle('ph')]}>
                  <View style={styles.metricContent}>
                    <Progress.Circle 
                      size={60} 
                      progress={0.75}
                      showsText
                      formatText={() => '7.5'}
                      color="#03dac6"
                      thickness={8}
                      borderWidth={1}
                      strokeCap="round"
                      borderColor="#eee"
                      style={styles.progressCircle}
                    />
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>pH Level</Text>
                      <Text style={styles.metricValue}>7.5</Text>
                      <Text style={styles.metricSubtext}>Optimal Range</Text>
                    </View>
                    <IconF name="activity" style={styles.metricIcon} />
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPressIn={() => handlePressIn('oxygen')} onPressOut={handlePressOut}>
                <Animated.View style={[styles.metricBox, getProgressStyle('oxygen')]}>
                  <View style={styles.metricContent}>
                    <Progress.Circle 
                      size={60} 
                      progress={0.85}
                      showsText
                      formatText={() => '8.0'}
                      color="#4dabf7"
                      thickness={8}
                      borderWidth={1}
                      strokeCap="round"
                      borderColor="#eee"
                      style={styles.progressCircle}
                    />
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>Dissolved Oxygen</Text>
                      <Text style={styles.metricValue}>8.0 mg/L</Text>
                      <Text style={styles.metricSubtext}>Good Condition</Text>
                    </View>
                    <IconF name="droplet" style={styles.metricIcon} />
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </Box>

          {/* Water Quality Trends */}
          <Box style={styles.graphBox}>
            <Text style={styles.graphTitle}>Water Quality Trends</Text>
            <View style={styles.legendContainer}>
              {waterQualityData.datasets.map((dataset, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: dataset.color(1) }]} />
                  <Text style={styles.legendText}>{waterQualityData.legend[index]}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  ...waterQualityData,
                  legend: undefined  // Remove legend from data
                }}
                width={windowWidth - 64}  // Adjusted width
                height={240}        // Adjusted height
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(70, 70, 70, ${opacity})`,
                  style: { borderRadius: 8 },
                  propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
                  propsForVerticalLabels: { fontSize: 12 },
                  propsForHorizontalLabels: { fontSize: 12 },
                  formatYLabel: (value) => value.toFixed(1),
                  yAxisInterval: 1,
                  legendLabel: undefined,     // Remove built-in legend
                  propsForLabels: {
                    fontSize: 12,
                    fontWeight: '600',
                  },
                  showLegend: false,    // Explicitly disable legend
                  legendOffset: 0,      // Remove legend offset
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 8,
                }}
                withInnerLines={true}
                withOuterLines={true}
                withShadow={false}
                withLegend={false}      // Disable legend
                renderLegend={() => null}  // Return null for legend render
              />
            </View>
          </Box>

          {/* Feeding Status Card */}
          <Box style={styles.metricsCard}>
            <Text style={styles.cardTitle}>Feeding Status</Text>
            <View style={styles.metricsStack}>
              <TouchableWithoutFeedback onPressIn={() => handlePressIn('feedLevel')} onPressOut={handlePressOut}>
                <Animated.View style={[styles.metricBox, getProgressStyle('feedLevel')]}>
                  <View style={styles.metricContent}>
                    <Progress.Circle 
                      size={60} 
                      progress={0.70}
                      showsText
                      formatText={() => '70%'}
                      color="#ffd43b"
                      thickness={8}
                      borderWidth={1}
                      strokeCap="round"
                      borderColor="#eee"
                      style={styles.progressCircle}
                    />
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>Feed Level</Text>
                      <Text style={styles.metricValue}>70%</Text>
                      <Text style={styles.metricSubtext}>Needs Refill Soon</Text>
                    </View>
                    <IconF name="package" style={styles.metricIcon} />
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPressIn={() => handlePressIn('feedEfficiency')} onPressOut={handlePressOut}>
                <Animated.View style={[styles.metricBox, getProgressStyle('feedEfficiency')]}>
                  <View style={styles.metricContent}>
                    <Progress.Circle 
                      size={60} 
                      progress={0.85}
                      showsText
                      formatText={() => '85%'}
                      color="#20c997"
                      thickness={8}
                      borderWidth={1}
                      strokeCap="round"
                      borderColor="#eee"
                      style={styles.progressCircle}
                    />
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>Feed Efficiency</Text>
                      <Text style={styles.metricValue}>85%</Text>
                      <Text style={styles.metricSubtext}>High Efficiency</Text>
                    </View>
                    <IconF name="trending-up" style={styles.metricIcon} />
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </Box>

          {/* Feeding Efficiency Chart */}
          <Box style={styles.graphBox}>
            <Text style={styles.graphTitle}>Feeding Efficiency Chart</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  ...feedingEfficiencyData,
                  legend: undefined
                }}
                width={windowWidth - 80}  // Adjusted width
                height={260}        // Adjusted height
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(70, 70, 70, ${opacity})`,
                  style: { borderRadius: 8 },
                  propsForDots: { r: '4', strokeWidth: '2', stroke: '#6a1b9a' },
                  propsForVerticalLabels: { fontSize: 11 },
                  propsForHorizontalLabels: { fontSize: 11 },
                  yAxisLabel: '',
                  xAxisLabel: '',
                  yAxisInterval: 2,
                  propsForLabels: {
                    fontSize: 11,
                    fontWeight: '600',
                  },
                  legendOffset: 20,
                  spacing: 32,     // Increased spacing
                  paddingRight: 32,
                  paddingLeft: 16,
                  showLegend: false,
                  legendOffset: 0,
                }}
                bezier
                style={{
                  marginLeft: 0,
                  alignSelf: 'center',
                }}
                withInnerLines={false}
                withOuterLines={true}
                withShadow={false}
                withLegend={false}
                renderLegend={() => null}
              />
            </View>
          </Box>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerContainer: { position: 'relative', width: '100%', height: 250 },
  headerImage: { width: '100%', height: '100%' },
  headerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#fff', fontSize: 14 },
  mainContent: { padding: 20 },
  currentConditionsCard: {
    backgroundColor: 'transparent',
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  conditionsStack: {
    width: '100%',
    marginTop: 8,
  },
  conditionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conditionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conditionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  conditionLabel: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  conditionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 4,
  },
  conditionSubtext: {
    fontSize: 14,
    color: '#868e96',
    marginTop: 4,
  },
  conditionIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  progressCircle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  qualityCard: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  qualityMetrics: { flexDirection: 'row', justifyContent: 'space-between' },
  qualityItem: { alignItems: 'center', flex: 1, padding: 10 },
  qualityLabel: { fontSize: 14, color: '#666', marginTop: 12, fontWeight: '600' },
  feedingCard: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  feedingMetrics: { flexDirection: 'row', justifyContent: 'space-between' },
  feedingItem: { alignItems: 'center', flex: 1 },
  feedingLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  behaviorCard: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  behaviorMetrics: { flexDirection: 'row', justifyContent: 'space-between' },
  behaviorItem: { alignItems: 'center', flex: 1 },
  behaviorLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  graphBox: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 20,
    paddingHorizontal: 16, // Reduced horizontal padding
    marginBottom: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3,
    width: windowWidth - 32,   // Slightly wider
    alignSelf: 'center',
    alignItems: 'center', // Center children
    minHeight: 380,      // Adjusted height
    paddingTop: 24,
    paddingBottom: 16,
  },
  graphTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 'window',
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginTop: 8,
    paddingTop: 8,
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: 'center',
  },
  progressCircle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  metricsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: windowWidth - 32,   // Adjusted width
    alignSelf: 'center',
  },
  metricsStack: {
    marginTop: 8,
  },
  metricBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  metricLabel: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 2,
  },
  metricSubtext: {
    fontSize: 12,
    color: '#868e96',
    marginTop: 2,
  },
  metricIcon: {
    fontSize: 24,
    color: '#1a73e8',
    marginRight: 8,
  },
  boxContainer: {
    width: '100%',
    paddingHorizontal: 4,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  skillCard: {
    width: '48%',
    minHeight: 220,  // Match gridRow height
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,     // More padding
    paddingVertical: 28, // Extra vertical padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16, // Add margin bottom for spacing
  },
  icon: {
    fontSize: 32,    // Slightly larger icon
    marginTop: 12,   // Adjusted spacing
    marginBottom: 8  // Added bottom margin
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212529',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  refreshContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8, // Add margin right to separate text and icon
  },
  refreshIcon: {
    fontSize: 15,
    color: "#fff",
    backgroundColor: '#00B4BD',
    padding:4,
    borderRadius: 5,
  }
});