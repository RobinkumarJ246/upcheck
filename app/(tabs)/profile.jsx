import { useEffect, useState } from "react"
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Image,
  FlatList,
} from "react-native"
import { Div, Button } from "react-native-magnus"
import { Ionicons as MatIcons, FontAwesome6 as FA6 } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import TopBar from "@/components/TopBar"
import { useRouter } from "expo-router"

const ProfileScreen = () => {
  const router = useRouter()
  const [Name, setName] = useState("Upcheck_User")
  const [Id, setId] = useState("UP_1234_DEFAULT")
  const [Bio, setBio] = useState("No bio set")
  const [Address, setAddress] = useState("No address set")
  const [Exp, setExp] = useState("0")
  const [NoPonds, setNoPonds] = useState("Cannot GET")
  const [Phone, setPhone] = useState("Not provided")
  const [Email, setEmail] = useState("example@upcheck.com")
  const [Cultivation, setCultivation] = useState("Shrimp")
  const [userName, setUserName] = useState("upcheck_user_1234")
  const [modalVisible, setModalVisible] = useState(false)
  const [profilePicture, setProfilePicture] = useState(require("@/assets/images/avatar_default.jpg"))
  const [loading, setLoading] = useState(true)
  const [profilePictures] = useState([require("@/assets/images/avatar_default.jpg")])

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true)
      try {
        const userDetailsString = await AsyncStorage.getItem("userDetails")
        const userId = await AsyncStorage.getItem("userId")
        console.log(userDetailsString)
        console.log(userId)
        setId(userId)
        if (userDetailsString) {
          const userDetails = JSON.parse(userDetailsString)
          setName(userDetails.displayName)
          setUserName(userDetails.username)
          setExp(userDetails.experience)
          setNoPonds(userDetails.no_ponds)
          setPhone(userDetails.phoneNumber)
          setEmail(userDetails.email)
          setBio(userDetails.bio)
          setCultivation(userDetails.cultivation)
          setAddress(userDetails.address)
        }
      } catch (error) {
        console.error("Failed to fetch user details from AsyncStorage:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserDetails()
  }, [])

  const user = {
    name: Name,
    username: userName,
    bio: Bio,
    cultivationType: Cultivation,
    farmerID: Id,
    address: Address,
    numberOfPonds: NoPonds,
    experience: Exp,
    email: Email,
    phone: Phone,
  }

  const handleProfilePictureSelect = (picture) => {
    setProfilePicture(picture)
    setModalVisible(false)
  }

  const renderUserDetail = (label, value) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title={"Profile"} />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profilePictureContainer}>
            <Image source={profilePicture} style={styles.profilePicture} />
            <View style={styles.editIconContainer}>
              <FA6 name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          {loading ? (
            <View style={styles.skeletonText} />
          ) : (
            <>
              <Text style={styles.userName}>{user.username}</Text>
              <Div row alignItems="center" justifyContent="center">
                <MatIcons style={styles.verifiedIcon} size={20} color="#03dac6" name="checkmark-circle" />
                <Text style={styles.verifiedText}>Verified Farmer</Text>
              </Div>
              <Text style={styles.userBio}>{user.bio}</Text>
            </>
          )}
        </View>

        <View style={styles.detailsContainer}>
          {loading ? (
            <View style={styles.skeletonDetails} />
          ) : (
            <>
              {renderUserDetail("Farmer Name", user.name)}
              {renderUserDetail("Farmer ID", user.farmerID)}
              {renderUserDetail("Cultivation", user.cultivationType)}
              {renderUserDetail("Address", user.address)}
              {renderUserDetail("Number of Ponds", user.numberOfPonds)}
              {renderUserDetail("Experience", user.experience)}
              {renderUserDetail("Email", user.email)}
              {renderUserDetail("Phone", user.phone)}
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/ponds")}>
            <FA6 name="shrimp" color="white" size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>View ponds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.shareButton]}>
            <FA6 name="share" color="white" size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Share profile</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Profile Picture</Text>
              <FlatList
                data={profilePictures}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleProfilePictureSelect(item)} style={styles.pictureOption}>
                    <Image source={item} style={styles.profileOptionImage} />
                  </TouchableOpacity>
                )}
                numColumns={3}
                contentContainerStyle={styles.pictureOptionsContainer}
              />
              <Button
                title="Close"
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                textStyle={styles.closeButtonText}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profilePictureContainer: {
    marginBottom: 15,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#03dac6",
  },
  editIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#03dac6",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  verifiedIcon: {
    marginRight: 5,
  },
  verifiedText: {
    color: "#03dac6",
    fontWeight: "600",
  },
  userBio: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: "#666",
    paddingHorizontal: 20,
  },
  detailsContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  detailValue: {
    color: "#666",
    flex: 2,
    textAlign: "right",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#03dac6",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  shareButton: {
    backgroundColor: "#6200ee",
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  pictureOption: {
    margin: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  profileOptionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  pictureOptionsContainer: {
    padding: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#03dac6",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  skeletonText: {
    width: "60%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginVertical: 4,
  },
  skeletonDetails: {
    height: 200,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
})

export default ProfileScreen

