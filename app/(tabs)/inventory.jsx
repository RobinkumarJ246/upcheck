import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';

const InventoryManagement = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Fish meal', count: 1, unit: 'kg', type: 'non-veg' },
    { id: '2', name: 'Soybean meal', count: 1, unit: 'kg', type: 'veg' },
    { id: '3', name: 'Corn', count: 500, unit: 'g', type: 'veg' },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemCount, setNewItemCount] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemType, setNewItemType] = useState('veg'); // Default type
  const [modalVisible, setModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemCount, setEditItemCount] = useState('');
  const [editItemUnit, setEditItemUnit] = useState('');
  const [editItemType, setEditItemType] = useState('veg'); // Default type for edit
  const [isEditing, setIsEditing] = useState(false); // New state to track if editing

  const addItem = () => {
    if (!newItemName || !newItemCount || !newItemUnit) {
      Alert.alert('Error', 'Please provide all item details');
      return;
    }

    const newItem = {
      id: Math.random().toString(),
      name: newItemName,
      count: parseInt(newItemCount),
      unit: newItemUnit,
      type: newItemType,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    resetForm();
  };

  const removeItem = (itemId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
            setSelectedItemId(null); // Reset selected item after deletion
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const editItem = () => {
    if (!editItemName || !editItemCount || !editItemUnit || !selectedItemId) {
      Alert.alert('Error', 'Please select an item and provide new details');
      return;
    }

    const updatedItems = items.map((item) =>
      item.id === selectedItemId
        ? { ...item, name: editItemName, count: parseInt(editItemCount), unit: editItemUnit, type: editItemType }
        : item
    );
    setItems(updatedItems);
    resetForm();
  };

  const selectItemForEdit = (itemId) => {
    const selectedItem = items.find((item) => item.id === itemId);
    setSelectedItemId(itemId);
    setEditItemName(selectedItem.name);
    setEditItemCount(selectedItem.count.toString());
    setEditItemUnit(selectedItem.unit);
    setEditItemType(selectedItem.type); // Set the type for editing
    setIsEditing(true); // Set editing mode
    setModalVisible(true); // Open modal for editing
    setOptionsModalVisible(false); // Close options modal
  };

  const openOptionsModal = (itemId) => {
    setSelectedItemId(itemId);
    setOptionsModalVisible(true); // Open the options modal
  };

  const resetForm = () => {
    setNewItemName('');
    setNewItemCount('');
    setNewItemUnit('');
    setNewItemType('veg'); // Reset type
    setSelectedItemId(null);
    setEditItemName('');
    setEditItemCount('');
    setEditItemUnit('');
    setEditItemType('veg'); // Reset type for edit
    setIsEditing(false); // Reset editing state
    setModalVisible(false); // Close modal
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title={'Inventory'} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemText}>
              {item.type === 'veg' ? (
                <Ionicons style={styles.icon} name="leaf" size={20} color="green" />
              ) : (
                <Ionicons style={styles.icon} name="fish" size={20} color="red" />
              )}
              <Text>
                {item.name} - {item.count} {item.unit}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => openOptionsModal(item.id)}
            >
              <Text style={styles.optionButtonText}>Options</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => { setModalVisible(true); setIsEditing(false); }} // Reset editing state when adding
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Item Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isEditing ? (
              <View>
                <Text style={styles.modalTitle}>Edit Item</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Item Name"
                  value={editItemName}
                  onChangeText={setEditItemName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Item Count"
                  keyboardType="numeric"
                  value={editItemCount}
                  onChangeText={setEditItemCount}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Item Unit (kg, g, l, ml)"
                  value={editItemUnit}
                  onChangeText={setEditItemUnit}
                />
                <View style={styles.radioContainer}>
                  <TouchableOpacity onPress={() => setEditItemType('veg')}>
                    <Text style={[styles.radioText, editItemType === 'veg' && styles.selectedRadio]}>
                      Veg
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditItemType('non-veg')}>
                    <Text style={[styles.radioText, editItemType === 'non-veg' && styles.selectedRadio]}>
                      Non-Veg
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={editItem}
                >
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.modalTitle}>Add Item</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Item Name"
                  value={newItemName}
                  onChangeText={setNewItemName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Item Count"
                  keyboardType="numeric"
                  value={newItemCount}
                  onChangeText={setNewItemCount}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Item Unit (kg, g, l, ml)"
                  value={newItemUnit}
                  onChangeText={setNewItemUnit}
                />
                <View style={styles.radioContainer}>
                  <TouchableOpacity onPress={() => setNewItemType('veg')}>
                    <Text style={[styles.radioText, newItemType === 'veg' && styles.selectedRadio]}>
                      Veg
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setNewItemType('non-veg')}>
                    <Text style={[styles.radioText, newItemType === 'non-veg' && styles.selectedRadio]}>
                      Non-Veg
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addItem}
                >
                  <Text style={styles.buttonText}>Add Item</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Options Modal */}
      <Modal
        visible={optionsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Options</Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                selectItemForEdit(selectedItemId);
              }}
            >
              <Text style={styles.optionButtonModalText}><Ionicons name="pencil" size={16} style={styles.listIcon} color="black" />Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
    removeItem(selectedItemId);
    setOptionsModalVisible(false); // Call the second function here
  }}
            >
              <Text style={styles.optionButtonModalText}><Ionicons name="trash-bin-outline" size={16} style={styles.listIcon} color="black" />Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  optionsButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 5,
  },
  optionButtonText: {
    color: '#fff',
  },
  optionButtonModalText: {
    color: '#007BFF',
    fontSize: 20,
    //borderTopWidth: 1,
    //borderTopColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 5,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 25,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  radioText: {
    fontSize: 16,
  },
  selectedRadio: {
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF3D00',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  listIcon: {
    marginRight: 5,
  },
  closeButtonText: {
    color: '#fff',
  },
});

export default InventoryManagement;