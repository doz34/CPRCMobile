import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import ConnexionScreen from './screens/Connexion';
import InscriptionScreen from './screens/Inscription';
import { UserProvider } from './context/UserContext'; // Assurez-vous que le chemin est correct

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
          <Stack.Screen name="Connexion" component={ConnexionScreen} options={{ title: 'Connexion' }} />
          <Stack.Screen name="Inscription" component={InscriptionScreen} options={{ title: 'Inscription' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
