import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from "./stuff_styles/StuffPathDisclaimer.styles";
import MyTextSimple from "../MyTextSimple";

const StuffPathDisclaimer = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(route.params?.idPerso);
  const [idRole, setIdRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      try {
        if (!idPerso) {
          throw new Error("ID du personnage non trouvé dans les paramètres de la route");
        }

        console.log("Fetching role for character ID:", idPerso);
        const response = await axios.get(
          `http://192.168.1.17:3000/api/character/${idPerso}`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        console.log("Character data response:", response.data);

        const { id_role } = response.data;
        setIdRole(id_role);
        console.log("Fetched id_role:", id_role);
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle:", error.response ? error.response.data : error.message);
        alert("Erreur lors de la récupération du rôle.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchRole();
    } else {
      alert("Utilisateur non authentifié");
    }
  }, [user?.token, idPerso]);

  const handleContinue = () => {
    console.log("Handling continue with idRole:", idRole);
    let nextPage = "";
    switch (idRole) {
      case 1:
        nextPage = "StuffPathSelectionRockerboy";
        break;
      case 2:
        nextPage = "StuffPathSelectionSolo";
        break;
      case 3:
        nextPage = "StuffPathSelectionCorpo";
        break;
      case 4:
        nextPage = "StuffPathSelectionTechie";
        break;
      case 5:
        nextPage = "StuffPathSelectionMedtech";
        break;
      case 6:
        nextPage = "StuffPathSelectionMedia";
        break;
      case 7:
        nextPage = "StuffPathSelectionLawman";
        break;
      case 8:
        nextPage = "StuffPathSelectionNetrunner";
        break;
      case 9:
        nextPage = "StuffPathSelectionFixer";
        break;
      case 10:
        nextPage = "StuffPathSelectionNomad";
        break;
      default:
        nextPage = "Home";
    }
    console.log("Navigating to:", nextPage, "with idPerso:", idPerso, "and idRole:", idRole);
    navigation.navigate("StuffPathSelectionRockerboy", { idPerso, idRole, idUser: user?.id });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground
      source={require("../../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.roleDescriptionTitleText}>EQUIPEMENT :</Text>
        <LinearGradient
          colors={["#868686", "#484848"]}
          style={styles.placeholderContainer}
        >
          <View style={styles.textContainer}>
            <ScrollView style={styles.contentContainer}>
              <MyTextSimple
                text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...'
                style={styles.roleDescriptionText}
              />
            </ScrollView>
          </View>
        </LinearGradient>
      </ScrollView>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>CONTINUER</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.quitButton}
        onPress={() => {
          console.log("Quit button pressed, opening modal.");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>QUITTER</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log("Modal closed.");
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>TERMINER PLUS TARD :</Text>
            <Text style={styles.modalDescription}>
              Vous allez retourner au menu sans sauvegarder les informations de
              cette page. Les informations des pages précédentes ont déjà été
              sauvegardées, confirmer ?
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  console.log("Confirmed to quit, navigating to Home.");
                  setModalVisible(false);
                  navigation.navigate("Home");
                }}
              >
                <Text style={styles.buttonText}>OUI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  console.log("Cancelled quitting, closing modal.");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>ANNULER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default StuffPathDisclaimer;