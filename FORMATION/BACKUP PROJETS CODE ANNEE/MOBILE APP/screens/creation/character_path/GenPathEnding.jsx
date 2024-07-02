import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from "./character_styles/GenPathEnding.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathEnding = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(user?.idPerso || route.params?.idPerso);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      try {
        console.log("User token:", user?.token);
        if (!idPerso) {
          throw new Error("ID du personnage non trouvé dans le contexte utilisateur");
        }

        console.log("ID du personnage récupéré:", idPerso);
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

  const onContinue = async () => {
    if (!idPerso) {
      alert("ID du personnage non trouvé.");
      return;
    }

    try {
      console.log("Fetching character data for ID:", idPerso);
      const response = await axios.get(
        `http://192.168.1.17:3000/api/character/${idPerso}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      console.log("Character data response:", response.data);

      const { id_role } = response.data;

      switch (id_role) {
        case 1:
          navigation.navigate("RolePathRockerboy");
          break;
        case 2:
          navigation.navigate("RolePathSolo");
          break;
        case 3:
          navigation.navigate("RolePathCorpo");
          break;
        case 4:
          navigation.navigate("RolePathTechie");
          break;
        case 5:
          navigation.navigate("RolePathMedTech");
          break;
        case 6:
          navigation.navigate("RolePathMedia");
          break;
        case 7:
          navigation.navigate("RolePathLawman");
          break;
        case 8:
          navigation.navigate("RolePathNetrunner");
          break;
        case 9:
          navigation.navigate("RolePathFixer");
          break;
        case 10:
          navigation.navigate("RolePathNomad");
          break;
        default:
          alert("Rôle inconnu");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle:", error.response ? error.response.data : error.message);
      alert("Erreur lors de la récupération du rôle.");
    }
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
          LE PARCOURS GENERIQUE DE VOTRE PERSONNAGE EST TERMINE, BRAVO !
        </Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text={
              'L\'étape suivante consiste à établir le "Parcours Rôle" qui précise les détails du Rôle de votre personnage. A vous de choisir si vous souhaitez continuer immédiatement avec la création du "Parcours Rôle" ou bien si vous voulez y revenir plus tard :'
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
              POURSUIVRE AVEC LE PARCOURS RÔLE
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
              Votre "Parcours Générique" est déjà sauvegardé et vous allez
              retourner au menu, confirmer ?
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

export default GenPathEnding;