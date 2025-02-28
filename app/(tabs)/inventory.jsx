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
    TextInput,
    Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import TopBar from '../../components/TopBar'; // Assuming this is a custom component
//import {Svg, Path} from 'react-native-svg';

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
        backgroundColor: category === 'veg' ? '#4CAF50' : '#F44336', // Veg: Green, Non-veg: Red
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
            setItems((prevItems) =>
                prevItems.map((item) => (item.id === selectedItemId ? newItem : item))
            );
        } else {
            setItems((prevItems) => [...prevItems, newItem]);
        }
        resetForm();
    };

    const editItem = (item) => {
        setNewItemName(item.name);
        setCustomFeedName(item.name === 'Starter Feed' || item.name === 'Grower Feed' || item.name === 'Finisher Feed' ? '' : item.name); // if item.name  is any of these values it will show nothing otherwise it will display item name
        setNewItemCount(item.count.toString());
        setNewItemCategory(item.category);
        setSelectedItemId(item.id);
        setIsEditing(true);
        setModalVisible(true);
    };

    const deleteItem = () => {
        Alert.alert(
            'Delete Feed',
            'Are you sure you want to delete this feed?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        setItems((prevItems) => prevItems.filter((item) => item.id !== selectedItemId));
                        resetForm();
                    },
                },
            ],
            { cancelable: false }
        );
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

    const shrimpIcon = require('../../assets/images/shrimp_icon_2.png');

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => editItem(item)}>
            <View style={getIconContainerStyle(item.category)}>
                {item.category === 'veg' ? (
                    <Image source={shrimpIcon} style={styles.shrimpIcon} />

                ) : (
                  <Image source={shrimpIcon} style={styles.shrimpIcon} />
                )}
            </View>
            <Text style={styles.itemName}>{item.name} ({item.count} kg)</Text>
            <TouchableOpacity style={styles.optionsButton} onPress={() => editItem(item)}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="gray" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        
            <SafeAreaView style={styles.safeArea}>
                <TopBar title={'Inventory'} />

            {/* Inventory List */}
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={{ paddingHorizontal: 10 }}
            />

            {/* Add Feed Button */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

            {/* Add/Edit Feed Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={resetForm}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{isEditing ? 'Edit Feed' : 'Add Feed'}</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Feed Type</Text>
                            <Picker
                                selectedValue={newItemName}
                                onValueChange={(value) => setNewItemName(value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Starter Feed" value="Starter Feed" />
                                <Picker.Item label="Grower Feed" value="Grower Feed" />
                                <Picker.Item label="Finisher Feed" value="Finisher Feed" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </View>

                        {newItemName === 'Other' && (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Custom Feed Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Custom Feed Name"
                                    value={customFeedName}
                                    onChangeText={setCustomFeedName}
                                />
                            </View>
                        )}

                        {/* Feed Weight Section */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <View style={styles.counterContainer}>
                                <TouchableOpacity
                                    onPress={() => setNewItemCount((prev) => (Math.max(parseFloat(prev) - 0.1, 0)).toFixed(1))}
                                    style={styles.counterButton}
                                >
                                    <Text style={styles.counterText}>-</Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.countInput}
                                    keyboardType="numeric"
                                    value={newItemCount}
                                    onChangeText={setNewItemCount}
                                />
                                <TouchableOpacity
                                    onPress={() => setNewItemCount((prev) => (parseFloat(prev) + 0.1).toFixed(1))}
                                    style={styles.counterButton}
                                >
                                    <Text style={styles.counterText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Category Selection */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.radioContainer}>
                                <TouchableOpacity
                                    style={[styles.radioButton, newItemCategory === 'veg' && styles.radioSelected]}
                                    onPress={() => setNewItemCategory('veg')}
                                >
                                    <Text style={[styles.radioText, newItemCategory === 'veg' && styles.radioTextSelected]}>Veg</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.radioButton, newItemCategory === 'non-veg' && styles.radioSelected]}
                                    onPress={() => setNewItemCategory('non-veg')}
                                >
                                    <Text style={[styles.radioText, newItemCategory === 'non-veg' && styles.radioTextSelected]}>Non-Veg</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.addButton} onPress={addItem}>
                            <Text style={styles.buttonText}>{isEditing ? 'Save Changes' : 'Add Feed'}</Text>
                        </TouchableOpacity>

                        {isEditing && (
                            <TouchableOpacity style={styles.deleteButton} onPress={deleteItem}>
                                <Text style={styles.buttonText}>Delete Feed</Text>
                            </TouchableOpacity>
                        )}

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
    safeArea: { flex: 1, backgroundColor: '#f9f9f9' }, // Light background
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // for Android shadow
    },
    itemName: { fontSize: 16, flex: 1, marginLeft: 10, color: '#333' },
    optionsButton: { padding: 10 },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#2196F3', // Modern blue
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        elevation: 5,
    },
    modalTitle: { fontSize: 22, fontWeight: '600', marginBottom: 15, color: '#333' },
    inputContainer: { marginBottom: 15 },
    label: { fontSize: 16, fontWeight: '500', color: '#555', marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        color: '#333',
    },
    counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
    counterButton: {
        padding: 12,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        width: 40,
        alignItems: 'center',
    },
    counterText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    countInput: {
        width: 70,
        textAlign: 'center',
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 8,
        color: '#333',
    },
    radioContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 },
    radioButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
    },
    radioSelected: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    radioText: { fontSize: 16, color: '#333' },
    radioTextSelected: { color: '#fff' },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    deleteButton: {
        backgroundColor: '#F44336',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: { fontSize: 18, color: '#fff', fontWeight: '600' },
    closeButton: {
        backgroundColor: '#9E9E9E',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
    },
    shrimpIcon: {
      width: 24,  // Adjust size as needed
      height: 24, // Adjust size as needed
      resizeMode: 'contain', // or 'cover', depending on how you want it to fit
  },
    closeButtonText: { fontSize: 18, color: '#fff', fontWeight: '600' },
});

export default InventoryManagement;