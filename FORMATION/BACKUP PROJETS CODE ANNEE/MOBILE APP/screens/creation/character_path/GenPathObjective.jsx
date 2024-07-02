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
import styles from "./character_styles/GenPathObjective.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathObjective = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [objectives, setObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchObjectives = async () => {
      setLoading(true);
      try {
        const objectivesResponse = await axios.get(
          "http://192.168.1.17:3000/api/objectif",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const objectivesData = objectivesResponse.data;

        if (!Array.isArray(objectivesData)) {
          throw new Error("Invalid response format for objectives");
        }

        setObjectives(objectivesData);

        if (objectivesData.length > 0) {
          setSelectedObjective(objectivesData[0]);
        } else {
          alert("Aucun objectif disponible");
        }

        const lastCharacterResponse = await axios.get(
          "http://192.168.1.17:3000/api/character/last",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const lastCharacterData = lastCharacterResponse.data;

        if (!lastCharacterData?.id_perso) {
          throw new Error("Character ID not found");
        }

        setIdPerso(lastCharacterData.id_perso);
      } catch (error) {
        console.error("Erreur lors de la récupération des objectifs:", error);
        alert("Erreur lors de la récupération des objectifs ou du dernier personnage.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchObjectives();
    } else {
      alert("Utilisateur non authentifié");
    }
  }, [user?.token]);

  const handleObjectiveChange = (itemValue) => {
    setSelectedObjective(itemValue);
  };

  const randomizeObjective = () => {
    const randomIndex = Math.floor(Math.random() * objectives.length);
    setSelectedObjective(objectives[randomIndex]);
  };

  const onSaveObjective = async () => {
    if (!selectedObjective?.id_objectif || !user?.token || !idPerso) {
      alert("Objective, user token, or user ID is missing.");
      return;
    }

    try {
      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-objective/${idPerso}`,
        { id_objectif: selectedObjective.id_objectif },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (response.status === 200) {
        alert("Objectif mis à jour avec succès!");
        navigation.navigate("GenPathEnding");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'objectif:", error);
      alert("Erreur lors de la mise à jour de l'objectif.");
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
        <Text style={styles.descriptionTitle}>VOTRE BUT DANS LA VIE :</Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Ce tableau définit votre objectif dans la vie. Choisissez l'objectif qui correspond le mieux à vos aspirations."
            style={styles.descriptionText}
          />
        </ScrollView>
      </LinearGradient>

      <View style={styles.fullContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Objectif :</Text>
          <Picker
            selectedValue={selectedObjective}
            style={styles.picker}
            onValueChange={(itemValue) => handleObjectiveChange(itemValue)}
          >
            {objectives.map((objective) => (
              <Picker.Item
                key={objective.id_objectif}
                label={objective.desc_objectif}
                value={objective}
              />
            ))}
          </Picker>

          <TouchableOpacity style={styles.button} onPress={randomizeObjective}>
            <Text style={styles.buttonText}>Objectif Aléatoire</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Text style={styles.buttonText}>QUITTER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={onSaveObjective}>
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

export default GenPathObjective;