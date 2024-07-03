import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

const ConnexionScreen = () => {
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const { signIn } = useContext(UserContext);
  const navigation = useNavigation();

  const handleConnexion = async () => {
    try {
      await signIn(nomUtilisateur, motDePasse);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Erreur de connexion", "Une erreur réseau s'est produite. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Nom d'utilisateur" value={nomUtilisateur} onChangeText={setNomUtilisateur} />
<TextInput
     style={styles.input}
     placeholder="Mot de passe"
     secureTextEntry
     value={motDePasse}
     onChangeText={setMotDePasse}
   />
<Button title="Se connecter" onPress={handleConnexion} />
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
justifyContent: "center",
},
input: {
height: 40,
marginBottom: 12,
borderWidth: 1,
padding: 10,
},
});

export default ConnexionScreen;