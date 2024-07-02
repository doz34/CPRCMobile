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
import MyCharacters from './screens/account/MyCharacters';
import DisclaimerCharacter from './screens/creation/DisclaimerCharacter';
import SelectRoleScreen from './screens/creation/SelectRole';
import RoleDescriptionScreen from './screens/creation/RoleDescription';
import CulturalOrigin from './screens/creation/character_path/CulturalOrigin';
import { UserProvider } from './context/UserContext';
import GenPathDescScreen from './screens/creation/character_path/GenPathDesc';
import GenPathPersonalityScreen from './screens/creation/character_path/GenPathPersonality';
import GenPathClothingScreen from './screens/creation/character_path/GenPathClothing';
import GenPathMotRel from './screens/creation/character_path/GenPathMotRel';
import GenPathSocialOrigin from './screens/creation/character_path/GenPathSocialOrigin';
import GenPathEnvironment from './screens/creation/character_path/GenPathEnvironment';
import GenPathFamily from './screens/creation/character_path/GenPathFamily';
import GenPathFriends from './screens/creation/character_path/GenPathFriends';
import GenPathEnemies from './screens/creation/character_path/GenPathEnemies';
import GenPathLove from './screens/creation/character_path/GenPathLove';
import GenPathObjective from './screens/creation/character_path/GenPathObjective';

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
          <Stack.Screen name="MyCharacters" component={MyCharacters} />
          <Stack.Screen name="DisclaimerCharacter" component={DisclaimerCharacter} options={{ title: 'Disclaimer Character' }} />
          <Stack.Screen name="SelectRole" component={SelectRoleScreen} />
          <Stack.Screen name="RoleDescription" component={RoleDescriptionScreen} />
          <Stack.Screen name="GenPathDesc" component={GenPathDescScreen} />
          <Stack.Screen name="CulturalOrigin" component={CulturalOrigin} />
          <Stack.Screen name="GenPathPersonality" component={GenPathPersonalityScreen} />
          <Stack.Screen name="GenPathClothing" component={GenPathClothingScreen} />
          <Stack.Screen name="GenPathMotRel" component={GenPathMotRel} />
          <Stack.Screen name="GenPathSocialOrigin" component={GenPathSocialOrigin} />
          <Stack.Screen name="GenPathEnvironment" component={GenPathEnvironment} />
          <Stack.Screen name="GenPathFamily" component={GenPathFamily} />
          <Stack.Screen name="GenPathFriends" component={GenPathFriends} />
          <Stack.Screen name="GenPathEnemies" component={GenPathEnemies} />
          <Stack.Screen name="GenPathLove" component={GenPathLove} />
          <Stack.Screen name="GenPathObjective" component={GenPathObjective} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
