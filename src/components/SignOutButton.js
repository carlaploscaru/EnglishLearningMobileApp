import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, StatusBar, SafeAreaView, Image } from "react-native";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
  


const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
   <View style={styles.signOutButton}>
     <TouchableOpacity onPress={signOut}>
       <Text style={{ fontSize: 16, color: "#0c4052", backgroundColor: "white", padding: 15, borderRadius: 5}}>
        Sign Out
       </Text>
     </TouchableOpacity>
  </View>

  );
};

  export default SignOutButton;