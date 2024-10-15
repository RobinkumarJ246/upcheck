import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';  // Correct hook

const FarmDetails = () => {
  const { farmId } = useLocalSearchParams();  // Use useLocalSearchParams to get farmId
  const [farm, setFarm] = useState(null);

  useEffect(() => {
    if (farmId) {
      fetchFarm();
    }
  }, [farmId]);

  const fetchFarm = async () => {
    try {
      const storedFarms = await AsyncStorage.getItem('farms');
      if (storedFarms) {
        const parsedFarms = JSON.parse(storedFarms);
        const farmData = parsedFarms.find(f => f.id === farmId);
        setFarm(farmData);
      }
    } catch (error) {
      console.log('Error fetching farm details', error);
    }
  };

  if (!farm) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Farm not found</Text>
      </View>
    );
  }

  const renderPondItem = ({ item }) => (
    <View style={styles.pondItem}>
      <Text style={styles.pondText}>Pond Name: {item.name}</Text>
      <Text style={styles.pondDetailText}>Pond ID: {item.id}</Text>
      <Text style={styles.pondDetailText}>Cultivation: {item.type}</Text>
      <Text style={styles.pondDetailText}>Stocking Density: {item.stockingDensity} per m²</Text>
      <Text style={styles.pondDetailText}>Area: {item.area} m²</Text>
      <Text style={styles.pondDetailText}>Depth: {item.depth} m</Text>
      <Text style={styles.pondDetailText}>Owner: {item.username}</Text>
      <Text style={styles.pondDetailText}>Culture Start Date: {item.cultureStartDate}</Text>
      <Text style={styles.pondDetailText}>Location: {item.location}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Farm: {farm.name}</Text>
      <FlatList
        data={farm.ponds}
        renderItem={renderPondItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pondItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pondText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pondDetailText: {
    fontSize: 14,
    color: '#555',
  },
});

export default FarmDetails;