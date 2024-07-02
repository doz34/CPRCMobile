import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 35,
    marginBottom: 20,
    textAlign: "center",
    color: "white",
    fontFamily: "Roboto",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    color: "#fff",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#fd0d1b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const ConnexionScreen = () => {
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const { signIn } = useContext(UserContext);
  const navigation = useNavigation();

  const handleConnexion = async () => {
    // Vérification des champs vides
    if (!nomUtilisateur.trim() || !motDePasse.trim()) {
      Alert.alert(
        "Champs requis",
        "Veuillez saisir votre nom d'utilisateur et votre mot de passe."
      );
      return; // Arrêt de la fonction si l'un des champs est vide
    }
  
    const result = await signIn(nomUtilisateur, motDePasse); // Attendre le résultat de la tentative de connexion
    if (result.success) {
      navigation.navigate("Home"); // Rediriger vers la page d'accueil en cas de succès
    } else {
      Alert.alert("Erreur de connexion", result.message); // Afficher l'erreur en cas d'échec
    }
  };
  

  return (
    <ImageBackground
      source={require("../assets/Connexion.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Connexion</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur ou Adresse e-mail"
          placeholderTextColor="#fff"
          value={nomUtilisateur}
          onChangeText={setNomUtilisateur}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#fff"
          secureTextEntry
          value={motDePasse}
          onChangeText={setMotDePasse}
        />
        <TouchableOpacity style={styles.button} onPress={handleConnexion}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ConnexionScreen;
