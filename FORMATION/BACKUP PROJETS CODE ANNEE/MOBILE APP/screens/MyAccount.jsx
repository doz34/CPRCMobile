import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { UserContext } from "../context/UserContext";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import * as FileSystem from "expo-file-system";

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
  const [nomUtilisateur, setNomUtilisateur] = useState(user?.nomUtilisateur || "");
  const [email, setEmail] = useState(user?.email || "");
  const [motDePasse, setMotDePasse] = useState("");
  const [avatar, setAvatar] = useState(user?.avatarUrl || "");

  useEffect(() => {
    // Fonction pour récupérer les informations de l'utilisateur
    const fetchUserInfo = async () => {
      if (user && user.token) {
        try {
          const response = await axios.get('http://192.168.1.17:3000/api/user/me', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setAvatar(response.data.avatarUrl); // Mettez à jour l'avatar ici
          setNomUtilisateur(response.data.nomUtilisateur);
          setEmail(response.data.email);
          // Mettez à jour d'autres informations si nécessaire
        } catch (error) {
          console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
          Alert.alert(
            "Erreur",
            "Impossible de récupérer les informations de l'utilisateur."
          );
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  const handleUpdate = async () => {
    console.log("Starting user info update...");
    try {
      const updatedUser = {
        nom_utilisateur: nomUtilisateur,
        email,
        mot_de_passe: motDePasse,
        avatar,
      };
      await updateUser(updatedUser);
      console.log("User info updated successfully.");
      Alert.alert(
        "Mise à jour réussie",
        "Vos informations ont été mises à jour."
      );
    } catch (error) {
      console.error("Error updating user info:", error);
      Alert.alert(
        "Erreur lors de la mise à jour",
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
            timeout: 30000, // Augmentez le délai d'attente à 30 secondes (ajustez selon vos besoins)
          }
        );

        console.log(
          "Document uploaded successfully, response data:",
          response.data
        );
        setAvatar(
          `http://192.168.1.17:3000/images/avatars/${response.data.filePath}`
        );
        Alert.alert("Upload Successful");
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
    <View style={styles.container}>
      <Text style={styles.title}>Mon Compte</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={nomUtilisateur}
        onChangeText={setNomUtilisateur}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
        secureTextEntry
        value={motDePasse}
        onChangeText={setMotDePasse}
      />
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatarImage} />
      ) : (
        <Text>Pas d'avatar à afficher</Text>
      )}
      <Button title="Uploader un Avatar" onPress={onDocumentPress} />
      <Button title="Mettre à jour" onPress={handleUpdate} />
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
  },
  avatarImage: {
    width: 100, // La largeur que vous souhaitez pour l'image
    height: 100, // La hauteur que vous souhaitez pour l'image
    borderRadius: 50, // Si vous voulez des coins arrondis
    // Ajoutez d'autres styles si nécessaire
  },
});

export default MyAccount;
