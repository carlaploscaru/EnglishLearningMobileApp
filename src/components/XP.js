import React, { useEffect, useState } from "react";
import { View, Text,  StyleSheet } from "react-native";
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const API_URL = 'https://xbq4gmvb0e.execute-api.eu-central-1.amazonaws.com/UserDetails/settings';


const XPpage = ({ navigation }) => {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const { userId } = await getCurrentUser();
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        const response = await fetch(`${API_URL}?user_id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'AuthorizationPusDeMine': `Bearer ${idToken}`,
          },
        });

        const raw = await response.json();
        const data = typeof raw.body === 'string' ? JSON.parse(raw.body) : raw;

        setXp(data.current_xp);
      } catch (error) {
        console.error("Failed to load XP:", error);
      }
    };

    fetchXP();
  }, []);


  return (
    <View style={styles.container}>
        <Text style={styles.xpText}>{xp} XP</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#a566c2", 
    paddingTop: 20,
    paddingBottom:20
  },
  xpText: {
    color: "white",
    fontSize: 20,
    alignSelf: "flex-start",
    right:150,
  },
});

export default XPpage;

