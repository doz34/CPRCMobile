import React from 'react';
import { StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import ConnexionScreen from './screens/Connexion';
import InscriptionScreen from './screens/Inscription';
import MyAccount from './screens/account/MyAccount';
import MyAvatar from './screens/account/MyAvatar';
import MyInfo from './screens/account/MyInfo';
import DisclaimerCharacter from './screens/creation/DisclaimerCharacter';
import SelectRoleScreen from './screens/creation/SelectRole';
import { UserProvider } from './context/UserContext';

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#fd0d1b",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
});

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: styles.headerStyle,
            headerTintColor: styles.headerTintColor,
            headerTitleStyle: styles.headerTitleStyle,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
          <Stack.Screen name="Connexion" component={ConnexionScreen} options={{ title: 'Connexion' }} />
          <Stack.Screen name="Inscription" component={InscriptionScreen} options={{ title: 'Inscription' }} />
          <Stack.Screen name="MyAccount" component={MyAccount} options={{ title: 'Mon Compte' }} />
          <Stack.Screen name="MyAvatar" component={MyAvatar} options={{ title: 'Mon Avatar' }} />
          <Stack.Screen name="MyInfo" component={MyInfo} options={{ title: 'Mes Informations' }} />
          <Stack.Screen name="DisclaimerCharacter" component={DisclaimerCharacter} options={{ title: 'Disclaimer Character' }} />
          <Stack.Screen name="SelectRole" component={SelectRoleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
