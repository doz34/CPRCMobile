import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from "./character_styles/GenPathClothing.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathClothing = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [stylesList, setStylesList] = useState([]);
  const [haircuts, setHaircuts] = useState([]);
  const [favoriteAccessories, setFavoriteAccessories] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedHaircut, setSelectedHaircut] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(route.params?.idPerso);
  const [styleDescription, setStyleDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // État pour gérer la visibilité de la modale

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const characterId = route.params?.idPerso;
        const roleId = route.params?.idRole;
        if (!characterId || !roleId) {
          throw new Error("Character ID or Role ID not provided");
        }
        setIdPerso(characterId);

        // Fetch character details
        const characterResponse = await axios.get(
          `http://192.168.1.17:3000/api/character/${characterId}`,
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const characterData = characterResponse.data;
        console.log("Character data:", characterData); // Log pour débogage

        // Fetch styles based on role
        const stylesResponse = await axios.get(
          `http://192.168.1.17:3000/api/character/styles/${roleId}`,
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const stylesData = stylesResponse.data;
        setStylesList(stylesData);

        // Fetch haircuts
        const haircutsResponse = await axios.get(
          "http://192.168.1.17:3000/api/character/haircuts",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const haircutsData = haircutsResponse.data;
        setHaircuts(haircutsData);

        // Fetch favorite accessories
        const accessoriesResponse = await axios.get(
          "http://192.168.1.17:3000/api/character/accessories",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const accessoriesData = accessoriesResponse.data;
        setFavoriteAccessories(accessoriesData);

        // Set the initial style description if a style is already selected
        if (characterData.id_style) {
          const selectedStyle = stylesData.find(style => style.id_style === characterData.id_style);
          if (selectedStyle) {
            setSelectedStyle(selectedStyle);
            setStyleDescription(selectedStyle.description);
          }
        } else {
          // Select the first item by default if no style is selected
          if (stylesData.length > 0) {
            setSelectedStyle(stylesData[0]);
            setStyleDescription(stylesData[0].description);
          }
        }

        // Select the first haircut and accessory by default
        if (haircutsData.length > 0) {
          setSelectedHaircut(haircutsData[0]);
        }
        if (accessoriesData.length > 0) {
          setSelectedAccessory(accessoriesData[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        alert("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchData();
    } else {
      alert("Utilisateur non authentifié");
    }
  }, [user?.token, route.params?.idPerso, route.params?.idRole]);

  const handleStyleChange = (itemValue) => {
    setSelectedStyle(itemValue);
    setStyleDescription(itemValue.description);
  };

  const randomizeSelection = (list, setSelected) => {
    const randomIndex = Math.floor(Math.random() * list.length);
    const selectedItem = list[randomIndex];
    setSelected(selectedItem);
    if (setSelected === setSelectedStyle) {
      setStyleDescription(selectedItem.description);
    }
  };

  const onSaveClothing = async () => {
    if (!selectedStyle || !selectedHaircut || !selectedAccessory || !user?.token || !idPerso) {
      alert("Veuillez sélectionner tous les champs.");
      return;
    }

    try {
      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-clothing/${idPerso}`,
        {
          id_style: selectedStyle.id_style,
          id_coupe: selectedHaircut.id_coupe,
          id_accfav: selectedAccessory.id_accfav,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (response.status === 200) {
        alert("Tenue mise à jour avec succès!");
        navigation.navigate("GenPathMotRel", { idPerso: idPerso }); // Transmettre l'ID du personnage
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tenue:", error);
      alert("Erreur lors de la mise à jour de la tenue.");
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
        <Text style={styles.descriptionTitle}>TENUE ET STYLE :</Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Choisissez votre style vestimentaire, votre coupe de cheveux et vos accessoires favoris."
            style={styles.descriptionText}
          />
        </ScrollView>
      </LinearGradient>

      <View style={styles.fullContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Style Vestimentaire :</Text>
          <Picker
            selectedValue={selectedStyle}
            style={styles.picker}
            onValueChange={(itemValue) => handleStyleChange(itemValue)}
          >
            {stylesList.map((style) => (
              <Picker.Item
                key={style.id_style}
                label={style.nom}
                value={style}
              />
            ))}
          </Picker>
          <TouchableOpacity
            style={styles.button}
            onPress={() => randomizeSelection(stylesList, setSelectedStyle)}
          >
            <Text style={styles.buttonText}>Style Aléatoire</Text>
          </TouchableOpacity>
          <Text style={styles.impressionText}>Impression : {styleDescription}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Coupe de cheveux :</Text>
          <Picker
            selectedValue={selectedHaircut}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedHaircut(itemValue)}
          >
            {haircuts.map((haircut) => (
              <Picker.Item
                key={haircut.id_coupe}
                label={haircut.nom_coupe}
                value={haircut}
              />
            ))}
          </Picker>
          <TouchableOpacity
            style={styles.button}
            onPress={() => randomizeSelection(haircuts, setSelectedHaircut)}
          >
            <Text style={styles.buttonText}>Coupe Aléatoire</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Accessoires favoris :</Text>
          <Picker
            selectedValue={selectedAccessory}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedAccessory(itemValue)}
          >
            {favoriteAccessories.map((accessory) => (
              <Picker.Item
                key={accessory.id_accfav}
                label={accessory.nom_accfav}
                value={accessory}
              />
            ))}
          </Picker>
          <TouchableOpacity
            style={styles.button}
            onPress={() => randomizeSelection(favoriteAccessories, setSelectedAccessory)}
          >
            <Text style={styles.buttonText}>Accessoire Aléatoire</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Text style={styles.buttonText}>QUITTER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={onSaveClothing}>
            <Text style={styles.buttonText}>Continuer</Text>
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
    </ImageBackground>
  );
};

export default GenPathClothing;