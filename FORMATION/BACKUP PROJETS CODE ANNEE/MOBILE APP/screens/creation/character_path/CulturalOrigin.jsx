import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ImageBackground, ScrollView, Modal, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from './character_styles/CulturalOrigin.styles';
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

// Composant principal pour gérer les origines culturelles
const CulturalOrigin = ({ navigation, route }) => {
  // Récupération de l'utilisateur depuis le contexte
  const { user } = useContext(UserContext);
  const [origins, setOrigins] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const { idPerso } = route.params; // Récupération de l'idPerso depuis les paramètres de navigation

  const fetchLanguages = async (originId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/languages/${originId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const languagesData = response.data;
      setLanguages(languagesData);

      if (languagesData.length > 0) {
        setSelectedLanguage(languagesData[0].nom_langue);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des langues:", error);
      alert('Erreur lors de la récupération des langues.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrigins = async () => {
    setLoading(true);
    try {
      const originsResponse = await axios.get("http://192.168.1.17:3000/api/origins", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const originsData = originsResponse.data;
      setOrigins(originsData);

      if (originsData.length > 0) {
        const initialOrigin = originsData[0];
        setSelectedOrigin(initialOrigin.nom_origine);
        await fetchLanguages(initialOrigin.id_origine);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des origines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchOrigins();
    }
  }, [user?.token]);

  const handleOriginChange = (itemValue, itemIndex) => {
    setSelectedOrigin(itemValue);
    const originId = origins[itemIndex].id_origine;
    fetchLanguages(originId);
  };

  const randomizeOrigin = () => {
    const randomIndex = Math.floor(Math.random() * origins.length);
    const randomOrigin = origins[randomIndex];
    setSelectedOrigin(randomOrigin.nom_origine);
    fetchLanguages(randomOrigin.id_origine);
  };

  const randomizeLanguage = () => {
    if (languages.length > 0) {
      const randomIndex = Math.floor(Math.random() * languages.length);
      setSelectedLanguage(languages[randomIndex].nom_langue);
    }
  };

  const onContinue = async () => {
    try {
      const origin = origins.find(o => o.nom_origine === selectedOrigin);
      const language = languages.find(l => l.nom_langue === selectedLanguage);
  
      if (!origin || !language) {
        alert("Origine culturelle ou langue invalide.");
        return;
      }
  
      const originId = origin.id_origine;
      const languageId = language.id_langue;
      const idPerso = route.params.idPerso;
  
      console.log("Updating character with ID:", idPerso);
      console.log("Selected Origin ID:", originId, "Selected Language ID:", languageId);
  
      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-culturalorigin/${idPerso}`,
        { id_origine: originId, id_langue: languageId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
  
      if (response.status === 200) {
        console.log("Personnage mis à jour avec succès:", response.data);
        Alert.alert("Succès", "Les Origines Culturelles et la Langue ont bien été sauvegardés !");
        navigation.navigate("GenPathPersonality", { idPerso: idPerso }); // Transmettre l'ID du personnage
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
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
          ORIGINES CULTURELLES :
        </Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="L'univers de Cyberpunk est multiculturel et international. Vous devez apprendre à vivre aux côtés de gens issus des quatre coins d'un monde fracturé et anarchique ou mourir à la première fois que vous regarderez de travers la mauvaise personne. Vos origines déterminent votre langue maternelle. Dans Cyberpunk RED, on part du principe que tout le monde connaît l'argot des Rues, le pidgin qui, au fil des évolutions, est devenu le langage universel du futur ténébreux, mais vous maîtrisez aussi une autre langue apprise sur les genoux de votre mère. Après avoir lancé un dé pour déterminer votre culture d'origine, choisissez une des langues proposées dans la case adjacente. Vous commencez avec 4 points dans cette compétence de Langue. Il existe des centaines de langues autour du monde, mais pour cet ouvrage, nous avons établi la liste des langues les plus courantes de l'Ere du Rouge pour chaque région. Si vous souhaitez que votre personnage parle une langue qui n'est pas mentionnée, notez votre choix à la place des suggestions de la liste ci-dessous."
            style={styles.descriptionText} 
          />
        </ScrollView>
      </LinearGradient>
  
      <View style={styles.fullContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Votre origine culturelle :</Text>
          <Picker
            selectedValue={selectedOrigin}
            style={styles.picker}
            onValueChange={handleOriginChange}
          >
            {origins.map((origin) => (
              <Picker.Item
                key={origin.id_origine}
                label={origin.nom_origine}
                value={origin.nom_origine}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={randomizeOrigin}>
            <Text style={styles.buttonText}>Origine aléatoire</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>La langue que vous connaissez :</Text>
          <Picker
            selectedValue={selectedLanguage}
            style={styles.picker}
            onValueChange={setSelectedLanguage}
          >
            {languages.map((language) => (
              <Picker.Item
                key={language.id_langue}
                label={language.nom_langue}
                value={language.nom_langue}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={randomizeLanguage}>
            <Text style={styles.buttonText}>Langue aléatoire</Text>
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
      </View>
    </ImageBackground>
  );
};

export default CulturalOrigin;