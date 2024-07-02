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
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from "./stuff_styles/CaracPathSelection.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const CaracPathSelection = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [idPerso, setIdPerso] = useState(route.params.idPerso);
  const [idRole, setIdRole] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [caracSets, setCaracSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [caracDetails, setCaracDetails] = useState([]);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedCarac, setSelectedCarac] = useState(null);
  const [caracNames, setCaracNames] = useState([]);
  const [fullnomCarac, setFullnomCarac] = useState("");

  useEffect(() => {
    const fetchRoleAndCaracSets = async () => {
      setLoading(true);
      try {
        const roleResponse = await axios.get(
          `http://192.168.1.17:3000/api/character/role/${idPerso}`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        const roleData = roleResponse.data;
        setIdRole(roleData.id_role);

        const sets = generateCaracSets(roleData.id_role);
        setCaracSets(sets);
        if (sets.length > 0) {
          setSelectedSet(sets[0].value);
          handleSetChange(sets[0].value);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
        alert("Erreur lors de la récupération du rôle.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchRoleAndCaracSets();
    } else {
      alert("Utilisateur non authentifié");
    }
  }, [user?.token, idPerso]);

  const generateCaracSets = (role) => {
    const sets = [];
    const baseId = 200 + (role - 1) * 100;
    for (let i = 0; i < 10; i++) {
      sets.push({
        label: `Set ${i + 1}`,
        value: Array.from({ length: 10 }, (_, j) => baseId + i * 10 + j + 1),
      });
    }
    return sets;
  };

  const handleSetChange = async (itemValue) => {
    setSelectedSet(itemValue);
    try {
      const caracResponse = await axios.post(
        `http://192.168.1.17:3000/api/character/carac-details`,
        { ids: itemValue },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setCaracDetails(caracResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails des caractéristiques:", error);
      alert("Erreur lors de la récupération des détails des caractéristiques.");
    }
  };

  const randomizeSet = () => {
    const randomIndex = Math.floor(Math.random() * caracSets.length);
    handleSetChange(caracSets[randomIndex].value);
  };

  const onSaveSet = async () => {
    try {
      console.log("Saving set...");
      const response = await axios.post(
        `http://192.168.1.17:3000/api/character/save-carac-set`,
        { idPerso, caracSet: selectedSet },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      console.log("Save response:", response.data);

      console.log("Updating stats...");
      const statsResponse = await axios.post(
        `http://192.168.1.17:3000/api/character/update-stats`,
        { idPerso },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      console.log("Stats update response:", statsResponse.data);

      Alert.alert("Succès", "Le set de caractéristiques et les stats ont été enregistrés avec succès.");
      navigation.navigate("CaracPathDerivatedCarac", { idPerso });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du set de caractéristiques ou de la mise à jour des stats:", error);
      alert("Erreur lors de la sauvegarde du set de caractéristiques ou de la mise à jour des stats.");
    }
  };

  const onQuit = () => {
    setModalVisible(true);
  };

  const confirmQuit = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

  const openInfoModal = async (carac) => {
    const caracName = caracNames.find(name => name.id_caractyp === carac.id_caractyp);
    setSelectedCarac(caracName);
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/character/carac-fullname/${carac.id_caractyp}`, {
        headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setFullnomCarac(response.data.fullnom_caractypo);
    } catch (error) {
      console.error("Erreur lors de la récupération du fullnom_caractypo:", error);
      alert("Erreur lors de la récupération du fullnom_caractypo.");
    }
    setInfoModalVisible(true);
  };

  useEffect(() => {
    const fetchCaracNames = async () => {
      try {
        const response = await axios.get('http://192.168.1.17:3000/api/character/carac-names', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setCaracNames(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des noms des caractéristiques:", error);
        alert("Erreur lors de la récupération des noms des caractéristiques.");
      }
    };

    if (user?.token) {
      fetchCaracNames();
    }
  }, [user?.token]);

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
          <Text style={styles.descriptionTitle}>Set de Caractéristiques :</Text>
          <Picker
            selectedValue={selectedSet}
            style={styles.picker}
            onValueChange={(itemValue) => handleSetChange(itemValue)}
          >
            {caracSets.map((set) => (
              <Picker.Item key={set.label} label={set.label} value={set.value} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={randomizeSet}>
            <Text style={styles.buttonText}>Set Aléatoire</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.scrollableContentContainer} contentContainerStyle={styles.scrollableContent}>
          {caracDetails.map((carac, index) => {
            const caracName = caracNames.find(name => name.id_caractyp === carac.id_caractyp);
            return (
              <View key={index} style={styles.caracContainer}>
                <TouchableOpacity onPress={() => openInfoModal(carac)}>
                  <Text style={styles.caracTitle}>{caracName ? caracName.nom_caractypo : `Caractéristique ${carac.id_caractyp}`}</Text>
                </TouchableOpacity>
                <View style={styles.caracValueContainer}>
                  <View
                    style={[
                      styles.caracValue,
                      { width: `${(carac.id_caraclvl / 10) * 100}%`, backgroundColor: getColor(carac.id_caraclvl) },
                    ]}
                  >
                    <Text style={styles.caracValueText}>{carac.id_caraclvl}</Text>
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
            <MyTextSimple text="Vous allez retourner au menu sans sauvegarder les informations de cette page. Les informations des pages précédentes ont déjà été sauvegardées, confirmer ?" style={styles.modalDescription} />
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
              {fullnomCarac} :
            </Text>
            <MyTextSimple text={selectedCarac?.desc_caractypo} style={styles.modalDescription} />
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

export default CaracPathSelection;