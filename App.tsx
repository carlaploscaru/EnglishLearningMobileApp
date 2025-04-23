import React, { useState } from "react";
import { Button, View, StyleSheet, ScrollView, TouchableOpacity, Text} from "react-native";
import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import HomePage from "./src/pages/Home";
import SettingsPage from "./src/pages/Settings";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FlashcardsPage from "./src/pages/FlashCards";
import LeaderboardPage from "./src/pages/LeaderBoard";
import CategoriesPage from "./src/pages/Categories";
import LevelsPage from "./src/pages/Levels";
import GamePage from "./src/pages/GamePage";
const Stack = createNativeStackNavigator();

import UnlockedCardsPage from "./src/pages/UnlockedCardsPage";

//import {API_URL} from "@env";

// import SignOutButton from "./src/components/SignOutButton"

// import awsconfig from "./src/plugins/amplify";
// Amplify.configure(awsconfig);


// import awsconfig from './src/aws-exports'; // or wherever your config is

// Amplify.configure(awsconfig);


Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "", 
      userPoolClientId: "", 
      identityPoolId: "",
      loginWith: { 
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        }
      },
      allowGuestAccess: true,
    
    },
  },
})




 const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
   <View style={styles.signOutButton}>
     <TouchableOpacity onPress={signOut}>
       <Text style={{ fontSize: 20, color: "#0c4052", backgroundColor: "white", paddingTop: 5, paddingRight:17, borderRadius: 5, textDecorationLine: 'underline' }}>
        Sign Out
       </Text>
     </TouchableOpacity>
  </View>

  );
};



// const App = () => {
//   const [currentScreen, setCurrentScreen] = useState('home');

//   return (
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         <Authenticator.Provider>
//           <Authenticator loginMechanisms={['email']} signUpAttributes={['name', 'birthdate']}>
//             <SignOutButton /> 
//             {currentScreen === 'home' ? (
//               <HomePage onOpenSettings={() => setCurrentScreen('settings')} />
//             ) : (
//               <SettingsPage onGoBack={() => setCurrentScreen('home')} />
//             )}
//           </Authenticator>
//         </Authenticator.Provider>
//       </ScrollView>
//   );
// };


const App = () => {
  return (
    <NavigationContainer>
      <Authenticator.Provider>
        <Authenticator loginMechanisms={['email']} signUpAttributes={['name', 'birthdate']}>
          <SignOutButton />
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, animation: 'none'}}>
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="Settings" component={SettingsPage} />
            <Stack.Screen name="Flashcards" component={FlashcardsPage} />
            <Stack.Screen name="Leaderboard" component={LeaderboardPage} />
            <Stack.Screen name="UnlockedCards" component={UnlockedCardsPage} />
            <Stack.Screen name="Categories" component={CategoriesPage} />
            <Stack.Screen name="Levels" component={LevelsPage} />
            <Stack.Screen name="GamePage" component={GamePage} />
          </Stack.Navigator>
        </Authenticator>
      </Authenticator.Provider>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  signOutButton: {
    alignSelf: "flex-end",
  },
});

export default App;















