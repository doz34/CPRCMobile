import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ImageBackground, ScrollView, Modal, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from './character_styles/GenPathMotRel.styles';
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathMotRel = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [values, setValues] = useState([]);
  const [opinions, setOpinions] = useState([]);
  const [importanceWho, setImportanceWho] = useState([]);
  const [importanceWhat, setImportanceWhat] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedOpinion, setSelectedOpinion] = useState(null);
  const [selectedImportanceWho, setSelectedImportanceWho] = useState(null);
  const [selectedImportanceWhat, setSelectedImportanceWhat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [idPerso, setIdPerso] = useState(route.params?.idPerso);

  const fetchData = async (endpoint, setState) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setState(response.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération des données de ${endpoint}:`, error);
      alert(`Erreur lors de la récupération des données de ${endpoint}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchData('valeur_fondamentale', setValues);
      fetchData('opinion_gens', setOpinions);
      fetchData('importance_qui', setImportanceWho);
      fetchData('importance_quoi', setImportanceWhat);

      // Si idPerso n'est pas défini, essayez de le récupérer depuis l'API
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

  const randomizeSelection = (data, setSelected) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setSelected(data[randomIndex]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const onContinue = async () => {
    if (!idPerso) {
      alert('ID du personnage non défini.');
      return;
    }
  
    // Vérifiez que toutes les valeurs sont bien définies et sont des entiers
    if (
      !selectedValue ||
      !selectedOpinion ||
      !selectedImportanceWho ||
      !selectedImportanceWhat ||
      isNaN(parseInt(selectedValue.id_valeur, 10)) ||
      isNaN(parseInt(selectedOpinion.id_opinion, 10)) ||
      isNaN(parseInt(selectedImportanceWho.id_importance_qui, 10)) ||
      isNaN(parseInt(selectedImportanceWhat.id_importance_quoi, 10))
    ) {
      alert('Veuillez sélectionner toutes les valeurs avant de continuer.');
      return;
    }
  
    console.log("ID du personnage:", idPerso);
    console.log("ID de la valeur fondamentale:", selectedValue.id_valeur);
    console.log("ID de l'opinion:", selectedOpinion.id_opinion);
    console.log("ID de l'importance qui:", selectedImportanceWho.id_importance_qui);
    console.log("ID de l'importance quoi:", selectedImportanceWhat.id_importance_quoi);
  
    try {
      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-motrel/${idPerso}`,
        {
          id_valeur: parseInt(selectedValue.id_valeur, 10),
          id_opinion: parseInt(selectedOpinion.id_opinion, 10),
          id_importance_qui: parseInt(selectedImportanceWho.id_importance_qui, 10),
          id_importance_quoi: parseInt(selectedImportanceWhat.id_importance_quoi, 10),
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (response.status === 200) {
        console.log("Personnage mis à jour avec succès:", response.data);
        Alert.alert("Succès", "Les données ont été enregistrées avec succès.");
        navigation.navigate("GenPathSocialOrigin", { idPerso: idPerso }); // Transmettre l'ID du personnage
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du personnage :", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      console.error("Error response headers:", error.response?.headers);
      console.error("Error config:", error.config);
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
          MOTIVATIONS ET RELATIONS :
        </Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Décrivez les motivations et relations de votre personnage."
            style={styles.descriptionText} 
          />
        </ScrollView>
      </LinearGradient>
  
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Quelle est votre valeur fondamentale ?</Text>
          <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
          >
            {values.map((value) => (
              <Picker.Item
                key={value.id_valeur}
                label={value.nom_valeur}
                value={value}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={() => randomizeSelection(values, setSelectedValue)}>
            <Text style={styles.buttonText}>Valeur aléatoire</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Que pensez-vous des gens en général ?</Text>
          <Picker
            selectedValue={selectedOpinion}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedOpinion(itemValue)}
          >
            {opinions.map((opinion) => (
              <Picker.Item
                key={opinion.id_opinion}
                label={opinion.desc_opinion}
                value={opinion}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={() => randomizeSelection(opinions, setSelectedOpinion)}>
            <Text style={styles.buttonText}>Opinion aléatoire</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Qui compte le plus dans votre vie ?</Text>
          <Picker
            selectedValue={selectedImportanceWho}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedImportanceWho(itemValue)}
          >
            {importanceWho.map((importance) => (
              <Picker.Item
                key={importance.id_importance_qui}
                label={importance.desc_importance_qui}
                value={importance}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={() => randomizeSelection(importanceWho, setSelectedImportanceWho)}>
            <Text style={styles.buttonText}>Importance aléatoire</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>À quoi tenez-vous le plus ?</Text>
          <Picker
            selectedValue={selectedImportanceWhat}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedImportanceWhat(itemValue)}
          >
            {importanceWhat.map((importance) => (
              <Picker.Item
                key={importance.id_importance_quoi}
                label={importance.desc_importance_quoi}
                value={importance}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={() => randomizeSelection(importanceWhat, setSelectedImportanceWhat)}>
            <Text style={styles.buttonText}>Importance aléatoire</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Text style={styles.buttonText}>QUITTER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.buttonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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

export default GenPathMotRel;