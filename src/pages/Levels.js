import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavigationBar from "../components/NavigationBar";
import XPpage from "../components/XP";
import LinearGradient from "react-native-linear-gradient";
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useFocusEffect } from "@react-navigation/native";

const API_URL = 'https://6cuc3m1qz4.execute-api.eu-central-1.amazonaws.com/getLevels/';


const LevelsPage = ({ route, navigation }) => {
  const { categoryKey, categoryName } = route.params || {};
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(null);
  

  const fetchLevels = async () => {
    try {
      const response = await fetch(`${API_URL}?categoryKey=${categoryKey}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
        });

        if (!response.ok) {
          throw new Error(`Failed to update: ${response.status}`);
        }

      const data = await response.json();
      const parsedBody = JSON.parse(data.body); 
      setLevels(parsedBody.levels);
      
    } catch (error) {
      console.error("Error fetching levels:", error);
    } finally {
      setLoading(false);
    }
  };

 
  const fetchUserProgress = async () => {
    try {
      // const user = await getCurrentUser();
      // const userId = user.username;
      const { userId } = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      const response = await fetch(`https://xbq4gmvb0e.execute-api.eu-central-1.amazonaws.com/UserDetails/settings?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'AuthorizationPusDeMine': `Bearer ${idToken}`,
        },
      });

        const raw = await response.json();
        const data = typeof raw.body === 'string' ? JSON.parse(raw.body) : raw;

        console.log("cevaaaaaaa",data)
        setUserProgress(data); 
    } catch (err) {
      console.error("Failed to fetch user progress:", err);
    }finally {
      setLoading(false);
    }
  };



 useFocusEffect(
  React.useCallback(() => {
    fetchLevels();
    fetchUserProgress();
  }, [])
);

  const handleLevelPress = (levelId) => {
    navigation.navigate("GamePage", {
      categoryKey,
      levelId,
    });
  };
  


 

  return (
    <NavigationBar>
      <SafeAreaView style={styles.container}>
        <XPpage/>
        <LinearGradient
          colors={["white", "transparent"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40 }}
        />
        <Text style={styles.title}>{categoryName}</Text>

        {loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          levels.map((level) => {
            const currentLevel = userProgress?.[`current_lv_${categoryKey}`] ?? 0;
            const isUnlocked = level.level <= currentLevel;

            
          
            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelButton,
                  !isUnlocked && styles.disabledButton
                ]}
                onPress={() => isUnlocked && handleLevelPress(level.level)}
                disabled={!isUnlocked}
              >
                <Text style={[styles.levelText, !isUnlocked && styles.disabledText]}>
                  {level.lv_name}
                </Text>
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.navContainer}>
          <Ionicons name="chevron-back" size={32} color="white" />
          <Ionicons name="chevron-forward" size={32} color="white" />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Categories")}
        >
          <Text style={styles.backButtonText}>← Back to Categories</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </NavigationBar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a566c2",
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  levelButton: {
    backgroundColor: "#fbe9e7",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 8,
    width: "70%",
    alignItems: "center",
  },
  levelText: {
    fontSize: 18,
    color: "#333",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    bottom: 30,
    paddingHorizontal: 40,
  },
  backButton: {
    marginBottom: 60,
    padding: 15,
    backgroundColor: "#1a1440",
    borderRadius: 8,
    position: "absolute",
    bottom: 40,
  },
  backButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  disabledButton: {
    backgroundColor: "#ccc", // grey
  },
  disabledText: {
    color: "#888",
  },
});

export default LevelsPage;
