import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import NavigationBar from "../components/NavigationBar";
import { Ionicons } from "@expo/vector-icons";
import XPpage from "../components/XP";
import LinearGradient from "react-native-linear-gradient";


const categories = [
    { id: "1", name: "Vocabular", key: "vocabulary" },
    { id: "2", name: "Verbs", key: "verbs" },
    { id: "3", name: "Sentences", key: "sentences" },
  ];

  const CategoriesPage = ({ navigation }) => {
    const handleCategoryPress = (category) => {
      navigation.navigate("Levels", {
        categoryKey: category.key,
        categoryName: category.name,
      });
    };

  return (
    <NavigationBar navigation={navigation} currentRoute="Categories">
      <SafeAreaView style={styles.container}>
        
      <XPpage></XPpage>
      <LinearGradient
          colors={["white", "transparent"]} 
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40 }}/>

      <Text style={styles.title}>Categorii</Text>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.levelButton}
          onPress={() => handleCategoryPress(category)}
        >
          <Text style={styles.levelText}>{category.name}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.navContainer}>
        <Ionicons name="chevron-back" size={32} color="white" />
        <Ionicons name="chevron-forward" size={32} color="white" />
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() =>  navigation.navigate("Home")}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
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
        marginBottom:60,
        padding: 15,
        backgroundColor: '#1a1440',
        borderRadius: 8,
        position: 'absolute',
        bottom: 40,
      },
      backButtonText: {
        fontSize: 16,
        color: '#fff',
      },
  });
export default CategoriesPage;
