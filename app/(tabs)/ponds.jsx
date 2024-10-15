import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'expo-router'; // Removed useTheme
import { useRouter } from 'expo-router';

// Custom Floating Action Button
const CustomFAB = ({ onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Icon name={icon} size={28} color="#fff" />
    </TouchableOpacity>
  );
};

const CustomAddPondFAB = ({ onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.addPondFab} onPress={onPress}>
      <Icon name={icon} size={28} color="#fff" />
    </TouchableOpacity>
  );
};

const PondsScreen = () => {
  const [ponds, setPonds] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedPonds, setSelectedPonds] = useState([]);
  const router = useRouter();

  // Fetch ponds and farms from AsyncStorage
  useEffect(() => {
    fetchPondsAndFarms();
  }, []);

  const fetchPondsAndFarms = async () => {
    try {
      const storedPonds = await AsyncStorage.getItem('ponds');
      const storedFarms = await AsyncStorage.getItem('farms');

      if (storedPonds) {
        const parsedPonds = JSON.parse(storedPonds);
        setPonds(Object.values(parsedPonds));
      }

      if (storedFarms) {
        const parsedFarms = JSON.parse(storedFarms);
        setFarms(parsedFarms);
      }
    } catch (error) {
      console.log('Error fetching ponds and farms', error);
    }
  };

  const handlePondSelect = (pond) => {
    if (selectedPonds.includes(pond)) {
      setSelectedPonds(selectedPonds.filter((p) => p !== pond));
    } else {
      setSelectedPonds([...selectedPonds, pond]);
    }
  };

  const groupPondsIntoFarm = async () => {
    if (selectedPonds.length < 2) {
      Alert.alert('Oops!', 'Select at least 2 ponds to group into a farm.');
      return;
    }

    const newFarm = {
      id: Date.now().toString(),
      name: `Farm ${farms.length + 1}`,
      ponds: selectedPonds,
    };

    const updatedPonds = ponds.filter((pond) => !selectedPonds.includes(pond));
    setPonds(updatedPonds);
    setFarms([...farms, newFarm]);

    // Clear selection
    setSelectedPonds([]);

    await AsyncStorage.setItem('ponds', JSON.stringify(updatedPonds));
    await AsyncStorage.setItem('farms', JSON.stringify([...farms, newFarm]));

    Alert.alert('Farm created successfully!');
  };

  const renderPondItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.pondItem,
        selectedPonds.includes(item) && styles.selectedPond,
      ]}
      onLongPress={() => handlePondSelect(item)}
    >
      <Text style={styles.pondText}>{item.name}</Text>
      <Text style={styles.pondDetailText}>Pond ID: {item.id}</Text>
      <Text style={styles.pondDetailText}>Cultivation: {item.type}</Text>
      <Text style={styles.pondDetailText}>Stocking Density: {item.stockingDensity} per m²</Text>
      <Text style={styles.pondDetailText}>Area: {item.area} m²</Text>
      <Text style={styles.pondDetailText}>Depth: {item.depth} m</Text>
      <Text style={styles.pondDetailText}>Owner: {item.username}</Text>
      <Text style={styles.pondDetailText}>Culture Start Date: {item.cultureStartDate}</Text>
      <Text style={styles.pondDetailText}>Location: {item.location}</Text>
    </TouchableOpacity>
  );

  const renderFarmItem = ({ item }) => (
    <Link href={`/farm/${item.id}`} asChild>
      <TouchableOpacity style={styles.farmItem}>
        <View style={styles.farmContent}>
          <Text style={styles.farmText}>{item.name}</Text>
          <Icon name="arrow-forward" size={20} />
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>My Farms</Text>
        <FlatList
          data={farms}
          renderItem={renderFarmItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No farms created yet.</Text>}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>My Ponds</Text>
        <FlatList
          data={ponds}
          renderItem={renderPondItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No ponds available.</Text>}
        />
      </View>

      {/* Add Pond FAB */}
      <CustomAddPondFAB icon="add" onPress={() => {router.push('/addpond')}} />
      {/* Grouping FAB, always visible */}
      <CustomFAB icon="group" onPress={groupPondsIntoFarm} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    marginTop: 30,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  selectedPond: {
    backgroundColor: '#cfe9ff',
  },
  pondText: {
    fontSize: 16,
  },
  pondDetailText: {
    fontSize: 14,
    color: '#555',
  },
  farmItem: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  farmContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmText: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 60,
    height: 60,
    backgroundColor: '#1e88e5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  addPondFab: {
    position: 'absolute',
    right: 16,
    bottom: 90, // Adjust this value to create space between the two FABs
    width: 60,
    height: 60,
    backgroundColor: '#1e88e5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default PondsScreen;