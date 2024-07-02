import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

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
    fontSize: 30,
    color: "white",
    fontFamily: "Roboto",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 30,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    color: "white",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#fd0d1b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const InscriptionScreen = ({ navigation }) => {
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [email, setEmail] = useState("");

  // Validation côté client avant de soumettre
  const validerFormulaire = () => {
    // Vérifier si un champ est vide
    if (!nomUtilisateur || !motDePasse || !email) {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return false;
    }

    // Vérifier la longueur du nom d'utilisateur
    if (nomUtilisateur.length < 4 || nomUtilisateur.length > 13) {
      Alert.alert(
        "Erreur",
        "Le nom d'utilisateur doit contenir entre 4 et 13 caractères."
      );
      return false;
    }

    // Vérifier le format du nom d'utilisateur (lettres et chiffres uniquement)
    if (!/^[A-Za-z0-9]+$/.test(nomUtilisateur)) {
      Alert.alert(
        "Erreur",
        "Le nom d'utilisateur doit contenir uniquement des lettres et des chiffres."
      );
      return false;
    }

    // Vérifier le format de l'email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Erreur", "L'adresse email n'est pas valide.");
      return false;
    }

    // Vérifier les critères du mot de passe
    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,24}/.test(motDePasse)) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 caractère spécial, 1 chiffre et doit contenir au minimum 8 caractères."
      );
      return false;
    }

    return true; // Validation réussie
  };

  const handleInscription = async () => {
    if (!validerFormulaire()) return;

    try {
      const response = await axios.post(
        "http://192.168.1.17:3000/api/auth/signup",
        {
          nom_utilisateur: nomUtilisateur,
          mot_de_passe: motDePasse,
          email: email,
        }
      );

      if (response.data) {
        Alert.alert(
          "Inscription réussie",
          "Vous pouvez maintenant vous connecter.",
          [{ text: "OK", onPress: () => navigation.navigate("Connexion") }]
        );
      }
    } catch (error) {
      console.error(error);
      let errorMessage =
        "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.";
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message; // Message d'erreur spécifique de l'API
      }

      Alert.alert("Erreur lors de l'inscription", errorMessage);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Inscription</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          placeholderTextColor="white"
          value={nomUtilisateur}
          onChangeText={setNomUtilisateur}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          placeholderTextColor="white"
          value={motDePasse}
          onChangeText={setMotDePasse}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="white"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handleInscription}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default InscriptionScreen;
