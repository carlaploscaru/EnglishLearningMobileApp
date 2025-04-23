import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const MainLayout = ({ children }) => {
  const route = useRoute();
  const navigation = useNavigation();

  const renderButton = (icon, routeName) => (
    <TouchableOpacity
      key={routeName}
      onPress={() => navigation.navigate(routeName)}
      style={[
        styles.navButton,
        route.name === routeName && styles.activeButton,
      ]}
    >
      <Text style={styles.navIcon}>{icon}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>

      <View style={styles.navBar}>
        {renderButton("🏠", "Home")}
        {renderButton("📚", "Flashcards")}
        {renderButton("🏅", "Leaderboard")}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#352f66",
    borderTopWidth: 1,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 10,
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: "#e0e0e0",
  },
  navIcon: {
    fontSize: 24,
    color: "white",
  },
});

export default MainLayout;
