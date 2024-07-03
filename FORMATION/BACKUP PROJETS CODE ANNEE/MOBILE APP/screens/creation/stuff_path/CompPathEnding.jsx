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
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from "./stuff_styles/CompPathEnding.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const CompPathEnding = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(user?.idPerso || route.params?.idPerso);
  const [idRole, setIdRole] = useState(user?.idRole || route.params?.idRole);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      try {
        if (!idPerso) {
          throw new Error("ID du personnage non trouvé dans le contexte utilisateur");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du personnage:", error.message);
        alert("Erreur lors de la récupération du personnage.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchCharacter();
    } else {
      alert("Utilisateur non authentifié");
    }
  }, [user?.token, idPerso]);

  const onQuit = () => {
    setModalVisible(true);
  };

  const confirmQuit = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

  const onContinue = () => {
    navigation.navigate("StuffPathDisclaimer", { idPerso, idRole });
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
        <Text style={styles.descriptionTitle}>
          LES COMPETENCES DE VOTRE PERSONNAGE SONT ETABLIES, BRAVO !
        </Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text={
              "L'étape suivante consiste à établir l'équipement (Armes, armures, objets et cybermatériel) de votre personnage.\n\nA vous de choisir si vous souhaitez continuer immédiatement avec la sélection de l'équipement ou bien si vous voulez y revenir plus tard :"
            }
            style={styles.descriptionText}
          />
        </ScrollView>
      </LinearGradient>

      <View style={styles.fullContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Text style={styles.buttonText}>TERMINER PLUS TARD</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.buttonText}>
              POURSUIVRE AVEC L'EQUIPEMENT
            </Text>
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
              Vos "Compétences" sont déjà sauvegardées, vous allez retourner au menu, confirmer ?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={confirmQuit}
              >
                <Text style={styles.buttonText}>OUI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>ANNULER</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default CompPathEnding;