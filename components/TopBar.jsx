import React from "react"
import { View, TouchableOpacity, StyleSheet, Platform, StatusBar } from "react-native"
import IconFA6 from "react-native-vector-icons/FontAwesome6"
import { Link, useRouter } from "expo-router"
import { ThemedText } from "@/components/ThemedText"
import { useColorScheme } from "react-native"

const HomeTopBar = ({ title, leftIcon, leftAction, rightIcon, rightAction }) => {
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === "dark"

  const backgroundColor = isDarkMode ? "#1c1c1e" : "#ffffff"
  const textColor = isDarkMode ? "#ffffff" : "#000000"
  const iconColor = "#03dac6" // Keeping the original teal color

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {leftIcon && (
        <TouchableOpacity onPress={leftAction} style={styles.iconButton}>
          <IconFA6 name={leftIcon} size={24} color={iconColor} />
        </TouchableOpacity>
      )}
      <ThemedText style={[styles.title, { color: textColor }]}>{title}</ThemedText>
      {rightIcon && (
        <TouchableOpacity onPress={rightAction} style={styles.iconButton}>
          <IconFA6 name={rightIcon} size={24} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 15,
    marginTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#03dac6",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
  },
  icon: {
    marginRight: 8,
  },
})

export default HomeTopBar

