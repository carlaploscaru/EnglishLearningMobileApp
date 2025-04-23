import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, StatusBar, SafeAreaView, Image, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import NavigationBar from "../components/NavigationBar"
import CategoriesPage from "../pages/Categories";



const API_URL = 'https://xbq4gmvb0e.execute-api.eu-central-1.amazonaws.com/UserDetails/settings';


const HomePage = ({ navigation }) => {
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
    <NavigationBar navigation={navigation} currentRoute="Home">
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      <ImageBackground 
        source={require("../utils/backgr1.jpg")} 
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }} 
        resizeMode="cover">

        <TouchableOpacity  onPress={() => navigation.navigate("Settings")}  style={{ position: "absolute", top: 15, right: 10, zIndex: 2 }}>
          <Text style={{ fontSize: 20, color: "black", color: 'white', backgroundColor: 'grey',borderRadius: 5, paddingHorizontal: 6, paddingVertical: 1 }}>⚙️Account</Text> 
        </TouchableOpacity>

        <Text style={styles.xpText}>{xp} XP</Text>

        <LinearGradient
          colors={["white", "transparent"]} 
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 150 }}/>

        <Image source={require("../utils/earth.png")} 
          style={{ position: "absolute", top: "37%", width: 200, height: 200, resizeMode: "contain"}}/>

        <TouchableOpacity
          style={{ position: "absolute", top: "47%", right: "40%" }}
          onPress={() => navigation.navigate("Categories")}
        >
          <LinearGradient
            colors={["transparent", "white"]}
            style={{
              position: "absolute",
              top: -10,
              left: -70,
              width: 70,
              height: 70,
              borderRadius: 15,
            }}
          />

          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 30,
              borderRightWidth: 30,
              borderBottomWidth: 50,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "#2c525f",
              position: "absolute",
              top: "50%",
              right: "40%",
              transform: [{ rotate: "90deg" }],
            }}
          />
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
    </NavigationBar>
  );
};


const styles = StyleSheet.create({
  xpText: {
    position: 'absolute',
    top: 0, 
    left: '15%',
    transform: [{ translateX: -41 }], // centers the text
    fontSize: 30,
    color: 'white', 
    fontWeight: 'bold',
    backgroundColor: '#483D8B', 
    paddingHorizontal: 15,
    paddingVertical: 1, 
    borderRadius: 10,
    zIndex: 1, 
  },
});

export default HomePage;
