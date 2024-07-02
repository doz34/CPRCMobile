import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground, ScrollView, Modal, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from './character_styles/GenPathLove.styles';
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathLove = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [numTragedies, setNumTragedies] = useState(0);
  const [loves, setLoves] = useState([]);
  const [selectedLoves, setSelectedLoves] = useState([]);
  const [selectedTragedies, setSelectedTragedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [idPerso, setIdPerso] = useState(user?.idPerso || route.params?.idPerso);

  const fetchData = async (endpoint, setState) => {
    setLoading(true);
    try {
      console.log(`Fetching data from ${endpoint}`);
      const response = await axios.get(`http://192.168.1.17:3000/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setState(response.data);
      console.log(`Data fetched from ${endpoint}:`, response.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération des données de ${endpoint}:`, error);
      alert(`Erreur lors de la récupération des données de ${endpoint}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchData('tragedies', setLoves);

      // if (!idPerso) {
//   const fetchLastCharacter = async () => {
//     try {
//       console.log("Fetching last character");
//       const response = await axios.get('http://192.168.1.17:3000/api/character/last', {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       if (response.data) {
//         setIdPerso(response.data.id_perso);
//         console.log("Last character fetched:", response.data);
//       }
//     } catch (error) {
//       console.error("Erreur lors de la récupération du dernier personnage:", error);
//       alert('Erreur lors de la récupération du dernier personnage.');
//     }
//   };
//   fetchLastCharacter();
// }
    }
  }, [user?.token]);

  const randomizeSelection = (data, setSelected) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setSelected(data[randomIndex]);
  };

  const handleNumTragediesChange = (value) => {
    setNumTragedies(value);
    setSelectedLoves(Array(value).fill(''));
    setSelectedTragedies(Array(value).fill(null));
  };

  const handleLoveNameChange = (index, value) => {
    const newLoves = [...selectedLoves];
    newLoves[index] = value;
    setSelectedLoves(newLoves);
  };

  const handleTragedyChange = (index, value) => {
    const newTragedies = [...selectedTragedies];
    newTragedies[index] = value;
    setSelectedTragedies(newTragedies);
  };

  const onContinue = async () => {
    if (!idPerso) {
      alert('ID du personnage non défini.');
      return;
    }

    try {
      console.log("Deleting existing love tragedies for character:", idPerso);
      await axios.delete(`http://192.168.1.17:3000/api/custom_amour/${idPerso}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (numTragedies === 0) {
        console.log("Updating character with no love tragedies");
        await axios.put(
          `http://192.168.1.17:3000/api/character/update-no-love/${idPerso}`,
          { no_amour: true },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } else {
        console.log("Updating character with love tragedies");
        await axios.put(
          `http://192.168.1.17:3000/api/character/update-no-love/${idPerso}`,
          { no_amour: false },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        for (let i = 0; i < numTragedies; i++) {
          if (!selectedLoves[i] || !selectedTragedies[i]) {
            alert(`Veuillez remplir toutes les informations pour l'amour ${i + 1}.`);
            return;
          }

          console.log(`Adding love tragedy ${i + 1} for character:`, {
            love: selectedLoves[i],
            tragedy: selectedTragedies[i]
          });

          const loveResponse = await axios.post(
            `http://192.168.1.17:3000/api/nom_amour`,
            { nom: selectedLoves[i] },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          await axios.post(
            `http://192.168.1.17:3000/api/custom_amour`,
            {
              id_perso: idPerso,
              id_nomamo: loveResponse.data.id_nomamo,
              id_tragamo: selectedTragedies[i].id_tragamo,
            },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
        }
      }

      Alert.alert("Succès", "Les données ont été enregistrées avec succès.");
      navigation.navigate("GenPathObjective", { idPerso });
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
          VOTRE TRAGEDIE AMOUREUSE :
        </Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Décrivez les tragédies amoureuses de votre personnage."
            style={styles.descriptionText} 
          />
        </ScrollView>
      </LinearGradient>
  
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Nombre de tragédies amoureuses :</Text>
          <Picker
            selectedValue={numTragedies}
            style={styles.picker}
            onValueChange={(itemValue) => handleNumTragediesChange(itemValue)}
          >
            {[0, 1, 2, 3].map((value) => (
              <Picker.Item
                key={value}
                label={value.toString()}
                value={value}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={() => handleNumTragediesChange(Math.floor(Math.random() * 4))}>
            <Text style={styles.buttonText}>Nombre aléatoire</Text>
          </TouchableOpacity>
        </View>

        {Array.from({ length: numTragedies }).map((_, index) => (
          <View key={index} style={styles.loveContainer}>
            <Text style={styles.title}>Nom Amour {index + 1} :</Text>
            <TextInput
              style={styles.input}
              value={selectedLoves[index]}
              onChangeText={(value) => handleLoveNameChange(index, value)}
            />
            <Text style={styles.title}>Que s'est-il passé avec votre amant(e) {index + 1} ?</Text>
            <Picker
              selectedValue={selectedTragedies[index]}
              style={styles.picker}
              onValueChange={(itemValue) => handleTragedyChange(index, itemValue)}
            >
              {loves.map((tragedy) => (
                <Picker.Item
                  key={tragedy.id_tragamo}
                  label={tragedy.desc_tragamo}
                  value={tragedy}
                />
              ))}
            </Picker>
            <TouchableOpacity style={styles.button} onPress={() => randomizeSelection(loves, (value) => handleTragedyChange(index, value))}>
              <Text style={styles.buttonText}>Circonstance aléatoire</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Text style={styles.buttonText}>QUITTER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.buttonText}>CONTINUER</Text>
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

export default GenPathLove;