import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from "./character_styles/GenPathClothing.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathClothing = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [stylesList, setStylesList] = useState([]);
  const [haircuts, setHaircuts] = useState([]);
  const [favoriteAccessories, setFavoriteAccessories] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedHaircut, setSelectedHaircut] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(null);
  const [styleDescription, setStyleDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch the last character created by the user
        const lastCharacterResponse = await axios.get(
          "http://192.168.1.17:3000/api/character/last",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const lastCharacterData = lastCharacterResponse.data;
        if (!lastCharacterData?.id_perso) {
          throw new Error("Character ID not found");
        }
        setIdPerso(lastCharacterData.id_perso);

        // Fetch styles based on role
        const roleId = lastCharacterData.id_role;
        const stylesResponse = await axios.get(
          `http://192.168.1.17:3000/api/styles/${roleId}`,
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        setStylesList(stylesResponse.data);

        // Fetch haircuts
        const haircutsResponse = await axios.get(
          "http://192.168.1.17:3000/api/haircuts",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        setHaircuts(haircutsResponse.data);

        // Fetch favorite accessories
        const accessoriesResponse = await axios.get(
          "http://192.168.1.17:3000/api/accessories",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        setFavoriteAccessories(accessoriesResponse.data);
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
  }, [user?.token]);

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
        navigation.navigate("GenPathMotRel");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tenue:", error);
      alert("Erreur lors de la mise à jour de la tenue.");
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

        <TouchableOpacity
          style={styles.continueButton}
          onPress={onSaveClothing}
        >
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default GenPathClothing;