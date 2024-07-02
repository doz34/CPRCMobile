import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ImageBackground } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from './character_styles/CulturalOrigin.styles';

const CulturalOrigin = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [origins, setOrigins] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialOriginId, setInitialOriginId] = useState(null);

  const fetchLanguages = async (originId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/languages/${originId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setLanguages(response.data);
  
      if (route.params?.idLangue) {
        const initialLanguage = response.data.find(l => l.id_langue === route.params.idLangue);
        setSelectedLanguage(initialLanguage ? initialLanguage.nom_langue : response.data[0]?.nom_langue);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des langues:", error);
      alert('Erreur lors de la récupération des langues.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchOrigins = async () => {
      setLoading(true);
      try {
        const originsResponse = await axios.get("http://192.168.1.17:3000/api/origins", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        setOrigins(originsResponse.data);

        // Présélection de l'origine si elle existe
        let initialId = originsResponse.data[0].id_origine;
        if (route.params?.idOrigine) {
          initialId = route.params.idOrigine;
        }

        const initialOrigin = originsResponse.data.find((o) => o.id_origine === initialId);
        if (initialOrigin) {
          setSelectedOrigin(initialOrigin.nom_origine);
          setInitialOriginId(initialId);
          await fetchLanguages(initialId);
        }

      } catch (error) {
        console.error("Erreur lors de la récupération des origines:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchOrigins();
    }
  }, [user?.token]);

  const handleOriginChange = (itemValue, itemIndex) => {
    setSelectedOrigin(itemValue);
    const originId = origins[itemIndex].id_origine;
    setInitialOriginId(originId);
    fetchLanguages(originId);
  };

  const randomizeOrigin = () => {
    const randomIndex = Math.floor(Math.random() * origins.length);
    const randomOrigin = origins[randomIndex];
    setSelectedOrigin(randomOrigin.nom_origine);
    setInitialOriginId(randomOrigin.id_origine);
    fetchLanguages(randomOrigin.id_origine);
  };

  const randomizeLanguage = () => {
    if (languages.length > 0) {
      const randomIndex = Math.floor(Math.random() * languages.length);
      setSelectedLanguage(languages[randomIndex].nom_langue);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const onContinue = async () => {
    try {
      const originId = origins.find(o => o.nom_origine === selectedOrigin).id_origine;
      const languageId = languages.find(l => l.nom_langue === selectedLanguage).id_langue;
      const idPerso = route.params.idPerso;
      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-personnage/${idPerso}`,
        { id_origine: originId, id_langue: languageId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (response.status === 200) {
        console.log("Personnage mis à jour avec succès:", response.data);
        navigation.navigate("NextScreen");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du personnage :", error);
      alert('Erreur lors de la mise à jour du personnage.');
    }
  };
  
  return (
    <ImageBackground
      source={require("../../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Votre origine culturelle :</Text>
          <Picker
            selectedValue={selectedOrigin}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => handleOriginChange(itemValue, itemIndex)}
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
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
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

        <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default CulturalOrigin;