import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground, ScrollView, Modal, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from './character_styles/GenPathFriends.styles';
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathFriends = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [numFriends, setNumFriends] = useState(0);
  const [friends, setFriends] = useState([]);
  const [relations, setRelations] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedRelations, setSelectedRelations] = useState([]);
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
      fetchData('amis', setRelations);

      if (!idPerso) {
        const fetchLastCharacter = async () => {
          try {
            const response = await axios.get('http://192.168.1.17:3000/api/character/last', {
              headers: { Authorization: `Bearer ${user?.token}` },
            });
            if (response.data) {
              setIdPerso(response.data.id_perso);
              console.log("ID du dernier personnage récupéré:", response.data.id_perso);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du dernier personnage:", error);
            alert('Erreur lors de la récupération du dernier personnage.');
          }
        };
        fetchLastCharacter();
      } else {
        console.log("ID du personnage transmis:", idPerso);
      }
    }
  }, [user?.token]);

  const randomizeSelection = (data, setSelected) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setSelected(data[randomIndex]);
  };

  const handleNumFriendsChange = (value) => {
    setNumFriends(value);
    setSelectedFriends(Array(value).fill(''));
    setSelectedRelations(Array(value).fill(null));
  };

  const handleFriendNameChange = (index, value) => {
    const newFriends = [...selectedFriends];
    newFriends[index] = value;
    setSelectedFriends(newFriends);
  };

  const handleRelationChange = (index, value) => {
    const newRelations = [...selectedRelations];
    newRelations[index] = value;
    setSelectedRelations(newRelations);
  };

  const onContinue = async () => {
    if (!idPerso) {
      alert('ID du personnage non défini.');
      return;
    }

    console.log("ID du personnage avant la mise à jour:", idPerso);

    try {
      // Vérifier si le personnage a des amis existants
      const characterResponse = await axios.get(`http://192.168.1.17:3000/api/character/${idPerso}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      console.log("Données du personnage récupérées:", characterResponse.data);

      if (characterResponse.data.no_ami === false) {
        // Supprimer les amis existants
        await axios.delete(`http://192.168.1.17:3000/api/custom_ami/${idPerso}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        console.log("Amis existants supprimés pour le personnage:", idPerso);
      }

      if (numFriends === 0) {
        await axios.put(
          `http://192.168.1.17:3000/api/character/update-no-friends/${idPerso}`,
          { no_ami: true },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        console.log("Mise à jour du personnage sans amis:", idPerso);
      } else {
        await axios.put(
          `http://192.168.1.17:3000/api/character/update-no-friends/${idPerso}`,
          { no_ami: false },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        console.log("Mise à jour du personnage avec amis:", idPerso);

        for (let i = 0; i < numFriends; i++) {
          if (!selectedFriends[i] || !selectedRelations[i]) {
            alert(`Veuillez remplir toutes les informations pour l'ami ${i + 1}.`);
            return;
          }

          const friendResponse = await axios.post(
            `http://192.168.1.17:3000/api/nom_ami`,
            { nom: selectedFriends[i] },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          console.log(`Ami ${i + 1} ajouté avec succès:`, friendResponse.data);

          await axios.post(
            `http://192.168.1.17:3000/api/custom_ami`,
            {
              id_perso: idPerso,
              id_nomami: friendResponse.data.id_nomami,
              id_ami: selectedRelations[i].id_ami,
            },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          console.log(`Relation d'amitié ${i + 1} ajoutée avec succès pour le personnage:`, idPerso);
        }
      }

      Alert.alert("Succès", "Les données ont été enregistrées avec succès.");
      navigation.navigate("GenPathEnemies", { idPerso: idPerso }); // Transmettre l'ID du personnage
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
          VOS AMIS :
        </Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Décrivez les amis de votre personnage."
            style={styles.descriptionText} 
          />
        </ScrollView>
      </LinearGradient>
  
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Nombre d'amis :</Text>
          <Picker
            selectedValue={numFriends}
            style={styles.picker}
            onValueChange={(itemValue) => handleNumFriendsChange(itemValue)}
          >
            {[0, 1, 2, 3].map((value) => (
              <Picker.Item
                key={value}
                label={value.toString()}
                value={value}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={() => handleNumFriendsChange(Math.floor(Math.random() * 4))}>
            <Text style={styles.buttonText}>Nombre aléatoire</Text>
          </TouchableOpacity>
        </View>

        {Array.from({ length: numFriends }).map((_, index) => (
          <View key={index} style={styles.friendContainer}>
            <Text style={styles.title}>Nom Ami {index + 1} :</Text>
            <TextInput
              style={styles.input}
              value={selectedFriends[index]}
              onChangeText={(value) => handleFriendNameChange(index, value)}
            />
            <Text style={styles.title}>Relation d'amitié Ami {index + 1} :</Text>
            <Picker
              selectedValue={selectedRelations[index]}
              style={styles.picker}
              onValueChange={(itemValue) => handleRelationChange(index, itemValue)}
            >
              {relations.map((relation) => (
                <Picker.Item
                  key={relation.id_ami}
                  label={relation.desc_relami}
                  value={relation}
                />
              ))}
            </Picker>
            <TouchableOpacity style={styles.button} onPress={() => randomizeSelection(relations, (value) => handleRelationChange(index, value))}>
              <Text style={styles.buttonText}>Relation aléatoire</Text>
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

export default GenPathFriends;