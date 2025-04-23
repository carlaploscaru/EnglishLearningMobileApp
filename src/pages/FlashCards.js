import React from "react";
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import NavigationBar from "../components/NavigationBar"

const FlashcardsPage = ({ navigation }) => {
  return (
    <NavigationBar navigation={navigation} currentRoute="Home">
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("UnlockedCards")}
      >
        <Text style={styles.buttonText}>Unlocked Cards</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </NavigationBar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    top: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#C8C8C8",
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderRadius: 8,
    top: 100,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});

export default FlashcardsPage;
