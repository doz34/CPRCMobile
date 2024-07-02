import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from "./role_styles/RolePathRockerboyPlace.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const RolePathRockerboyPlace = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(route.params.idPerso); // Utiliser l'ID du personnage transmis
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const placesResponse = await axios.get(
          "http://192.168.1.17:3000/api/roles/espace_travail",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const placesData = placesResponse.data;
        setPlaces(placesData);

        if (placesData.length > 0) {
          setSelectedPlace(placesData[0]);
        } else {
          alert("Aucun lieu disponible");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des lieux:", error);
        alert("Erreur lors de la récupération des lieux.");
      } finally {
        setLoading(false);
      }
    };

    const fetchImageUrl = async () => {
      try {
        const roleId = 1; // Remplacez par l'ID du rôle approprié
        const url = `http://192.168.1.17:3000/api/roles/${roleId}`;
        const headers = { Authorization: `Bearer ${user?.token}` };

        console.log("Fetching image URL for role...");
        console.log("Request URL:", url);
        console.log("Request Headers:", headers);

        const response = await axios.get(url, { headers });

        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        if (response.status === 200 && response.data.role_img) {
          const fullImageUrl = `http://192.168.1.17:3000/${response.data.role_img}`;
          console.log("Image URL fetched successfully:", fullImageUrl);
          setImageUrl(fullImageUrl);
        } else {
          console.error("Invalid response data:", response.data);
          alert("Erreur: Données de réponse invalides.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'image:", error);
        alert(`Erreur lors de la récupération de l'image: ${error.message}`);
      }
    };

    if (user?.token) {
      fetchPlaces();
      fetchImageUrl();
    } else {
      alert("Utilisateur non authentifié");
    }
  }, [user?.token, idPerso]);

  const handlePlaceChange = (itemValue) => {
    setSelectedPlace(itemValue);
  };

  const randomizePlace = () => {
    const randomIndex = Math.floor(Math.random() * places.length);
    setSelectedPlace(places[randomIndex]);
  };

  const onSavePlace = async () => {
    if (!selectedPlace?.id_esptra || !user?.token || !idPerso) {
      alert("Lieu, token utilisateur ou ID personnage manquant.");
      return;
    }

    console.log("Envoi de la requête de mise à jour pour idPerso:", idPerso, "avec id_esptra:", selectedPlace.id_esptra);

    try {
      const response = await axios.put(
        `http://192.168.1.17:3000/api/roles/update-place/${idPerso}`,
        { id_esptra: selectedPlace.id_esptra },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (response.status === 200) {
        alert("Lieu mis à jour avec succès!");
        navigation.navigate("RolePathRockerboyEnemies", {
          idPerso: idPerso,
        });
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du lieu:", error);
      alert("Erreur lors de la mise à jour du lieu.");
    }
  };

  const onQuit = () => {
    setModalVisible(true);
  };

  const confirmQuit = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground
      source={require("../../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.rockerImage} />
        </View>
      )}
      <LinearGradient
        colors={["#868686", "#484848"]}
        style={styles.descriptionContainer}
      >
        <Text style={styles.descriptionTitle}>OU PRATIQUEZ-VOUS VOTRE ART ?</Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Sélectionnez le lieu où vous pratiquez votre art."
            style={styles.descriptionText}
          />
        </ScrollView>
      </LinearGradient>

      <View style={styles.fullContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Lieu :</Text>
          <Picker
            selectedValue={selectedPlace}
            style={styles.picker}
            onValueChange={(itemValue) => handlePlaceChange(itemValue)}
          >
            {places.map((place) => (
              <Picker.Item
                key={place.id_esptra}
                label={place.desc_esptra}
                value={place}
              />
            ))}
          </Picker>

          <TouchableOpacity style={styles.button} onPress={randomizePlace}>
            <Text style={styles.buttonText}>Lieu Aléatoire</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Text style={styles.buttonText}>QUITTER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={onSavePlace}>
            <Text style={styles.buttonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["#484848", "#868686"]}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>TERMINER PLUS TARD :</Text>
            <Text style={styles.modalDescription}>
              Vous allez retourner au menu sans sauvegarder les informations de cette page. Les informations des pages précédentes ont déjà été sauvegardées, confirmer ?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonYes]} onPress={confirmQuit}>
                <Text style={styles.buttonText}>OUI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonNo]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>ANNULER</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default RolePathRockerboyPlace;