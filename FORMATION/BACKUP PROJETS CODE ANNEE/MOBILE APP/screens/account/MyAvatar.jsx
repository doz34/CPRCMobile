import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { UserContext } from "../../context/UserContext";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import axiosRetry from "axios-retry";
import { styles } from "./styles"; // Assurez-vous que ce chemin est correct

// Configuration d'axios-retry
axiosRetry(axios, {
  retries: 3, // Nombre de tentatives en cas d'échec
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Délai entre chaque tentative (en ms)
  },
  retryCondition: (error) => {
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

const MyAvatar = () => {
  const { user, updateUser } = useContext(UserContext);
  const [avatar, setAvatar] = useState(user?.avatarUrl || "");
  const [imageKey, setImageKey] = useState(Date.now());

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user && user.token) {
        try {
          const response = await axios.get("http://192.168.1.17:3000/api/user/me", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (response.data.avatarUrl) {
            setAvatar(response.data.avatarUrl);
            setImageKey(new Date().getTime()); // Refresh key to force re-render
          }
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          Alert.alert("Error", "Unable to fetch user information.");
        }
      }
    };

    fetchAvatar();
  }, [user]);

  const getAvatarPathForDatabase = (avatarUrl) => {
    const matches = avatarUrl.match(/\/images\/avatars\/(.+)$/);
    return matches ? `images\\avatars\\${matches[1]}` : null;
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
      source={require("../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeText}>Mon Avatar</Text>
        {avatar && (
          <Image
            key={imageKey}
            source={{ uri: avatar }}
            style={styles.avatarImage}
          />
        )}
        <TouchableOpacity
          style={[styles.button, styles.buttonWithSpacing]}
          onPress={onDocumentPress}
        >
          <Text style={styles.buttonText}>Uploader un Avatar</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default MyAvatar;
