import React, { useState } from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const LevelCompleteModal = ({ visible, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Level Complete! 🎉</Text>
          <Image
            source={require("../utils/Complete.jpg")} 
            style={styles.image}
          />
          <Text style={styles.xpText}>+ 20XP</Text>
          <Text style={styles.subText}>You unlocked the next level!</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5e2c82",
    marginBottom: 15,
    textAlign: "center",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  xpText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 10,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LevelCompleteModal;
