import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

const ConnexionScreen = () => {
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const { setUser } = useContext(UserContext);
  const navigation = useNavigation();

  const handleConnexion = async () => {
    try {
      const response = await axios.post("http://192.168.1.17:3000/api/auth/login", {
        nom_utilisateur: nomUtilisateur,
        mot_de_passe: motDePasse,
      });

      if (response.data.token) {
        setUser({ nomUtilisateur }); // Stockez les informations de l'utilisateur dans le contexte
        navigation.navigate("Home");
      } else {
        Alert.alert("Erreur de connexion", "Nom d’utilisateur ou mot de passe incorrect.");
      }
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