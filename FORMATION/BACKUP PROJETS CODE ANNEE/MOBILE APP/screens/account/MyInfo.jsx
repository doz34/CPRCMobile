// screens/account/MyInfo.jsx
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import axiosRetry from "axios-retry";
import { styles } from "./styles"; // Importez les styles depuis votre fichier de styles partagé

// Configuration d'axios-retry
axiosRetry(axios, {
  retries: 3, // Nombre de tentatives en cas d'échec
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Délai entre chaque tentative (en ms)
  },
  retryCondition: (error) => {
    // Renvoie true si une nouvelle tentative doit être effectuée
    return error.code === "ERR_NETWORK";
  },
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // La requête a été effectuée et le serveur a répondu avec un code d'état d'erreur
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // La requête a été effectuée mais aucune réponse n'a été reçue
      console.error("Error request:", error.request);
    } else {
      // Quelque chose s'est passé lors de la construction de la requête qui a provoqué une erreur
      console.error("Error message:", error.message);
    }
    console.error("Error config:", error.config);
    return Promise.reject(error);
  }
);

const MyInfo = () => {
  const { user, updateUser } = useContext(UserContext);
  const [initialEmail, setInitialEmail] = useState(user?.email || "");
  const [email, setEmail] = useState(user?.email || "");
  const [motDePasse, setMotDePasse] = useState("");
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [confirmMotDePasse, setConfirmMotDePasse] = useState(""); // Nouvel état pour la confirmation du mot de passe

  // Fonction pour vérifier si les champs sont valides
  const isValidForm = () => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/; // Modifier selon les besoins
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basique; ajuster si nécessaire
    return (
      emailRegex.test(email) &&
      passwordRegex.test(motDePasse) &&
      motDePasse === confirmMotDePasse && // Assurez-vous que le mot de passe et sa confirmation sont identiques
      motDePasse !== ancienMotDePasse
    );
  };

  useEffect(() => {
    // Fonction pour récupérer les informations de l'utilisateur
    const fetchUserInfo = async () => {
      if (user && user.token) {
        try {
          const response = await axios.get(
            "http://192.168.1.17:3000/api/user/me",
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          setEmail(response.data.email);
          setInitialEmail(response.data.email); // Mettez à jour initialEmail ici
          // Mettez à jour d'autres informations si nécessaire
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des informations de l'utilisateur :",
            error
          );
          Alert.alert(
            "Erreur",
            "Impossible de récupérer les informations de l'utilisateur."
          );
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  useEffect(() => {
    if (user) {
      setInitialEmail(user?.email || "");
      setEmail(user?.email || "");
    }
  }, [user]);

  const validerMiseAJour = () => {
    // Vérification des formats de champs
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Erreur", "L'adresse email n'est pas valide.");
      return false;
    }

    if (motDePasse || ancienMotDePasse) {
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(motDePasse)) {
        Alert.alert(
          "Erreur",
          "Le nouveau mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 caractère spécial, 1 chiffre et doit contenir au minimum 8 caractères."
        );
        return false;
      }

      // Assurez-vous que l'ancien mot de passe et le nouveau ne sont pas identiques
      if (ancienMotDePasse === motDePasse) {
        Alert.alert(
          "Erreur",
          "L'ancien mot de passe et le nouveau mot de passe ne doivent pas être identiques."
        );
        return false;
      }

      // Ajout de la vérification pour s'assurer que le mot de passe et sa confirmation sont identiques
      if (motDePasse !== confirmMotDePasse) {
        Alert.alert(
          "Erreur",
          "Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas."
        );
        return false;
      }
    }

    return true;
  };

  const handleUpdate = async () => {
    console.log("Starting user info update...");

    // Vérifiez si des modifications ont été apportées
    const hasEmailChanged = email !== initialEmail;
    const hasPasswordChanged = motDePasse && motDePasse !== ancienMotDePasse;

    if (!hasEmailChanged && !hasPasswordChanged) {
      Alert.alert(
        "Aucune modification détectée",
        "Veuillez modifier au moins une information avant de mettre à jour."
      );
      return;
    }

    if (!validerMiseAJour()) return;

    const updatedFields = {};
    if (hasEmailChanged) updatedFields.email = email;
    if (hasPasswordChanged) {
      updatedFields.ancienMotDePasse = ancienMotDePasse;
      updatedFields.motDePasse = motDePasse;
    }

    try {
      const updateResult = await updateUser(updatedFields);

      if (updateResult.success) {
        console.log("User info updated successfully.");
        Alert.alert(
          "Mise à jour réussie",
          "Vos informations ont été mises à jour."
        );

        // Mise à jour des valeurs initiales après une mise à jour réussie
        setInitialEmail(email);

        // Nettoyez les champs de mot de passe après une mise à jour réussie

        setMotDePasse("");
        setAncienMotDePasse("");
        setConfirmMotDePasse(""); // Effacez également le champ de confirmation du mot de passe

      } else {
        throw new Error(updateResult.message);
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      Alert.alert(
        "Erreur lors de la mise à jour",
        error.response?.data?.message ||
        error.message ||
        "Une erreur s'est produite. Veuillez réessayer."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { padding: 0, justifyContent: 'center', alignItems: 'center' }]}>
      <ImageBackground
        source={require("../../assets/Inscription.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.welcomeText}>Mise à jour des informations</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Ancien mot de passe"
            placeholderTextColor="#FFFFFFB3"
            secureTextEntry
            value={ancienMotDePasse}
            onChangeText={setAncienMotDePasse}
          />
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            placeholderTextColor="#FFFFFFB3"
            secureTextEntry
            value={motDePasse}
            onChangeText={setMotDePasse}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmer nouveau mot de passe"
            placeholderTextColor="#FFFFFFB3"
            secureTextEntry
            value={confirmMotDePasse}
            onChangeText={setConfirmMotDePasse}
          />
          <Button title="Mettre à jour" onPress={handleUpdate} color="#fd0d1b" />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default MyInfo;
