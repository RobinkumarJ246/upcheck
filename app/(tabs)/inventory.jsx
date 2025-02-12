import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  TextInput
} from 'react-native';
import { Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import TopBar from '../../components/TopBar';
import { SvgXml } from 'react-native-svg';

const InventoryManagement = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Starter Feed', count: 1.0, category: 'non-veg' },
    { id: '2', name: 'Grower Feed', count: 0.5, category: 'veg' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('Starter Feed');
  const [customFeedName, setCustomFeedName] = useState('');
  const [newItemCount, setNewItemCount] = useState('1.0');
  const [newItemCategory, setNewItemCategory] = useState('non-veg');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const getIconContainerStyle = (category) => ({
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: category === 'veg' ? 'green' : 'red',
  });

  const addItem = () => {
    const itemName = newItemName === 'Other' ? customFeedName : newItemName;
    if (!itemName) {
      Alert.alert('Error', 'Please provide a feed name');
      return;
    }
    const newItem = {
      id: isEditing ? selectedItemId : Math.random().toString(),
      name: itemName,
      count: parseFloat(newItemCount),
      category: newItemCategory,
    };

    if (isEditing) {
      setItems((prevItems) => prevItems.map((item) => (item.id === selectedItemId ? newItem : item)));
    } else {
      setItems((prevItems) => [...prevItems, newItem]);
    }
    resetForm();
  };

  const editItem = (item) => {
    setNewItemName(item.name);
    setCustomFeedName(item.name);
    setNewItemCount(item.count.toString());
    setNewItemCategory(item.category);
    setSelectedItemId(item.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const resetForm = () => {
    setNewItemName('Starter Feed');
    setCustomFeedName('');
    setNewItemCount('1.0');
    setNewItemCategory('non-veg');
    setModalVisible(false);
    setIsEditing(false);
    setSelectedItemId(null);
  };

  const shrimpSvg = `
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff">
      <path fill="#ffffff" d="M376.4 19.14c-24.4-.17-55.5 6.54-89 13.02-33.4 6.48-68.9 12.8-100.2 12.56-31.2-.24-57.4-6.91-74.6-24.83L99.67 32.35C128 59.39 166 63.49 200.2 62.49c-8.4 1.48-17.2 2.59-26.1 3.21-36.7 2.54-75.23-2.61-92.58-13.15l-9.34 15.38C96.57 82.72 136.4 86.36 175.3 83.65c38.6-2.68 75.7-11.02 94.7-29.9 7.1-1.28 14.1-2.59 20.9-3.92 33.6-6.51 64.5-12.84 85.3-12.69 10.5.1 18 1.91 21.9 4.57 2.3 1.53 3.9 3.15 4.8 5.78h18.3c-1.7-8.79-6.3-16.19-13-20.74-8.8-5.86-19.6-7.52-31.8-7.61zm51.7 46.1c-44.9-.24-134 8.46-209.4 29.2 1.1-.11 2.2-.17 3.3-.17 18.1 0 33 14.93 33 33.03s-14.9 33-33 33-33-14.9-33-33c0-13 7.7-24.3 18.7-29.71-27.9 8.31-53.4 18.31-73.4 30.21 51.7 27.3 77.4 63 99.9 97.3 73.4-20.4 119.8-42.8 174.9-95.9-24.1 5.9-35.3 6.5-56.2 5.7 28.1-10.5 97-43.23 118.7-55.9-29.4 2.28-74.5 12.38-100.9 18.44 14.9-13.43 51.3-28.42 64.4-32.08-2.2-.1-4.5-.1-7-.12zM222 112.3c-8.4 0-15 6.6-15 15s6.6 15 15 15 15-6.6 15-15-6.6-15-15-15zm-120.5 20.2c-17.58 26.8-31.42 52.3-41.44 76.2 25.1 34.2 57.14 63.2 115.54 80.3 10-17.5 24.4-35.6 43-54.6-25.3-38.9-51.8-75.5-117.1-101.9zm-48.93 96c-12.03 35.4-15.18 67.4-9.37 96.1 32.35 23.5 59.1 38.1 115.5 25.9-1-14.5 1.9-29.6 8.7-45.3-54.9-16.7-89.29-44.9-114.83-76.7zM231 247.2c-4.5 4.6-8.7 9.1-12.6 13.6 31.6 17.7 54.7 38.7 77.8 70.8l14.6-10.6c-23.4-32.4-48-55.2-79.8-73.8zm-28.3 32.9c-3.8 5.2-7.2 10.3-10.1 15.3 8.6 3.6 21.7 10.7 33.8 19 15 10.4 28.9 23.4 33.6 32.6l16-8.4c-7.7-14.6-23.2-27.7-39.3-38.9-11.9-8.3-23.8-15.1-34-19.6zm-20.1 35.5c-2.5 6.2-4.1 12.2-5.1 17.9 4.7 1 12.9 4 20.8 9.1 10.7 7.1 21.5 17.3 27 26.1l15.2-9.6c-7.6-12-19.7-23.2-32.3-31.5-8.6-5.6-17-10.4-25.6-12zM52 352.1c15.4 34.5 46.57 64.6 95.2 89.5 11.6-1 20.9-2.1 28.7-5.9 6.9-3.4 13.3-9 19.9-20.9-16.9-13.7-28.4-29.2-33.8-46.7-49.2 10.4-81.56.9-110-16zm370.1 72.6c-10.4-.1-43.1 4.2-75.8 11-23.5 5-47.6 11.5-64.9 18 11.7-3.1 25.8-4.3 41.3-4.7 6.1-.2 12.5-.2 18.9-.1 19.2.4 39.2 2.2 57 4.8 12.3 1.9 23.4 3.9 32.9 6.5 6.9-8.3 12.4-18.2 12.9-24.1.5-10.9-16.7-11.3-22.3-11.4zm-211.7.7c-9.7 14.2-19.1 24.7-34.1 29.5 21.2 8.8 44.9 16.8 71.4 24 8.3-7.3 16-17.2 14.3-27.7-19.8-7.8-37.1-16.3-51.6-25.8zm63.3 50.9l-9.2 8.3c13.3 4 34.8 9 59.2 8.2 36.3-1.3 84.3 2.2 114.8-10.5-48.8-12.3-126.4-27.6-164.8-6z"/>
    </svg>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title={'Inventory'} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
              <View style={getIconContainerStyle(item.category)}>
              <SvgXml xml={shrimpSvg} width={20} height={20} />
              </View>
            <Text style={styles.itemName}>{item.name} - {item.count} kg</Text>
            <TouchableOpacity style={styles.optionsButton} onPress={() => editItem(item)}>
              <Ionicons name="ellipsis-vertical" size={20} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Feed Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={resetForm}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Feed' : 'Add Feed'}</Text>

            <Picker selectedValue={newItemName} onValueChange={(value) => setNewItemName(value)}>
              <Picker.Item label="Starter Feed" value="Starter Feed" />
              <Picker.Item label="Grower Feed" value="Grower Feed" />
              <Picker.Item label="Finisher Feed" value="Finisher Feed" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
            {newItemName === 'Other' && (
              <TextInput style={styles.input} placeholder="Enter Feed Name" value={customFeedName} onChangeText={setCustomFeedName} />
            )}

            {/* Feed Weight Section */}
            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={() => setNewItemCount((prev) => (Math.max(parseFloat(prev) - 0.1, 0)).toFixed(1))} style={styles.counterButton}>
                <Text style={styles.counterText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.countInput}
                keyboardType="numeric"
                value={newItemCount}
                onChangeText={setNewItemCount}
              />
              <TouchableOpacity onPress={() => setNewItemCount((prev) => (parseFloat(prev) + 0.1).toFixed(1))} style={styles.counterButton}>
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Category Selection */}
            <View style={styles.radioContainer}>
              <TouchableOpacity style={[styles.radioButton, newItemCategory === 'veg' && styles.radioSelected]} onPress={() => setNewItemCategory('veg')}>
                <Text style={styles.radioText}>Veg</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.radioButton, newItemCategory === 'non-veg' && styles.radioSelected]} onPress={() => setNewItemCategory('non-veg')}>
                <Text style={styles.radioText}>Non-Veg</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <Text style={styles.buttonText}>{isEditing ? 'Save Changes' : 'Add Feed'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', margin: 5, borderRadius: 10 },
  itemName: { fontSize: 16, flex: 1, marginLeft: 10 },
  optionsButton: { padding: 10 },
  fab: { position: 'absolute', bottom: 40, right: 25, backgroundColor: '#007BFF', borderRadius: 50, padding: 15 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 5 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  counterButton: { padding: 10, backgroundColor: '#ddd', borderRadius: 5 },
  countInput: { width: 60, textAlign: 'center', fontSize: 18, borderBottomWidth: 1 },
  radioContainer: { flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 },
  radioButton: { padding: 10, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  radioSelected: { backgroundColor: '#007BFF' },
  addButton: { backgroundColor: '#007BFF', padding: 10, alignItems: 'center', borderRadius: 5 },
  closeButton: { backgroundColor: '#FF3D00', padding: 10, alignItems: 'center', borderRadius: 5, marginTop: 10 },
});

export default InventoryManagement;
