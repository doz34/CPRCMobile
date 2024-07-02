// screens/account/MyAccount.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { styles } from './styles'; // Import des styles du dossier account

const MyAccount = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../assets/Home.png")} // Assurez-vous que le chemin est correct
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeText}>Gestion du Compte</Text>
        <View style={{ width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MyAvatar')}
          >
            <Text style={styles.buttonText}>Mon Avatar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MyInfo')}
          >
            <Text style={styles.buttonText}>Mes Informations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MyCharacters')}
          >
            <Text style={styles.buttonText}>Mes Personnages</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default MyAccount;
