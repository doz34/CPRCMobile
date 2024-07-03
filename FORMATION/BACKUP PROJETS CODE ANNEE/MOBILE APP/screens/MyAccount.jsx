import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { UserContext } from "../context/UserContext";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import axiosRetry from "axios-retry";
import * as FileSystem from "expo-file-system";

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 35,
    marginBottom: 20,
    textAlign: "center",
    color: "white",
    fontFamily: "Roboto",
    textShadowColor: "black", // Définit la couleur de l'ombre à noir
    textShadowOffset: { width: -1, height: 1 }, // Définit le décalage de l'ombre
    textShadowRadius: 1, // Définit le flou de l'ombre
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    color: "#fff",
    borderRadius: 5,
  },
  avatarImage: {
    width: 328,
    height: 328,
    borderRadius: 164,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fd0d1b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10, // Valeur de base pour la marge du bas
    width: "80%",
    alignItems: "center",
  },
  buttonWithSpacing: {
    marginBottom: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

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

const MyAccount = () => {
  const { user, signOut, updateUser } = useContext(UserContext);

  // États initiaux pour stocker les valeurs actuelles de l'utilisateur
  const [initialEmail, setInitialEmail] = useState(user?.email || "");
  const [initialAvatar, setInitialAvatar] = useState(user?.avatarUrl || "");

  const [email, setEmail] = useState(user?.email || "");
  const [motDePasse, setMotDePasse] = useState("");
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [avatar, setAvatar] = useState(user?.avatarUrl || "");

  const [confirmMotDePasse, setConfirmMotDePasse] = useState(""); // Nouvel état pour la confirmation du mot de passe

  // Ajoutez un état pour gérer une clé unique pour l'élément <Image>
  const [imageKey, setImageKey] = useState(Date.now());

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
    // Mise à jour des états initiaux lors du chargement des informations de l'utilisateur
    setInitialEmail(user?.email || "");
    setInitialAvatar(user?.avatarUrl || "");
    setEmail(user?.email || "");
    setAvatar(user?.avatarUrl || "");
  }, [user]);

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
          setAvatar(response.data.avatarUrl); // Mettez à jour l'avatar ici
          setEmail(response.data.email);
          setInitialEmail(response.data.email); // Mettez à jour initialEmail ici
          setInitialAvatar(response.data.avatarUrl); // Mettez à jour initialAvatar ici
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

  const getAvatarPathForDatabase = (avatarUrl) => {
    const matches = avatarUrl.match(/\/images\/avatars\/(.+)$/);
    return matches ? `images\\avatars\\${matches[1]}` : null;
  };

  const handleUpdate = async () => {
    console.log("Starting user info update...");

    // Vérifiez si des modifications ont été apportées
    const hasEmailChanged = email !== initialEmail;
    const hasPasswordChanged = motDePasse && motDePasse !== ancienMotDePasse;
    const hasAvatarChanged = avatar !== initialAvatar;

    if (!hasEmailChanged && !hasPasswordChanged && !hasAvatarChanged) {
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
    if (hasAvatarChanged) {
      updatedFields.avatar = getAvatarPathForDatabase(avatar);
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
        setInitialAvatar(avatar);

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

  const onDocumentPress = async () => {
    console.log("Opening document picker...");
    try {
      const pickerResult = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });
      console.log("Document picker result:", pickerResult);

      if (pickerResult.type === "cancel") {
        console.log("Document picker cancelled.");
        return;
      }

      if (
        !pickerResult.uri &&
        (!pickerResult.assets || pickerResult.assets.length === 0)
      ) {
        console.error("No URI or assets found in document picker result");
        return;
      }

      const uri = pickerResult.uri || pickerResult.assets[0].uri;
      console.log("Preparing for document upload with URI:", uri);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "upload.jpg",
        type: "image/jpeg",
      });

      console.log("Uploading document...");
      try {
        const response = await axios.post(
          "http://192.168.1.17:3000/api/user/upload-avatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
            timeout: 60000, // Augmentez le délai d'attente à 30 secondes (ajustez selon vos besoins)
          }
        );

        console.log(
          "Document uploaded successfully, response data:",
          response.data
        );

        // Remplacez les barres obliques inverses par des barres obliques et ne répétez pas le chemin 'images/avatars/'
        const filePath = response.data.filePath.replace(/\\/g, "/");
        const newAvatarUrl = `http://192.168.1.17:3000/${filePath}?${new Date().getTime()}`;
        console.log("New avatar URL:", newAvatarUrl);
        // Affichez la popup de succès avec un callback pour mettre à jour l'avatar
        Alert.alert("Upload Successful", "Votre avatar a été mis à jour.", [
          {
            text: "OK",
            onPress: () => {
              // Mise à jour de l'URL de l'avatar et de la clé de l'image pour forcer le rafraîchissement
              const newAvatarUrl = `http://192.168.1.17:3000/${response.data.filePath.replace(/\\/g, "/")}?${new Date().getTime()}`;
              console.log("New avatar URL:", newAvatarUrl);
              setAvatar(newAvatarUrl);
              setImageKey(Date.now()); // Mettez à jour la clé de l'image pour forcer le re-render
            },
          },
        ]);
      } catch (error) {
        console.error(
          "Axios request failed:",
          error.toJSON ? error.toJSON() : error
        );
        Alert.alert(
          "Upload Failed",
          "An unexpected error occurred during upload."
        );
      }
    } catch (err) {
      console.error("Error during document selection:", err);
      Alert.alert(
        "Upload Failed",
        "An unexpected error occurred during document selection."
      );
    }
  };

  return (
    <ImageBackground
      source={require("../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text style={styles.welcomeText}>Mon Avatar :</Text>
          {avatar && (
            <Image
            key={imageKey} // Utilisez la clé unique pour l'élément <Image>
            source={{ uri: avatar }}
            style={styles.avatarImage}
          />
          )}
          <TouchableOpacity
            style={[styles.button, styles.buttonWithSpacing]} // Utilisation de deux styles ici
            onPress={onDocumentPress}
          >
            <Text style={styles.buttonText}>Uploader un Avatar</Text>
          </TouchableOpacity>
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>
              Mes informations utilisateur :
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Ancien mot de passe"
              placeholderTextColor="#fff"
              secureTextEntry
              value={ancienMotDePasse}
              onChangeText={setAncienMotDePasse}
            />
            <TextInput
              style={styles.input}
              placeholder="Nouveau mot de passe"
              placeholderTextColor="#fff"
              secureTextEntry
              value={motDePasse}
              onChangeText={setMotDePasse}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmer nouveau mot de passe"
              placeholderTextColor="#fff"
              secureTextEntry
              value={confirmMotDePasse}
              onChangeText={setConfirmMotDePasse}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Mettre à jour</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default MyAccount;
