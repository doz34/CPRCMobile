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
import styles from "./character_styles/CulturalOrigin.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";
import GenPathPersonalityStyles from "./character_styles/GenPathPersonality.styles";

const GenPathPersonality = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      console.log("Fetching characters...");
      setLoading(true);
      try {
        // Fetch characters
        const charactersResponse = await axios.get(
          "http://192.168.1.17:3000/api/caractere",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const charactersData = charactersResponse.data;
        console.log("Characters fetched:", charactersData);

        if (!Array.isArray(charactersData)) {
          throw new Error("Invalid response format for characters");
        }

        setCharacters(charactersData);

        // Preselect the first character if available
        if (charactersData.length > 0) {
          setSelectedCharacter(charactersData[0]);
        } else {
          alert("Aucun caractère disponible");
        }

        // Fetch the last character created by the user
        const lastCharacterResponse = await axios.get(
          "http://192.168.1.17:3000/api/character/last",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const lastCharacterData = lastCharacterResponse.data;
        console.log("Last character fetched:", lastCharacterData);

        if (!lastCharacterData?.id_perso) {
          throw new Error("Character ID not found");
        }

        setIdPerso(lastCharacterData.id_perso);
      } catch (error) {
        console.error("Erreur lors de la récupération des caractères:", error);
        alert("Erreur lors de la récupération des caractères ou du dernier personnage.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchCharacters();
    } else {
      alert("Utilisateur non authentifié");
    }
  }, [user?.token]);

  const handleCharacterChange = (itemValue) => {
    setSelectedCharacter(itemValue);
    console.log("Selected Character:", itemValue);
  };

  const randomizeCharacter = () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    setSelectedCharacter(characters[randomIndex]);
    console.log("Randomized Character:", characters[randomIndex]);
  };

  const onSaveCharacter = async () => {
    console.log("Saving character...");
    console.log("Selected Character:", selectedCharacter, "User:", user, "ID Perso:", idPerso);

    if (!selectedCharacter?.id_caractere || !user?.token || !idPerso) {
      alert("Character, user token, or user ID is missing.");
      console.error("Missing data - Selected Character:", selectedCharacter, "User:", user, "ID Perso:", idPerso);
      return;
    }

    console.log("Updating character for user ID:", idPerso);

    try {
      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-character/${idPerso}`,
        { id_caractere: selectedCharacter.id_caractere },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      console.log("Server response:", response);

      if (response.status === 200) {
        console.log("Personnage mis à jour avec succès:", response.data);
        alert("Caractère mis à jour avec succès!");
        navigation.navigate("NextScreen");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du caractère:", error);
      alert("Erreur lors de la mise à jour du caractère.");
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
        <Text style={styles.descriptionTitle}>VOTRE PERSONNALITÉ :</Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Ce tableau définit votre caractère. Etes-vous plutôt du genre à vous tenir à l'écart de la meute, à rester seul pour laisser votre esprit calculateur s'épanouir? Etes-vous un fêtard qui adore mettre la pagaille ? Un professionnel compétent et assuré qui a toujours un plan de secours ?"
            style={styles.descriptionText}
          />
        </ScrollView>
      </LinearGradient>

      <View style={styles.fullContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Quel est votre caractère :</Text>
          <Picker
            selectedValue={selectedCharacter}
            style={styles.picker}
            onValueChange={(itemValue) => handleCharacterChange(itemValue)}
          >
            {characters.map((character) => (
              <Picker.Item
                key={character.id_caractere}
                label={character.desc_caractere}
                value={character}
              />
            ))}
          </Picker>

          <TouchableOpacity style={styles.button} onPress={randomizeCharacter}>
            <Text style={styles.buttonText}>Caractère Aléatoire</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={onSaveCharacter}
        >
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default GenPathPersonality;