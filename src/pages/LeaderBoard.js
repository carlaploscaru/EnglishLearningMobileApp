import React, { useState } from "react";
import {View, Text, SafeAreaView, StyleSheet, FlatList, Image} from "react-native";
import NavigationBar from "../components/NavigationBar";

// Dummy data — replace with AWS data later
const leaderboardData = [
  { id: "1", username: "user123", xp: 200 },
  { id: "2", username: "user124", xp: 170 },
  { id: "3", username: "user1253", xp: 100 },
  { id: "4", username: "user43", xp: 80 },
  { id: "5", username: "user1289", xp: 20 },
];

const LeaderboardPage = ({ navigation }) => {
  const userPlacement = 2; // You can compute this dynamically later

  return (
    <NavigationBar navigation={navigation} currentRoute="Home">
      <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Leaderboard Page</Text>
        <Image
          source={require("../utils/trofe.png")} // ← save your uploaded image here
          style={styles.trophyImage}
        />
        <Text style={styles.placementText}>Your placement is #{userPlacement}</Text>

        <View style={styles.leaderboard}>
          <FlatList
            data={leaderboardData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <Text style={styles.cell}>{index + 1}</Text>
                <Text style={styles.cell}>{item.username}</Text>
                <Text style={styles.cell}>{item.xp}XP</Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </NavigationBar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    top:50
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  trophyImage: {
    width: 280,
    height: 140,
    resizeMode: "contain",
    marginTop: 50,
    marginBottom: 10,
  },
  placementText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  leaderboard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  cell: {
    width: "33%",
    textAlign: "center",
    fontSize: 16,
  },
});

export default LeaderboardPage;
