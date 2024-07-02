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
import styles from "./stuff_styles/CaracPathDerivatedCarac.styles";
import { LinearGradient } from "expo-linear-gradient";

const CaracPathDerivatedCarac = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [idPerso, setIdPerso] = useState(route.params.idPerso);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedCarac, setSelectedCarac] = useState(null);
  const [caracValues, setCaracValues] = useState({ pts_sante: 0, pts_huma: 0 });
  const [caracDetails, setCaracDetails] = useState({});

  useEffect(() => {
    const fetchCaracValues = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://192.168.1.17:3000/api/character/carac-values/${idPerso}`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        setCaracValues(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des valeurs des caractéristiques:", error);
        alert("Erreur lors de la récupération des valeurs des caractéristiques.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchCaracValues();
    } else {
      alert("Utilisateur non authentifié");
    }
  }, [user?.token, idPerso]);

  const openInfoModal = async (carac) => {
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/character/carac-details/${carac.id_caractyp}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setCaracDetails(response.data);
      setInfoModalVisible(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de la caractéristique:", error);
      alert("Erreur lors de la récupération des détails de la caractéristique.");
    }
  };

  const onQuit = () => {
    setModalVisible(true);
  };

  const confirmQuit = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

  const onContinue = async () => {
    try {
      await axios.post(
        `http://192.168.1.17:3000/api/character/update-stats`,
        { idPerso },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      navigation.navigate("CaracPathEnding", { idPerso });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des stats:", error);
      alert("Erreur lors de la mise à jour des stats.");
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
      <View style={styles.container}>
        <LinearGradient
          colors={["#868686", "#484848"]}
          style={styles.descriptionContainer}
        >
          <Text style={styles.descriptionTitle}>CALCUL AUTOMATIQUE DES CARACTERISTIQUES DERIVEES :</Text>
          <Text style={styles.descriptionText}>
            Il s’agit des caractéristiques dérivées de votre personnage, qu’on appelle ainsi, car elles dépendent directement de votre tableau de caractéristiques. 
            Pour connaître leur valeur, on effectue une opération mathématique (division, multiplication, soustraction) impliquant une caractéristique déjà existante.
          </Text>
          <Text style={styles.descriptionText}>
            POINTS DE SANTE : Les points de santé représentent la rage de vivre d’un individu et sa condition physique. Quand il subit des dégâts provoqués par des événements externes, il soustrait les dégâts de sa réserve de points de santé.
          </Text>
          <Text style={styles.descriptionText}>
            HUMANITE : L’Humanité mesure la qualité de vos interactions avec les gens et le monde extérieur. Les individus possédant une caractéristique d’Humanité faible ont de gros problèmes dans leurs interactions sociales. Ils courent le risque de devenir des sociopathes, de souffrir d’isolement ou de dissociation mentale, voire de commettre des homicides.
          </Text>
        </LinearGradient>

        <ScrollView style={styles.scrollableContentContainer} contentContainerStyle={styles.scrollableContent}>
          <View style={styles.caracContainer}>
            <TouchableOpacity onPress={() => openInfoModal({ id_caractyp: 11 })}>
              <Text style={styles.caracTitle}>PS :</Text>
            </TouchableOpacity>
            <View style={[styles.caracValueContainer, { backgroundColor: 'green' }]}>
              <Text style={styles.caracValueText}>{caracValues.pts_sante}</Text>
            </View>
          </View>
          <View style={styles.caracContainer}>
            <TouchableOpacity onPress={() => openInfoModal({ id_caractyp: 12 })}>
              <Text style={styles.caracTitle}>HUM :</Text>
            </TouchableOpacity>
            <View style={[styles.caracValueContainer, { backgroundColor: 'purple' }]}>
              <Text style={styles.caracValueText}>{caracValues.pts_huma}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Text style={styles.quitButtonText}>QUITTER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueButtonText}>CONTINUER</Text>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["#484848", "#868686"]}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>
              {caracDetails.fullnom_caractypo} :
            </Text>
            <Text style={styles.modalDescription}>
              {caracDetails.desc_caractypo}
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setInfoModalVisible(false)}>
              <Text style={styles.buttonText}>FERMER</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default CaracPathDerivatedCarac;