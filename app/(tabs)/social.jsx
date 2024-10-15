import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';

const Social = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Social</Text>
        <Text style={styles.subHeaderText}>Coming Soon in Beta!</Text>
      </View>

      {/* Image or Icon */}
      <Image
        source={require('@/assets/images/coming-soon.png')} // replace with your image URL
        style={styles.image}
        resizeMode="contain"
      />

      {/* Description Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.descriptionText}>
          We're are trying to bring this page to life and provide you an exciting new feature. Stay tuned for the beta launch, and be the first to explore the social side of our app!
        </Text>
      </View>

      {/* Button Section */}
      <TouchableOpacity
        style={styles.notifyButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Notify Me When Ready</Text>
      </TouchableOpacity>

      {/* Modal Section */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Thanks for your interest! We'll notify you when this feature is ready for beta testing.</Text>
            <TouchableOpacity
              style={[styles.notifyButton, { backgroundColor: '#333' }]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  notifyButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Social