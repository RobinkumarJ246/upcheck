import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Dimensions,
  StatusBar,
  Keyboard,
  ToastAndroid,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Tooltip from 'react-native-walkthrough-tooltip';

const PondPerformanceScreen = ({ navigation }) => {
  // State for API URL
  const [apiUrl, setApiUrl] = useState('http://192.168.111.178:5000/predict');
  const [showApiUrlInput, setShowApiUrlInput] = useState(false);
  
  // State for form and results
  const [params, setParams] = useState({
    pond_area: '1.2',
    pond_depth: '1.4',
    stocking_density: '18.0',
    dissolved_oxygen: '4.8',
    water_temperature: '29.5',
    ph: '7.8',
    salinity: '16.0',
    ammonia: '0.15',
    nitrite: '0.08',
    alkalinity: '145.0',
    transparency: '38.0',
  });

  // Tooltips visibility state
  const [tooltipVisible, setTooltipVisible] = useState({});
  // Add this with other state variables
   const [loadingText, setLoadingText] = useState('Analyzing...');
   const timeoutRef = useRef(null);
  
  // State for prediction history
  const [predictionHistory, setPredictionHistory] = useState([]);
  
  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Results and UI state
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('form');

  // Labels and tooltips for input fields
  const paramLabels = {
    pond_area: { 
      label: 'Pond Area', 
      unit: 'hectares', 
      tooltip: 'The total surface area of your pond in hectares. This affects the total production capacity.' 
    },
    pond_depth: { 
      label: 'Pond Depth', 
      unit: 'm', 
      tooltip: 'Average water depth in meters. Optimal depth varies by species and culture system.' 
    },
    stocking_density: { 
      label: 'Stocking Density', 
      unit: 'pcs/m²', 
      tooltip: 'Number of organisms per square meter. Higher density requires better management.' 
    },
    dissolved_oxygen: { 
      label: 'Dissolved Oxygen', 
      unit: 'mg/L', 
      tooltip: 'Amount of oxygen dissolved in water. Critical for aquatic life (4-7 mg/L is typically good).' 
    },
    water_temperature: { 
      label: 'Water Temperature', 
      unit: '°C', 
      tooltip: 'Water temperature affects metabolism, growth, and oxygen levels.' 
    },
    ph: { 
      label: 'pH', 
      unit: '', 
      tooltip: 'Measure of water acidity/alkalinity. Most aquaculture species prefer 6.5-9.0.' 
    },
    salinity: { 
      label: 'Salinity', 
      unit: 'ppt', 
      tooltip: 'Salt concentration in water. Different species have different optimal ranges.' 
    },
    ammonia: { 
      label: 'Ammonia', 
      unit: 'mg/L', 
      tooltip: 'Toxic compound from waste. Should be kept below 0.5 mg/L.' 
    },
    nitrite: { 
      label: 'Nitrite', 
      unit: 'mg/L', 
      tooltip: 'Intermediate compound in nitrification. Should be kept below 0.5 mg/L.' 
    },
    alkalinity: { 
      label: 'Alkalinity', 
      unit: 'mg/L', 
      tooltip: 'Water\'s capacity to resist pH changes. 100-150 mg/L is often ideal.' 
    },
    transparency: { 
      label: 'Transparency', 
      unit: 'cm', 
      tooltip: 'Water clarity measured by Secchi disk. 30-45 cm is often recommended.' 
    },
  };

  // Handle API URL updates
  const handleApiUrlUpdate = (url) => {
    setApiUrl(url);
    setShowApiUrlInput(false);
    try {
      AsyncStorage.setItem('pond_predictor_api_url', url);
      if (Platform.OS === 'android') {
        ToastAndroid.show('API URL updated', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error saving API URL:', error);
    }
  };

  // Load saved API URL on component mount
  React.useEffect(() => {
    const loadApiUrl = async () => {
      try {
        const savedUrl = await AsyncStorage.getItem('pond_predictor_api_url');
        if (savedUrl) {
          setApiUrl(savedUrl);
        }
      } catch (error) {
        console.error('Error loading API URL:', error);
      }
    };
    
    loadApiUrl();
    
    // Animate on component mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Update form values
  const handleInputChange = (name, value) => {
    setParams({
      ...params,
      [name]: value,
    });
  };

  // Save prediction to history
  const savePrediction = async (predictionData) => {
    try {
      const currentTime = new Date().toLocaleString();
      const newPrediction = {
        timestamp: currentTime,
        params: { ...params },
        results: { ...predictionData },
      };
      
      const updatedHistory = [newPrediction, ...predictionHistory].slice(0, 10); // Keep only the last 10
      setPredictionHistory(updatedHistory);
      
      await AsyncStorage.setItem('prediction_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving prediction:', error);
    }
  };

  // Add this function after the loadHistory function
const clearPredictionHistory = async () => {
    try {
      setPredictionHistory([]);
      await AsyncStorage.removeItem('prediction_history');
      if (Platform.OS === 'android') {
        ToastAndroid.show('Prediction history cleared', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error clearing prediction history:', error);
    }
  };

  // Load prediction history
  React.useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('prediction_history');
        if (savedHistory) {
          setPredictionHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error loading prediction history:', error);
      }
    };
    
    loadHistory();
// Cleanup function
return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);

// Handle prediction request
const handlePrediction = async () => {
    Keyboard.dismiss();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setLoading(true);
      
      // Set timeout to change loading text after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setLoadingText('Still working...');
        
        // Set another timeout for longer operations
        timeoutRef.current = setTimeout(() => {
          setLoadingText('Almost there...');
        }, 5000);
      }, 5000);
  
      // Convert all string values to numbers
      const numericParams = {};
      for (const [key, value] of Object.entries(params)) {
        numericParams[key] = parseFloat(value);
        
        // Validate inputs are numeric
        if (isNaN(numericParams[key])) {
          throw new Error(`${paramLabels[key].label} must be a valid number`);
        }
      }
  
      // Validation for reasonable ranges
      if (numericParams.ph < 0 || numericParams.ph > 14) {
        throw new Error('pH must be between 0 and 14');
      }
      
      if (numericParams.dissolved_oxygen < 0) {
        throw new Error('Dissolved Oxygen cannot be negative');
      }
  
      // Send request to API
      const response = await axios.post(apiUrl.trim(), numericParams);
      setResults(response.data);
      savePrediction(response.data);
      setActiveTab('results');
      
      // Animate new results
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      
    } catch (error) {
      console.error('Prediction error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || error.message || 'Failed to get prediction'
      );
    } finally {
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setLoading(false);
      setLoadingText('Analyzing...'); // Reset loading text for next time
    }
  };

  // Reset form and results
  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setParams({
      pond_area: '1.2',
      pond_depth: '1.4',
      stocking_density: '18.0',
      dissolved_oxygen: '4.8',
      water_temperature: '29.5',
      ph: '7.8',
      salinity: '16.0',
      ammonia: '0.15',
      nitrite: '0.08',
      alkalinity: '145.0',
      transparency: '38.0',
    });
    setResults(null);
    setActiveTab('form');
  };

  // Get color based on suitability class
const getSuitabilityColor = (label) => {
    switch (label) {
      case 'Poor': return ['#FF6B6B', '#FF8E8E']; // Red gradient
      case 'Fair': return ['#FFD166', '#FFDD88']; // Yellow gradient
      case 'Good': return ['#06D6A0', '#39E8B0']; // Teal gradient
      case 'Excellent': return ['#118AB2', '#3DAFD5']; // Blue gradient
      default: return ['#073B4C', '#1A5A6C']; // Dark blue gradient
    }
  };

  // Get appropriate icon for each parameter
  const getParameterIcon = (key) => {
    switch (key) {
      case 'pond_area': return <MaterialIcons name="crop-square" size={20} color="#118AB2" />;
      case 'pond_depth': return <MaterialCommunityIcons name="arrow-collapse-vertical" size={20} color="#118AB2" />;
      case 'stocking_density': return <FontAwesome5 name="fish" size={18} color="#118AB2" />;
      case 'dissolved_oxygen': return <MaterialCommunityIcons name="molecule" size={20} color="#118AB2" />;
      case 'water_temperature': return <FontAwesome5 name="temperature-high" size={18} color="#118AB2" />;
      case 'ph': return <MaterialIcons name="science" size={20} color="#118AB2" />;
      case 'salinity': return <MaterialCommunityIcons name="water" size={20} color="#118AB2" />;
      case 'ammonia': return <MaterialCommunityIcons name="flask" size={20} color="#118AB2" />;
      case 'nitrite': return <MaterialCommunityIcons name="flask-outline" size={20} color="#118AB2" />;
      case 'alkalinity': return <MaterialCommunityIcons name="ph" size={20} color="#118AB2" />;
      case 'transparency': return <MaterialIcons name="visibility" size={20} color="#118AB2" />;
      default: return <MaterialIcons name="info-outline" size={20} color="#118AB2" />;
    }
  };

  // Render input form
  const renderForm = () => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Pond Parameters</Text>
      <Text style={styles.sectionSubtitle}>
        Enter your pond's parameters to analyze
      </Text>
      
      {Object.keys(params).map((key) => (
        <View key={key} style={styles.inputRow}>
          <View style={styles.labelRow}>
            {getParameterIcon(key)}
            <Text style={styles.inputLabel}>
              {paramLabels[key].label}
              {paramLabels[key].unit ? ` (${paramLabels[key].unit})` : ''}
            </Text>
            <Tooltip.default
              isVisible={tooltipVisible[key] || false}
              content={<Text style={styles.tooltipText}>{paramLabels[key].tooltip}</Text>}
              placement="top"
              onClose={() => setTooltipVisible({...tooltipVisible, [key]: false})}
            >
              <TouchableOpacity 
                onPress={() => setTooltipVisible({...tooltipVisible, [key]: true})}
                style={styles.infoButton}
              >
                <Ionicons name="information-circle-outline" size={20} color="#8D99AE" />
              </TouchableOpacity>
            </Tooltip.default>
          </View>
          <TextInput
            style={styles.input}
            value={params[key]}
            onChangeText={(value) => handleInputChange(key, value)}
            keyboardType="numeric"
            placeholder={`Enter ${paramLabels[key].label}`}
          />
        </View>
      ))}

      <View style={styles.buttonContainer}>
      <TouchableOpacity
  style={styles.predictButton}
  onPress={handlePrediction}
  disabled={loading}
>
  {loading ? (
    <LinearGradient
      colors={['#118AB2', '#073B4C']}
      style={styles.buttonGradient}
    >
      <ActivityIndicator color="#fff" size="small" />
      <Text style={styles.buttonText}>{loadingText}</Text>
    </LinearGradient>
  ) : (
    <LinearGradient
      colors={['#118AB2', '#073B4C']}
      style={styles.buttonGradient}
    >
      <Ionicons name="analytics-outline" size={20} color="#fff" />
      <Text style={styles.buttonText}>Analyze pond</Text>
    </LinearGradient>
  )}
</TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="refresh-outline" size={20} color="#073B4C" />
          <Text style={styles.resetButtonText}>Reset Form</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.apiLinkButton} 
        onPress={() => setShowApiUrlInput(!showApiUrlInput)}
      >
        <Ionicons name="link-outline" size={16} color="#8D99AE" />
        <Text style={styles.apiLinkText}>API Configuration</Text>
      </TouchableOpacity>
      
      {showApiUrlInput && (
        <View style={styles.apiUrlContainer}>
          <TextInput
            style={styles.apiUrlInput}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="Enter API URL"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={styles.apiUrlButton}
            onPress={() => handleApiUrlUpdate(apiUrl)}
          >
            <Text style={styles.apiUrlButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {predictionHistory.length > 0 && (
  <View style={styles.historyContainer}>
    <View style={styles.historyHeader}>
      <Text style={styles.historySectionTitle}>Recent Predictions</Text>
      <TouchableOpacity onPress={clearPredictionHistory} style={styles.clearHistoryButton}>
        <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
        <Text style={styles.clearHistoryText}>Clear History</Text>
      </TouchableOpacity>
    </View>
    
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.historyScrollView}
      contentContainerStyle={styles.historyScrollContent}
    >
      {predictionHistory.map((prediction, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.historyCard}
          onPress={() => {
            setParams(prediction.params);
            setResults(prediction.results);
            setActiveTab('results');
          }}
        >
          <View style={[
            styles.historyColorBadge, 
            {backgroundColor: getSuitabilityColor(prediction.results.pond_suitability_label)[0]}
          ]} />
          <Text style={styles.historyTitle}>{prediction.results.pond_suitability_label}</Text>
          <Text style={styles.historyScore}>Score: {prediction.results.pond_suitability_score.toFixed(1)}</Text>
          <Text style={styles.historyDate}>{prediction.timestamp}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}
    </ScrollView>
  );

  // Render results
  const renderResults = () => {
    if (!results) return null;

    const suitabilityColors = getSuitabilityColor(results.pond_suitability_label);

    // Prepare data for bar chart
    const barChartData = {
      labels: ['Score', 'Growth', 'Survival', 'Yield', 'FCR'],
      datasets: [
        {
          data: [
            parseFloat(results.pond_suitability_score.toFixed(2)),
            parseFloat(results.growth_rate.toFixed(2)),
            parseFloat(results.survival_rate.toFixed(2) / 10), // Scaled down to fit chart better
            parseFloat(results.yield.toFixed(2) / 100), // Scaled down to fit chart better
            parseFloat(results.fcr.toFixed(2)),
          ],
        },
      ],
    };
    
    // Prepare data for line chart showing hypothetical performance over time
    const timelineData = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
      datasets: [
        {
          data: [
            results.growth_rate * 0.5,
            results.growth_rate * 0.8,
            results.growth_rate * 1.0,
            results.growth_rate * 1.2,
            results.growth_rate * 1.3,
            results.growth_rate * 1.4,
          ],
          color: () => suitabilityColors[0],
          strokeWidth: 2,
        },
      ],
      legend: ['Growth Projection'],
    };

    return (
        <Animated.ScrollView 
        style={[styles.resultsContainer, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at bottom
      >
        <View style={styles.resultHeaderContainer}>
          <LinearGradient
            colors={suitabilityColors}
            style={styles.suitabilityBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.suitabilityText}>
              {results.pond_suitability_label}
            </Text>
          </LinearGradient>
          
          <Text style={styles.scoreText}>
            Score: {results.pond_suitability_score.toFixed(2)}
          </Text>
          
          <Text style={styles.recommendationText}>
            {results.pond_suitability_label === 'Excellent' && "Optimal conditions for high productivity."}
            {results.pond_suitability_label === 'Good' && "Good conditions, minor adjustments may help."}
            {results.pond_suitability_label === 'Fair' && "Acceptable, but consider improvements."}
            {results.pond_suitability_label === 'Poor' && "Requires immediate attention to improve conditions."}
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Performance Metrics</Text>
          <BarChart
            data={barChartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(17, 138, 178, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(73, 80, 87, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.7,
            }}
            style={styles.chart}
            fromZero
          />
          <Text style={styles.chartNote}>Note: Survival (%) and Yield (kg/ha) are scaled down</Text>
        </View>
        
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Growth Projection</Text>
          <LineChart
            data={timelineData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(17, 138, 178, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(73, 80, 87, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: suitabilityColors[0],
              },
            }}
            bezier
            style={styles.chart}
          />
          <Text style={styles.chartNote}>Weekly growth trajectory based on current parameters</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Performance Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <FontAwesome5 name="chart-line" size={18} color="#118AB2" />
              <Text style={styles.detailLabel}>Growth Rate:</Text>
            </View>
            <Text style={styles.detailValue}>{results.growth_rate.toFixed(2)} g/day</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <MaterialIcons name="track-changes" size={18} color="#118AB2" />
              <Text style={styles.detailLabel}>Survival Rate:</Text>
            </View>
            <Text style={styles.detailValue}>{results.survival_rate.toFixed(2)}%</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <FontAwesome5 name="weight" size={16} color="#118AB2" />
              <Text style={styles.detailLabel}>Expected Yield:</Text>
            </View>
            <Text style={styles.detailValue}>{results.yield.toFixed(2)} kg/ha</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <MaterialCommunityIcons name="food" size={18} color="#118AB2" />
              <Text style={styles.detailLabel}>Feed Conversion Ratio:</Text>
            </View>
            <Text style={styles.detailValue}>{results.fcr.toFixed(2)}</Text>
          </View>
          
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recommendations</Text>
            <View style={styles.recommendationItem}>
              <MaterialIcons name="lightbulb-outline" size={20} color="#06D6A0" />
              <Text style={styles.recommendationItemText}>
                {results.dissolved_oxygen < 4 ? 
                  "Increase aeration to improve oxygen levels." : 
                  "Maintain current aeration practices."}
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <MaterialIcons name="lightbulb-outline" size={20} color="#06D6A0" />
              <Text style={styles.recommendationItemText}>
                {results.ammonia > 0.2 || results.nitrite > 0.1 ? 
                  "Improve water exchange to reduce nitrogen compounds." : 
                  "Current water quality management is effective."}
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <MaterialIcons name="lightbulb-outline" size={20} color="#06D6A0" />
              <Text style={styles.recommendationItemText}>
                {results.fcr > 2.0 ? 
                  "Review feeding strategy to improve FCR." : 
                  "Current feeding strategy is efficient."}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.modifyButton} 
            onPress={() => setActiveTab('form')}
          >
            <LinearGradient
              colors={['#3DAFD5', '#118AB2']}
              style={styles.buttonGradient}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Modify Parameters</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.newPredictionButton} 
            onPress={handleReset}
          >
            <LinearGradient
              colors={['#39E8B0', '#06D6A0']}
              style={styles.buttonGradient}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>New Analysis</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {predictionHistory.length > 0 && (
  <View style={styles.resultsHistoryContainer}>
    <View style={styles.historyHeader}>
      <Text style={styles.historySectionTitle}>Recent Predictions</Text>
      <TouchableOpacity onPress={clearPredictionHistory} style={styles.clearHistoryButton}>
        <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
        <Text style={styles.clearHistoryText}>Clear History</Text>
      </TouchableOpacity>
    </View>
    
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.historyScrollView}
      contentContainerStyle={styles.historyScrollContent}
    >
      {predictionHistory.map((prediction, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.historyCard}
          onPress={() => {
            setParams(prediction.params);
            setResults(prediction.results);
          }}
        >
          <View style={[
            styles.historyColorBadge, 
            {backgroundColor: getSuitabilityColor(prediction.results.pond_suitability_label)[0]}
          ]} />
          <Text style={styles.historyTitle}>{prediction.results.pond_suitability_label}</Text>
          <Text style={styles.historyScore}>Score: {prediction.results.pond_suitability_score.toFixed(1)}</Text>
          <Text style={styles.historyDate}>{prediction.timestamp}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}
      </Animated.ScrollView>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#073B4C" />
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <LinearGradient
  colors={['#073B4C', '#06D6A0']} // Updated to blue-teal gradient
  style={styles.header}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
            <View style={styles.headerContent}>
              {navigation && (
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
              )}
              <Text style={styles.headerTitle}>Upcheck Pond Analyzer</Text>
              <View style={styles.headerIconPlaceholder} />
            </View>
          </LinearGradient>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'form' && styles.activeTab]}
              onPress={() => setActiveTab('form')}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={activeTab === 'form' ? '#118AB2' : '#8D99AE'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'form' && styles.activeTabText,
                ]}
              >
                Parameters
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'results' && styles.activeTab,
                !results && styles.disabledTab,
              ]}
              onPress={() => results && setActiveTab('results')}
              disabled={!results}
            >
              <Ionicons
                name="analytics-outline"
                size={22}
                color={
                  activeTab === 'results' && results
                    ? '#118AB2'
                    : '#8D99AE'
                }
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'results' && styles.activeTabText,
                  !results && styles.disabledTabText,
                ]}
              >
                Results
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'form' ? renderForm() : renderResults()}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    keyboardAvoid: {
      flex: 1,
    },
    header: {
      height: 70, // Increased height for better visibility
      paddingHorizontal: 16,
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 5, // Added padding for better spacing
    },
    backButton: {
      padding: 8, // Increased touch target
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
    },
    headerIconPlaceholder: {
      width: 40, // Increased width for better balance
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      paddingVertical: 4, // Added padding for better spacing
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      gap: 8,
    },
    activeTab: {
      borderBottomWidth: 3, // Thicker border for active tab
      borderBottomColor: '#06D6A0', // Changed to teal
    },
    disabledTab: {
      opacity: 0.6,
    },
    tabText: {
      fontSize: 15, // Slightly larger font
      color: '#8D99AE',
    },
    activeTabText: {
      fontWeight: '600',
      color: '#06D6A0', // Changed to teal
    },
    disabledTabText: {
      color: '#CACFD6',
    },
    formContainer: {
      flex: 1,
      padding: 16,
      paddingBottom: 120, // Added extra padding at bottom to avoid cut-off
    },
    sectionTitle: {
      fontSize: 20, // Slightly larger font
      fontWeight: 'bold',
      color: '#073B4C',
      marginTop: 12,
      marginBottom: 6,
    },
    sectionSubtitle: {
      fontSize: 15, // Slightly larger font
      color: '#8D99AE',
      marginBottom: 20, // Increased spacing
    },
    inputRow: {
      marginBottom: 18, // Increased spacing between inputs
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8, // Increased spacing
    },
    inputLabel: {
      fontSize: 15, // Slightly larger font
      color: '#495057',
      marginLeft: 8,
      flex: 1,
    },
    input: {
      backgroundColor: '#fff',
      height: 48, // Increased height for better touch targets
      borderRadius: 10, // More rounded corners
      paddingHorizontal: 14,
      fontSize: 16, // Slightly larger font
      borderWidth: 1,
      borderColor: '#DEE2E6',
    },
    infoButton: {
      padding: 6, // Increased touch target
    },
    tooltipText: {
      fontSize: 14,
      color: '#fff',
      padding: 6,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: 28,
    },
    predictButton: {
      flex: 2,
      height: 56, // Increased height for better touch targets
      borderRadius: 12, // More rounded corners
      overflow: 'hidden',
    },
    buttonGradient: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      gap: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 17, // Slightly larger font
      fontWeight: 'bold',
    },
    resetButton: {
      flex: 1,
      height: 56, // Increased height for better touch targets
      borderRadius: 12, // More rounded corners
      backgroundColor: '#EDF2F4',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 14,
      gap: 8,
    },
    resetButtonText: {
      color: '#073B4C',
      fontSize: 15, // Slightly larger font
      fontWeight: '500',
    },
    apiLinkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      gap: 8,
      marginBottom: 6, // Added margin
    },
    apiLinkText: {
      fontSize: 14,
      color: '#8D99AE',
      textDecorationLine: 'underline',
    },
    apiUrlContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20, // Increased spacing
      gap: 10,
    },
    apiUrlInput: {
      flex: 1,
      backgroundColor: '#fff',
      height: 48, // Increased height for better touch targets
      borderRadius: 10, // More rounded corners
      paddingHorizontal: 14,
      fontSize: 15,
      borderWidth: 1,
      borderColor: '#DEE2E6',
    },
    apiUrlButton: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      backgroundColor: '#06D6A0', // Changed to teal
      borderRadius: 8,
    },
    apiUrlButtonText: {
      color: '#fff',
      fontWeight: '500',
    },
    historyContainer: {
        marginTop: 20,
        marginBottom: 30,
      },
      resultsHistoryContainer: {
        marginTop: 20,
        marginBottom: 30,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 18,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
    historySectionTitle: {
      fontSize: 18, // Slightly larger font
      fontWeight: 'bold',
      color: '#073B4C',
      marginBottom: 14,
    },
    historyScrollView: {
      paddingBottom: 10,
    },
    historyCard: {
      width: 150, // Slightly wider cards
      backgroundColor: '#fff',
      borderRadius: 14, // More rounded corners
      padding: 14,
      marginRight: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    historyColorBadge: {
      width: 30, // Wider badge
      height: 6,
      borderRadius: 3,
      marginBottom: 8,
    },
    historyTitle: {
      fontSize: 15, // Slightly larger font
      fontWeight: 'bold',
      color: '#073B4C',
      marginBottom: 6,
    },
    historyScore: {
      fontSize: 13, // Slightly larger font
      color: '#495057',
      marginBottom: 10,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
      },
    historyDate: {
      fontSize: 11, // Slightly larger font
      color: '#8D99AE',
    },
    historySectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#073B4C',
      },
      clearHistoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        gap: 4,
      },
      clearHistoryText: {
        fontSize: 14,
        color: '#FF6B6B',
        fontWeight: '500',
      },
      historyScrollView: {
        marginBottom: 10,
      },
      historyScrollContent: {
        paddingRight: 16,
        paddingBottom: 10,
      },
      historyCard: {
        width: 150,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        marginRight: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    resultsContainer: {
      flex: 1,
      padding: 16,
      paddingBottom: 100, // Add extra padding at bottom
    },
    resultHeaderContainer: {
      backgroundColor: '#fff',
      borderRadius: 14, // More rounded corners
      padding: 18, // More padding
      marginBottom: 18,
      elevation: 3, // Slightly more elevation
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    suitabilityBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 14,
    },
    suitabilityText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    scoreText: {
      fontSize: 24, // Larger font
      fontWeight: 'bold',
      color: '#073B4C',
      marginBottom: 10,
    },
    recommendationText: {
      fontSize: 15, // Slightly larger font
      color: '#495057',
      lineHeight: 22,
    },
    chartContainer: {
      backgroundColor: '#fff',
      borderRadius: 14, // More rounded corners
      padding: 18, // More padding
      marginBottom: 18,
      elevation: 3, // Slightly more elevation
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    chartTitle: {
      fontSize: 18, // Larger font
      fontWeight: 'bold',
      color: '#073B4C',
      marginBottom: 14,
    },
    chart: {
      borderRadius: 10, // More rounded corners
      marginVertical: 10,
    },
    chartNote: {
      fontSize: 13, // Slightly larger font
      color: '#8D99AE',
      textAlign: 'center',
      marginTop: 10,
    },
    detailsContainer: {
      backgroundColor: '#fff',
      borderRadius: 14, // More rounded corners
      padding: 18, // More padding
      marginBottom: 18,
      elevation: 3, // Slightly more elevation
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    detailsTitle: {
      fontSize: 18, // Larger font
      fontWeight: 'bold',
      color: '#073B4C',
      marginBottom: 18,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12, // More padding
      borderBottomWidth: 1,
      borderBottomColor: '#EDF2F4',
    },
    detailLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    detailLabel: {
      fontSize: 15, // Slightly larger font
      color: '#495057',
    },
    detailValue: {
      fontSize: 15, // Slightly larger font
      fontWeight: '600',
      color: '#073B4C',
    },
    recommendationsContainer: {
      marginTop: 20,
    },
    recommendationsTitle: {
      fontSize: 18, // Larger font
      fontWeight: 'bold',
      color: '#073B4C',
      marginBottom: 14,
    },
    recommendationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 10, // More padding
      gap: 10,
    },
    recommendationItemText: {
      flex: 1,
      fontSize: 15, // Slightly larger font
      color: '#495057',
      lineHeight: 22,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      marginBottom: 30, // More margin
      gap: 14,
    },
    modifyButton: {
      flex: 1,
      height: 56, // Taller button
      borderRadius: 12, // More rounded corners
      overflow: 'hidden',
    },
    newPredictionButton: {
      flex: 1,
      height: 56, // Taller button
      borderRadius: 12, // More rounded corners
      overflow: 'hidden',
    }
  });

  export default PondPerformanceScreen;