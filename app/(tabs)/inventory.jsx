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
    { id: '1', name: 'Fish meal', count: 1, unit: 'kg', type: 'growth-stage' },
    { id: '2', name: 'Soybean meal', count: 1, unit: 'kg', type: 'initial-stage' },
    { id: '3', name: 'Corn', count: 500, unit: 'g', type: 'initial-stage' },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCount, setNewItemCount] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemType, setNewItemType] = useState('initial-stage');
  const [modalVisible, setModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemCount, setEditItemCount] = useState('');
  const [editItemUnit, setEditItemUnit] = useState('');
  const [editItemType, setEditItemType] = useState('initial-stage');
  const [isEditing, setIsEditing] = useState(false);

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
            setSelectedItemId(null);
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
    setEditItemType(selectedItem.type);
    setIsEditing(true);
    setModalVisible(true);
    setOptionsModalVisible(false);
  };

  const openOptionsModal = (itemId) => {
    setSelectedItemId(itemId);
    setOptionsModalVisible(true);
  };

  const resetForm = () => {
    setNewItemName('');
    setNewItemCount('');
    setNewItemUnit('');
    setNewItemType('initial-stage');
    setSelectedItemId(null);
    setEditItemName('');
    setEditItemCount('');
    setEditItemUnit('');
    setEditItemType('initial-stage');
    setIsEditing(false);
    setModalVisible(false);
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
              {item.type === 'initial-stage' ? (
                <Ionicons style={styles.icon} name="leaf" size={20} color="green" />
              ) : (
                <Ionicons style={styles.icon} name="barbell" size={20} color="orange" />
              )}
              <Text style={styles.itemName}>
                {item.name} - {item.count} {item.unit}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => openOptionsModal(item.id)}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#007BFF" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => { setModalVisible(true); setIsEditing(false); }}
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
                  <TouchableOpacity 
                    style={[styles.radioButton, editItemType === 'initial-stage' && styles.radioButtonSelected]}
                    onPress={() => setEditItemType('initial-stage')}
                  >
                    <Text style={styles.radioText}>Initial Stage Feed</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.radioButton, editItemType === 'growth-stage' && styles.radioButtonSelected]}
                    onPress={() => setEditItemType('growth-stage')}
                  >
                    <Text style={styles.radioText}>Growth Stage Feed</Text>
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
                  <TouchableOpacity 
                    style={[styles.radioButton, newItemType === 'initial-stage' && styles.radioButtonSelected]}
                    onPress={() => setNewItemType('initial-stage')}
                  >
                    <Text style={styles.radioText}>Initial Stage Feed</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.radioButton, newItemType === 'growth-stage' && styles.radioButtonSelected]}
                    onPress={() => setNewItemType('growth-stage')}
                  >
                    <Text style={styles.radioText}>Growth Stage Feed</Text>
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
                setOptionsModalVisible(false);
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
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  optionsButton: {
    padding: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 25,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  radioButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#FF3D00',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionButtonModalText: {
    color: '#007BFF',
    fontSize: 16,
    marginVertical: 10,
  },
  listIcon: {
    marginRight: 5,
  },
});

export default InventoryManagement;