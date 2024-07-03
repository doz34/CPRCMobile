import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ImageBackground, ScrollView, Modal, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from './character_styles/GenPathEnvironment.styles';
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathEnvironment = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [idPerso, setIdPerso] = useState(route.params?.idPerso);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/environnement`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setEnvironments(response.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération des données d'environnement:`, error);
      alert(`Erreur lors de la récupération des données d'environnement.`);
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

  useEffect(() => {
    if (environments.length > 0) {
      setSelectedEnvironment(environments[0]);
    }
  }, [environments]);

  const randomizeSelection = () => {
    const randomIndex = Math.floor(Math.random() * environments.length);
    setSelectedEnvironment(environments[randomIndex]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const onContinue = async () => {
    if (!idPerso) {
      alert('ID du personnage non défini.');
      return;
    }
  
    if (!selectedEnvironment || isNaN(parseInt(selectedEnvironment.id_environnement, 10))) {
      alert('Veuillez sélectionner un environnement avant de continuer.');
      return;
    }
  
    try {
      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-environment/${idPerso}`,
        {
          id_environnement: parseInt(selectedEnvironment.id_environnement, 10),
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (response.status === 200) {
        Alert.alert("Succès", "Les données ont été enregistrées avec succès.");
        navigation.navigate("GenPathFamily", { idPerso: idPerso }); // Transmettre l'ID du personnage
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
          ENVIRONNEMENT :
        </Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Environnement dans lequel vous avez grandi :"
            style={styles.descriptionText} 
          />
        </ScrollView>
      </LinearGradient>
  
      <View style={styles.mainContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Environnement dans lequel vous avez grandi :</Text>
          <Picker
            selectedValue={selectedEnvironment}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedEnvironment(itemValue)}
          >
            {environments.map((env) => (
              <Picker.Item
                key={env.id_environnement}
                label={env.description}
                value={env}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={randomizeSelection}>
            <Text style={styles.buttonText}>Environnement aléatoire</Text>
          </TouchableOpacity>
        </View>
      </View>

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

export default GenPathEnvironment;