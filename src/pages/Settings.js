import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ImageBackground } from 'react-native';
import UserDetails from "../components/UserDetails";

const SettingsPage = ({ navigation  }) => {
  return (
    <ImageBackground 
      source={require('../utils/backgr1.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover" >
      <View style={styles.container}>
        <Text style={styles.title}>Settings Page</Text>
        
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <UserDetails></UserDetails>
        </SafeAreaView>

        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: 'black', 
    padding: 20, 
    backgroundColor: 'white', 
    opacity: 0.9, 
  },
  editButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
  },
  editButtonText: {
    fontSize: 20,
    color: 'white',
  },
  backText: {
    fontSize: 18,
    color: 'black',
    textDecorationLine: 'underline',
    bottom: 30
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    color: '#333',
  },
});

export default SettingsPage;
