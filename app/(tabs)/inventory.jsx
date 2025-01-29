import React, { useState } from "react"
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
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import TopBar from "../../components/TopBar"

const InventoryManagement = () => {
  const [items, setItems] = useState([
    { id: "1", name: "Fish meal", count: 1, unit: "kg", type: "non-veg" },
    { id: "2", name: "Soybean meal", count: 1, unit: "kg", type: "veg" },
    { id: "3", name: "Corn", count: 500, unit: "g", type: "veg" },
  ])

  const [newItemName, setNewItemName] = useState("")
  const [newItemCount, setNewItemCount] = useState("")
  const [newItemUnit, setNewItemUnit] = useState("")
  const [newItemType, setNewItemType] = useState("veg")
  const [modalVisible, setModalVisible] = useState(false)
  const [optionsModalVisible, setOptionsModalVisible] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [editItemName, setEditItemName] = useState("")
  const [editItemCount, setEditItemCount] = useState("")
  const [editItemUnit, setEditItemUnit] = useState("")
  const [editItemType, setEditItemType] = useState("veg")
  const [isEditing, setIsEditing] = useState(false)

  const addItem = () => {
    if (!newItemName || !newItemCount || !newItemUnit) {
      Alert.alert("Error", "Please provide all item details")
      return
    }

    const newItem = {
      id: Math.random().toString(),
      name: newItemName,
      count: Number.parseInt(newItemCount),
      unit: newItemUnit,
      type: newItemType,
    }

    setItems((prevItems) => [...prevItems, newItem])
    resetForm()
  }

  const removeItem = (itemId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
            setSelectedItemId(null)
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  const editItem = () => {
    if (!editItemName || !editItemCount || !editItemUnit || !selectedItemId) {
      Alert.alert("Error", "Please select an item and provide new details")
      return
    }

    const updatedItems = items.map((item) =>
      item.id === selectedItemId
        ? { ...item, name: editItemName, count: Number.parseInt(editItemCount), unit: editItemUnit, type: editItemType }
        : item,
    )
    setItems(updatedItems)
    resetForm()
  }

  const selectItemForEdit = (itemId) => {
    const selectedItem = items.find((item) => item.id === itemId)
    setSelectedItemId(itemId)
    setEditItemName(selectedItem.name)
    setEditItemCount(selectedItem.count.toString())
    setEditItemUnit(selectedItem.unit)
    setEditItemType(selectedItem.type)
    setIsEditing(true)
    setModalVisible(true)
    setOptionsModalVisible(false)
  }

  const openOptionsModal = (itemId) => {
    setSelectedItemId(itemId)
    setOptionsModalVisible(true)
  }

  const resetForm = () => {
    setNewItemName("")
    setNewItemCount("")
    setNewItemUnit("")
    setNewItemType("veg")
    setSelectedItemId(null)
    setEditItemName("")
    setEditItemCount("")
    setEditItemUnit("")
    setEditItemType("veg")
    setIsEditing(false)
    setModalVisible(false)
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        {item.type === "veg" ? (
          <Ionicons name="leaf" size={24} color="#4CAF50" style={styles.itemIcon} />
        ) : (
          <Ionicons name="fish" size={24} color="#FF5722" style={styles.itemIcon} />
        )}
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            {item.count} {item.unit}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.optionsButton} onPress={() => openOptionsModal(item.id)}>
        <Ionicons name="ellipsis-vertical" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title={"Inventory"} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setModalVisible(true)
          setIsEditing(false)
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={resetForm}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? "Edit Item" : "Add Item"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={isEditing ? editItemName : newItemName}
              onChangeText={isEditing ? setEditItemName : setNewItemName}
            />
            <TextInput
              style={styles.input}
              placeholder="Item Count"
              keyboardType="numeric"
              value={isEditing ? editItemCount : newItemCount}
              onChangeText={isEditing ? setEditItemCount : setNewItemCount}
            />
            <TextInput
              style={styles.input}
              placeholder="Item Unit (kg, g, l, ml)"
              value={isEditing ? editItemUnit : newItemUnit}
              onChangeText={isEditing ? setEditItemUnit : setNewItemUnit}
            />
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={[styles.radioButton, (isEditing ? editItemType : newItemType) === "veg" && styles.selectedRadio]}
                onPress={() => (isEditing ? setEditItemType("veg") : setNewItemType("veg"))}
              >
                <Ionicons
                  name="leaf"
                  size={24}
                  color={(isEditing ? editItemType : newItemType) === "veg" ? "#fff" : "#4CAF50"}
                />
                <Text
                  style={[
                    styles.radioText,
                    (isEditing ? editItemType : newItemType) === "veg" && styles.selectedRadioText,
                  ]}
                >
                  Veg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  (isEditing ? editItemType : newItemType) === "non-veg" && styles.selectedRadio,
                ]}
                onPress={() => (isEditing ? setEditItemType("non-veg") : setNewItemType("non-veg"))}
              >
                <Ionicons
                  name="fish"
                  size={24}
                  color={(isEditing ? editItemType : newItemType) === "non-veg" ? "#fff" : "#FF5722"}
                />
                <Text
                  style={[
                    styles.radioText,
                    (isEditing ? editItemType : newItemType) === "non-veg" && styles.selectedRadioText,
                  ]}
                >
                  Non-Veg
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={isEditing ? editItem : addItem}>
              <Text style={styles.buttonText}>{isEditing ? "Save Changes" : "Add Item"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={optionsModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.optionsModalContent}>
            <Text style={styles.modalTitle}>Options</Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                selectItemForEdit(selectedItemId)
              }}
            >
              <Ionicons name="pencil" size={24} color="#007AFF" style={styles.optionIcon} />
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                removeItem(selectedItemId)
                setOptionsModalVisible(false)
              }}
            >
              <Ionicons name="trash-bin" size={24} color="#FF3B30" style={styles.optionIcon} />
              <Text style={styles.optionText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setOptionsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    paddingTop: 10
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    marginRight: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  itemDetails: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  optionsButton: {
    padding: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionsModalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1C1C1E",
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 12,
    width: "45%",
    justifyContent: "center",
  },
  selectedRadio: {
    backgroundColor: "#007AFF",
  },
  radioText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#1C1C1E",
  },
  selectedRadioText: {
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    color: "#1C1C1E",
  },
})

export default InventoryManagement

