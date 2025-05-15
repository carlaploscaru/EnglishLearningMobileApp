import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import NavigationBar from "../components/NavigationBar";
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const API_URL = 'https://bfm90gdjx9.execute-api.eu-central-1.amazonaws.com/getSortedUsers';

const LeaderboardPage = ({ navigation }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPlacement, setUserPlacement] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { userId } = await getCurrentUser();
      try {
        const response = await fetch(`${API_URL}`); 
        const data = await response.json();
        console.log("xxxxxxxxxxxxxxxx", data)
        
        const parsedBody = JSON.parse(data.body);
        setLeaderboardData(parsedBody);

        const index = parsedBody.findIndex((user) => user.user_id === userId);
        if (index !== -1) {
          setUserPlacement(index + 1);
        }

      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <NavigationBar navigation={navigation} currentRoute="Home">
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Leaderboard Page</Text>
        <Image source={require("../utils/trofe.png")} style={styles.trophyImage} />
        <Text style={styles.placementText}>
          {userPlacement ? `Your placement is #${userPlacement}` : "You are not ranked"}
        </Text>

        <View style={styles.leaderboard}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={leaderboardData}
              keyExtractor={(item) => item.user_id}
              renderItem={({ item, index }) => (
                <View style={styles.row}>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>{item.name}</Text>
                  <Text style={styles.cell}>{item.current_xp} XP</Text>
                </View>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </NavigationBar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    top: 50
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
