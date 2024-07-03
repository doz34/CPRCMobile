import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ImageBackground, ScrollView, Modal, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from './character_styles/GenPathFamily.styles';
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathFamily = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [histories, setHistories] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [idPerso, setIdPerso] = useState(route.params?.idPerso);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/histoire_familiale`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setHistories(response.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération des données:`, error);
      alert(`Erreur lors de la récupération des données.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchData();

      if (!idPerso) {
        const fetchLastCharacter = async () => {
          try {
            const response = await axios.get('http://192.168.1.17:3000/api/character/last', {
              headers: { Authorization: `Bearer ${user?.token}` },
            });
            if (response.data) {
              setIdPerso(response.data.id_perso);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du dernier personnage:", error);
            alert('Erreur lors de la récupération du dernier personnage.');
          }
        };
        fetchLastCharacter();
      }
    }
  }, [user?.token]);

  // useEffect pour initialiser les valeurs par défaut une fois que les données sont chargées
  useEffect(() => {
    if (histories.length > 0) {
      setSelectedHistory(histories[0]); // Initialiser avec la première histoire de la liste
    }
  }, [histories]);

  const randomizeSelection = () => {
    const randomIndex = Math.floor(Math.random() * histories.length);
    setSelectedHistory(histories[randomIndex]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const onContinue = async () => {
    if (!idPerso) {
      alert('ID du personnage non défini.');
      return;
    }

    if (!selectedHistory || isNaN(parseInt(selectedHistory.id_histofam, 10))) {
      alert('Veuillez sélectionner une histoire familiale avant de continuer.');
      return;
    }

    console.log("ID du personnage:", idPerso);
    console.log("ID de l'histoire familiale:", selectedHistory.id_histofam);

    try {
      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-histofam/${idPerso}`,
        {
          id_histofam: parseInt(selectedHistory.id_histofam, 10),
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (response.status === 200) {
        console.log("Personnage mis à jour avec succès:", response.data);
        Alert.alert("Succès", "Les données ont été enregistrées avec succès.");
        navigation.navigate("GenPathFriends", { idPerso: idPerso }); // Transmettre l'ID du personnage
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du personnage :", error);
      alert('Erreur lors de la mise à jour du personnage.');
    }
  };

  const onQuit = () => {
    setModalVisible(true);
  };

  const confirmQuit = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

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
          CRISE FAMILIALE :
        </Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Décrivez l'histoire familiale de votre personnage."
            style={styles.descriptionText} 
          />
        </ScrollView>
      </LinearGradient>
  
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Histoire Familiale :</Text>
          <Picker
            selectedValue={selectedHistory}
            style={styles.picker}
            onValueChange={(itemValue) => {
              console.log("Selected history:", itemValue);
              setSelectedHistory(itemValue);
            }}
          >
            {histories.map((history) => (
              <Picker.Item
                key={history.id_histofam}
                label={history.desc_histofam}
                value={history}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={randomizeSelection}>
            <Text style={styles.buttonText}>Histoire aléatoire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
          <Text style={styles.buttonText}>QUITTER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
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

export default GenPathFamily;