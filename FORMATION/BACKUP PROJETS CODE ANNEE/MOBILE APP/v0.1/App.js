import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import HomeScreen from './screens/Home';
import ConnexionScreen from './screens/Connexion';
import InscriptionScreen from './screens/Inscription';

const Stack = createNativeStackNavigator();
const serverUrl = Constants.expoConfig.extra.serverUrl;
console.log(serverUrl);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Utiliser les composants importés comme écrans */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
        <Stack.Screen name="Inscription" component={InscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
