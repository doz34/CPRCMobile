import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ImageBackground, ScrollView, Modal, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from './character_styles/GenPathSocialOrigin.styles';
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathSocialOrigin = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [origins, setOrigins] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [idPerso, setIdPerso] = useState(route.params?.idPerso);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/origine_sociale`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setOrigins(response.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération des données d'origine sociale:`, error);
      alert(`Erreur lors de la récupération des données d'origine sociale.`);
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
    if (origins.length > 0) {
      setSelectedOrigin(origins[0]);
    }
  }, [origins]);

  const randomizeSelection = () => {
    const randomIndex = Math.floor(Math.random() * origins.length);
    setSelectedOrigin(origins[randomIndex]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const onContinue = async () => {
    if (!idPerso) {
      alert('ID du personnage non défini.');
      return;
    }
  
    if (!selectedOrigin || isNaN(parseInt(selectedOrigin.id_origine_sociale, 10))) {
      alert('Veuillez sélectionner une origine sociale avant de continuer.');
      return;
    }
  
    try {
      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-socialorigin/${idPerso}`,
        {
          id_origine_sociale: parseInt(selectedOrigin.id_origine_sociale, 10),
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (response.status === 200) {
        console.log("Personnage mis à jour avec succès:", response.data);
        Alert.alert("Succès", "Les données ont été enregistrées avec succès.");
        navigation.navigate("GenPathEnvironment", { idPerso: idPerso }); // Transmettre l'ID du personnage
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
          ORIGINES FAMILIALES :
        </Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text={selectedOrigin ? selectedOrigin.description : "Sélectionnez une origine sociale pour voir la description."}
            style={styles.descriptionText} 
          />
        </ScrollView>
      </LinearGradient>
  
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Origine Sociale :</Text>
          <Picker
            selectedValue={selectedOrigin}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedOrigin(itemValue)}
          >
            {origins.map((origin) => (
              <Picker.Item
                key={origin.id_origine_sociale}
                label={origin.nom_origine_sociale}
                value={origin}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={randomizeSelection}>
            <Text style={styles.buttonText}>Origine aléatoire</Text>
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

export default GenPathSocialOrigin;