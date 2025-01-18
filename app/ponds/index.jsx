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
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

// Custom Floating Action Button
const CustomFAB = ({ onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <MatIcon name={icon} size={28} color="#fff" />
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

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonItem} />
      <View style={styles.skeletonItem} />
      <View style={styles.skeletonItem} />
    </View>
  );
};

const PondsScreen = () => {
  const [ponds, setPonds] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedPonds, setSelectedPonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPondsAndFarms();
  }, []);

  const fetchPondsAndFarms = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const storedPonds = await AsyncStorage.getItem('ponds');
      const storedFarms = await AsyncStorage.getItem('farms');

      if (storedPonds) {
        const parsedPonds = JSON.parse(storedPonds);
        const pondsWithId = Object.keys(parsedPonds).map((key) => ({
          id: key,
          ...parsedPonds[key],
        }));
        setPonds(pondsWithId);
      } else {
        setPonds([]);
      }

      if (storedFarms) {
        const parsedFarms = JSON.parse(storedFarms);
        setFarms(parsedFarms);
      } else {
        setFarms([]);
      }
    } catch (error) {
      console.log('Error fetching ponds and farms', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
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
    setSelectedPonds([]);

    await AsyncStorage.setItem('ponds', JSON.stringify(updatedPonds));
    await AsyncStorage.setItem('farms', JSON.stringify([...farms, newFarm]));

    Alert.alert('Farm created successfully!');
  };

  const renderPondItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.pondItem, selectedPonds.includes(item) && styles.selectedPond]}
      onLongPress={() => handlePondSelect(item)}
    >
      <Text style={styles.pondText}>{item.name}</Text>
      <Text style={styles.pondDetailText}>Pond ID: {item.id}</Text>
      <Text style={styles.pondDetailText}>Owner: {item.owner_email}</Text>
      <Text style={styles.pondDetailText}>Cultivation: {item.type}</Text>
      <Text style={styles.pondDetailText}>Stocking Density: {item.stockingDensity} per m²</Text>
      <Text style={styles.pondDetailText}>Area: {item.area} m²</Text>
      <Text style={styles.pondDetailText}>Depth: {item.depth} m</Text>
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

  const handleRefresh = () => {
    fetchPondsAndFarms();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('(tabs)/profile')} style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#1e88e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ponds Management</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Icon name="refresh" size={28} color="#1e88e5" />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>My Farms</Text>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <FlatList
            data={farms}
            renderItem={renderFarmItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text>No farms created yet.</Text>}
          />
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>My Ponds</Text>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <FlatList
            data={ponds}
            renderItem={renderPondItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text>No ponds available.</Text>}
          />
        )}
      </View>

      {/* Add Pond FAB */}
      <CustomAddPondFAB icon="add" onPress={() => { router.push('/addpond'); }} />
      {/* Grouping FAB, always visible */}
      <CustomFAB icon="arrow-collapse" onPress={groupPondsIntoFarm} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backButton: {
    padding: 0,
  },
  pondItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 4,
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
    fontWeight: 'bold',
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
    backgroundColor: '#1e88e5',
    borderRadius: 50,
    padding: 16,
    elevation: 6,
  },
  addPondFab: {
    position: 'absolute',
    right: 16,
    bottom: 90,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 16,
    elevation: 6,
  },
  skeletonContainer: {
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  skeletonItem: {
    height: 60,
    backgroundColor: '#e0e0e0',
    marginBottom: 12,
    borderRadius: 4,
  },
});

export default PondsScreen;