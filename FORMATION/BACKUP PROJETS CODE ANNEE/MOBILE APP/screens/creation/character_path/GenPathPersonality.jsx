import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from "./character_styles/GenPathPersonality.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathPersonality = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(route.params.idPerso); // Utiliser l'ID du personnage transmis
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchCharacters = async () => {
      console.log("Fetching characters...");
      setLoading(true);
      try {
        const charactersResponse = await axios.get(
          "http://192.168.1.17:3000/api/caractere",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const charactersData = charactersResponse.data;
        console.log("Characters fetched:", charactersData);

        if (!Array.isArray(charactersData)) {
          throw new Error("Invalid response format for characters");
        }

        setCharacters(charactersData);

        if (charactersData.length > 0) {
          setSelectedCharacter(charactersData[0]);
        } else {
          alert("Aucun caractère disponible");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des caractères:", error);
        alert("Erreur lors de la récupération des caractères.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchCharacters();
    } else {
      alert("Utilisateur non authentifié");
    }
  }, [user?.token]);

  const handleCharacterChange = (itemValue) => {
    setSelectedCharacter(itemValue);
    console.log("Selected Character:", itemValue);
  };

  const randomizeCharacter = () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    setSelectedCharacter(characters[randomIndex]);
    console.log("Randomized Character:", characters[randomIndex]);
  };

  const onSaveCharacter = async () => {
    console.log("Saving character...");
    console.log("Selected Character:", selectedCharacter, "User:", user, "ID Perso:", idPerso);

    if (!selectedCharacter?.id_caractere || !user?.token || !idPerso) {
      alert("Character, user token, or user ID is missing.");
      console.error("Missing data - Selected Character:", selectedCharacter, "User:", user, "ID Perso:", idPerso);
      return;
    }

    console.log("Updating character for user ID:", idPerso);

    try {
      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-character/${idPerso}`,
        { id_caractere: selectedCharacter.id_caractere },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      console.log("Server response:", response);

      if (response.status === 200) {
        console.log("Personnage mis à jour avec succès:", response.data);
        alert("Caractère mis à jour avec succès!");
        navigation.navigate("GenPathClothing", {
          idPerso: idPerso,
          idRole: response.data.id_role,
        });
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du caractère:", error);
      alert("Erreur lors de la mise à jour du caractère.");
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
      <LinearGradient
        colors={["#868686", "#484848"]}
        style={styles.descriptionContainer}
      >
        <Text style={styles.descriptionTitle}>VOTRE PERSONNALITÉ :</Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Ce tableau définit votre caractère. Etes-vous plutôt du genre à vous tenir à l'écart de la meute, à rester seul pour laisser votre esprit calculateur s'épanouir? Etes-vous un fêtard qui adore mettre la pagaille ? Un professionnel compétent et assuré qui a toujours un plan de secours ?"
            style={styles.descriptionText}
          />
        </ScrollView>
      </LinearGradient>

      <View style={styles.fullContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Quel est votre caractère :</Text>
          <Picker
            selectedValue={selectedCharacter}
            style={styles.picker}
            onValueChange={(itemValue) => handleCharacterChange(itemValue)}
          >
            {characters.map((character) => (
              <Picker.Item
                key={character.id_caractere}
                label={character.desc_caractere}
                value={character}
              />
            ))}
          </Picker>

          <TouchableOpacity style={styles.button} onPress={randomizeCharacter}>
            <Text style={styles.buttonText}>Caractère Aléatoire</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Text style={styles.buttonText}>QUITTER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={onSaveCharacter}>
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

export default GenPathPersonality;