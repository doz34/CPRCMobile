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
import styles from "./stuff_styles/CompPathSelection.styles";
import { LinearGradient } from "expo-linear-gradient";

const CompPathSelection = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [idPerso, setIdPerso] = useState(route.params.idPerso);
  const [idRole, setIdRole] = useState(null);
  const [compDetails, setCompDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);
  const [compNames, setCompNames] = useState([]);
  const [nomComp, setNomComp] = useState("");
  const [caracAssociee, setCaracAssociee] = useState("");
  const [typeComp, setTypeComp] = useState("");

  useEffect(() => {
    const fetchRoleAndCompDetails = async () => {
      setLoading(true);
      try {
        const roleResponse = await axios.get(
          `http://192.168.1.17:3000/api/character/role/${idPerso}`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        const roleData = roleResponse.data;
        setIdRole(roleData.id_role);

        const compResponse = await axios.post(
          `http://192.168.1.17:3000/api/character/comp-details`,
          { id_role: roleData.id_role },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        setCompDetails(compResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails des compétences:", error);
        alert("Erreur lors de la récupération des détails des compétences.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchRoleAndCompDetails();
    } else {
      alert("Utilisateur non authentifié");
    }
  }, [user?.token, idPerso]);

  const openInfoModal = async (comp) => {
    const compName = compNames.find(name => name.id_comptyp === comp.id_comptyp);
    setSelectedComp(compName);
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/character/comp-name/${comp.id_comptyp}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setNomComp(response.data.nom_comptyp);

      const caracResponse = await axios.get(`http://192.168.1.17:3000/api/character/carac-name/${comp.id_comptyp}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setCaracAssociee(caracResponse.data.nom_caractypo);

      const typeResponse = await axios.get(`http://192.168.1.17:3000/api/character/comp-type/${comp.id_comptyp}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setTypeComp(typeResponse.data.type_comptypo);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de la compétence:", error);
      alert("Erreur lors de la récupération des informations de la compétence.");
    }
    setInfoModalVisible(true);
  };

  useEffect(() => {
    const fetchCompNames = async () => {
      try {
        const response = await axios.get('http://192.168.1.17:3000/api/character/comp-names', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setCompNames(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des noms des compétences:", error);
        alert("Erreur lors de la récupération des noms des compétences.");
      }
    };

    if (user?.token) {
      fetchCompNames();
    }
  }, [user?.token]);

  const onSaveSet = async () => {
    try {
      const response = await axios.post(
        `http://192.168.1.17:3000/api/character/save-comp-set`,
        { idPerso, compSet: compDetails },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      Alert.alert("Succès", "Le set de compétences a été enregistré avec succès.");
      navigation.navigate("CompPathEnding", { idPerso });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du set de compétences:", error);
      alert("Erreur lors de la sauvegarde du set de compétences.");
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

  const baseComps = compDetails.filter(comp => comp.comp_base).sort((a, b) => a.nom_comptyp.localeCompare(b.nom_comptyp));
  const proComps = compDetails.filter(comp => comp.comp_pro).sort((a, b) => a.nom_comptyp.localeCompare(b.nom_comptyp));

  return (
    <ImageBackground
      source={require("../../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollableContentContainer} contentContainerStyle={styles.scrollableContent}>
          <Text style={styles.sectionTitle}>COMPÉTENCES DE BASE :</Text>
          {baseComps.map((comp, index) => {
            const compName = compNames.find(name => name.id_comptyp === comp.id_comptyp);
            return (
              <View key={index} style={styles.compContainer}>
                <TouchableOpacity onPress={() => openInfoModal(comp)}>
                  <Text style={styles.compTitle}>{compName ? compName.nom_comptyp : `Compétence ${comp.id_comptyp}`}</Text>
                </TouchableOpacity>
                <View style={styles.compValueContainer}>
                  <View
                    style={[
                      styles.compValue,
                      { width: `${(comp.id_complvl / 10) * 100}%`, backgroundColor: getColor(comp.id_complvl) },
                    ]}
                  >
                    <Text style={styles.compValueText}>{comp.id_complvl}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          <Text style={styles.sectionTitleWithMargin}>COMPÉTENCES PROFESSIONNELLES :</Text>
          {proComps.map((comp, index) => {
            const compName = compNames.find(name => name.id_comptyp === comp.id_comptyp);
            return (
              <View key={index} style={styles.compContainer}>
                <TouchableOpacity onPress={() => openInfoModal(comp)}>
                  <Text style={styles.compTitle}>{compName ? compName.nom_comptyp : `Compétence ${comp.id_comptyp}`}</Text>
                </TouchableOpacity>
                <View style={styles.compValueContainer}>
                  <View
                    style={[
                      styles.compValue,
                      { width: `${(comp.id_complvl / 10) * 100}%`, backgroundColor: getColor(comp.id_complvl) },
                    ]}
                  >
                    <Text style={styles.compValueText}>{comp.id_complvl}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Text style={styles.quitButtonText}>QUITTER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={onSaveSet}>
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
        {nomComp} ({caracAssociee}) :
      </Text>
      <Text style={styles.modalType}>
        (TYPE DE COMPETENCE : {typeComp})
      </Text>
      <Text style={styles.modalDescription}>
        {selectedComp?.desc_comptyp}
      </Text>
      <TouchableOpacity style={styles.modalButton} onPress={() => setInfoModalVisible(false)}>
        <Text style={styles.closeButtonText}>FERMER</Text>
      </TouchableOpacity>
    </LinearGradient>
  </View>
</Modal>
    </ImageBackground>
  );
};

const getColor = (value) => {
  const colors = [
    "#ff0000", // 1
    "#ff3300", // 2
    "#ff6600", // 3
    "#ff9900", // 4
    "#ffcc00", // 5
    "#ffff00", // 6
    "#ccff00", // 7
    "#99ff00", // 8
    "#66ff00", // 9
    "#33ff00", // 10
  ];
  return colors[value - 1];
};

export default CompPathSelection;