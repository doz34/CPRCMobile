import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from "./character_styles/GenPathEnemies.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const GenPathEnemies = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [numEnemies, setNumEnemies] = useState(0);
  const [enemies, setEnemies] = useState([]);
  const [leses, setLeses] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [supports, setSupports] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [currentSupportIndex, setCurrentSupportIndex] = useState(null);
  const [idPerso, setIdPerso] = useState(route.params?.idPerso);
  const [lancers, setLancers] = useState([]);

  // Fonction pour récupérer les données depuis l'API
  const fetchData = async (endpoint, setState) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/${endpoint}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setState(response.data);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des données de ${endpoint}:`,
        error
      );
      alert(`Erreur lors de la récupération des données de ${endpoint}.`);
    } finally {
      setLoading(false);
    }
  };

  // Utilisation de useEffect pour récupérer les données lors du montage du composant
  useEffect(() => {
    if (user?.token) {
      fetchData("ennemis", setEnemies);
      fetchData("lese_ennemi", setLeses);
      fetchData("motif_ennemi", setReasons);
      fetchData("soutien_ennemi", setSupports);
      fetchData("rencontre_ennemi", setReactions);

      if (!idPerso) {
        const fetchLastCharacter = async () => {
          try {
            const response = await axios.get(
              "http://192.168.1.17:3000/api/character/last",
              {
                headers: { Authorization: `Bearer ${user?.token}` },
              }
            );
            if (response.data) {
              setIdPerso(response.data.id_perso);
            }
          } catch (error) {
            console.error(
              "Erreur lors de la récupération du dernier personnage:",
              error
            );
            alert("Erreur lors de la récupération du dernier personnage.");
          }
        };
        fetchLastCharacter();
      }
    }
  }, [user?.token]);

  // Fonction pour gérer la sélection aléatoire
  const randomizeSelection = (data, setSelected, index, field) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    handleEnemyChange(index, field, data[randomIndex]);
  };

  // Fonction pour gérer le changement du nombre d'ennemis
  const handleNumEnemiesChange = (value) => {
    setNumEnemies(value);
    setSelectedEnemies(
      Array(value).fill({
        name: "",
        type: enemies[0] || null,
        lese: leses[0] || null,
        reason: reasons[0] || null,
        support: supports[0] || null,
        reaction: reactions[0] || null,
        supportNumber: null,
      })
    );
  };

  // Fonction pour gérer les changements dans les dropdowns
  const handleEnemyChange = (index, field, value) => {
    const newEnemies = [...selectedEnemies];
    newEnemies[index] = { ...newEnemies[index], [field]: value };
    setSelectedEnemies(newEnemies);

    // Vérification des conditions pour afficher le modal de support
    if (field === "support" && (value.id_soutenn === 5 || value.id_soutenn === 6)) {
      setCurrentSupportIndex(index);
      fetchLancers(value.id_soutenn);
      setSupportModalVisible(true);
    }
  };

  // Fonction pour récupérer les lancers en fonction de id_soutenn
  const fetchLancers = async (idSoutenn) => {
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/lancers_simples/${idSoutenn}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setLancers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des lancers:", error);
      alert("Erreur lors de la récupération des lancers.");
    }
  };

  // Fonction pour gérer le changement du nombre de soutiens
  const handleSupportNumberChange = (index, value) => {
    const newEnemies = [...selectedEnemies];
    newEnemies[index] = { ...newEnemies[index], supportNumber: value };
    setSelectedEnemies(newEnemies);
  };

  // Fonction pour continuer à la prochaine étape
  const onContinue = async () => {
    if (!idPerso) {
      alert("ID du personnage non défini.");
      return;
    }

    if (numEnemies === 0) {
      try {
        // Supprimer les ennemis existants
        await axios.delete(
          `http://192.168.1.17:3000/api/custom_ennemi/${idPerso}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        // Mettre à jour le personnage pour indiquer qu'il n'a pas d'ennemis
        await axios.put(
          `http://192.168.1.17:3000/api/character/update-no-enemies/${idPerso}`,
          { no_ennemi: true },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        Alert.alert("Succès", "Les données ont été enregistrées avec succès.");
        navigation.navigate("GenPathLove");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du personnage :", error);
        alert("Erreur lors de la mise à jour du personnage.");
      }
      return;
    }

    for (let i = 0; i < numEnemies; i++) {
      const enemy = selectedEnemies[i];
      if (
        !enemy.name ||
        enemy.name.length < 3 ||
        !/^[a-zA-Z0-9]+$/.test(enemy.name)
      ) {
        alert(`Veuillez remplir correctement le nom de l'ennemi ${i + 1}.`);
        return;
      }
    }

    try {
      const characterResponse = await axios.get(
        `http://192.168.1.17:3000/api/character/${idPerso}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (characterResponse.data.no_ennemi === false) {
        await axios.delete(
          `http://192.168.1.17:3000/api/custom_ennemi/${idPerso}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      }

      await axios.put(
        `http://192.168.1.17:3000/api/character/update-no-enemies/${idPerso}`,
        { no_ennemi: false },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      for (let i = 0; i < numEnemies; i++) {
        const enemy = selectedEnemies[i];

        const enemyResponse = await axios.post(
          `http://192.168.1.17:3000/api/nom_ennemi`,
          { nom: enemy.name },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        await axios.post(
          `http://192.168.1.17:3000/api/custom_ennemi`,
          {
            id_perso: idPerso,
            id_nomenn: enemyResponse.data.id_nomenn,
            id_ennemi: enemy.type.id_ennemi,
            id_lesenn: enemy.lese.id_lesenn,
            id_motenn: enemy.reason.id_motenn,
            id_soutenn: enemy.support.id_soutenn,
            id_rencenn: enemy.reaction.id_rencenn,
            supportNumber: enemy.supportNumber,
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      }

      Alert.alert("Succès", "Les données ont été enregistrées avec succès.");
      navigation.navigate("GenPathLove");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du personnage :", error);
      alert("Erreur lors de la mise à jour du personnage.");
    }
  };

  // Fonction pour quitter sans sauvegarder
  const onQuit = () => {
    setModalVisible(true);
  };

  // Fonction pour confirmer la sortie
  const confirmQuit = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

  // Fonction pour fermer le modal de support
  const closeSupportModal = () => {
    setSupportModalVisible(false);
    setCurrentSupportIndex(null);
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
        <Text style={styles.descriptionTitle}>VOS ENNEMIS :</Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Décrivez les ennemis de votre personnage."
            style={styles.descriptionText}
          />
        </ScrollView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Nombre d'ennemis :</Text>
          <Picker
            selectedValue={numEnemies}
            style={styles.picker}
            onValueChange={(itemValue) => handleNumEnemiesChange(itemValue)}
          >
            {[0, 1, 2, 3].map((value) => (
              <Picker.Item key={value} label={value.toString()} value={value} />
            ))}
          </Picker>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              handleNumEnemiesChange(Math.floor(Math.random() * 4))
            }
          >
            <Text style={styles.buttonText}>Nombre aléatoire</Text>
          </TouchableOpacity>
        </View>

        {Array.from({ length: numEnemies }).map((_, index) => (
          <View key={index} style={styles.enemyContainer}>
            <Text style={styles.title}>Nom Ennemi {index + 1} :</Text>
            <TextInput
              style={styles.input}
              value={selectedEnemies[index]?.name}
              onChangeText={(value) => handleEnemyChange(index, "name", value)}
            />
            <Text style={styles.title}>Type Ennemi {index + 1} :</Text>
            <Picker
              selectedValue={selectedEnemies[index]?.type}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleEnemyChange(index, "type", itemValue)
              }
            >
              {enemies.map((enemy) => (
                <Picker.Item
                  key={enemy.id_ennemi}
                  label={enemy.desc_ennemi}
                  value={enemy}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                randomizeSelection(enemies, handleEnemyChange, index, "type")
              }
            >
              <Text style={styles.buttonText}>Type Aléatoire</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              Qui a été lésé (Ennemi {index + 1}) ? :
            </Text>
            <Picker
              selectedValue={selectedEnemies[index]?.lese}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleEnemyChange(index, "lese", itemValue)
              }
            >
              {leses.map((lese) => (
                <Picker.Item
                  key={lese.id_lesenn}
                  label={lese.lese}
                  value={lese}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                randomizeSelection(leses, handleEnemyChange, index, "lese")
              }
            >
              <Text style={styles.buttonText}>Personne lésée Aléatoire</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              Raison de l'inimitié (Ennemi {index + 1}) :
            </Text>
            <Picker
              selectedValue={selectedEnemies[index]?.reason}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleEnemyChange(index, "reason", itemValue)
              }
            >
              {reasons.map((reason) => (
                <Picker.Item
                  key={reason.id_motenn}
                  label={reason.desc_motenn}
                  value={reason}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                randomizeSelection(reasons, handleEnemyChange, index, "reason")
              }
            >
              <Text style={styles.buttonText}>Raison aléatoire</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Soutiens (Ennemi {index + 1}) :</Text>
            <Picker
              selectedValue={selectedEnemies[index]?.support}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleEnemyChange(index, "support", itemValue)
              }
            >
              {supports.map((support) => (
                <Picker.Item
                  key={support.id_soutenn}
                  label={support.desc_soutenn}
                  value={support}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                randomizeSelection(
                  supports,
                  handleEnemyChange,
                  index,
                  "support"
                )
              }
            >
              <Text style={styles.buttonText}>Soutiens aléatoire</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              Votre réaction si vous croisez l'ennemi {index + 1} :
            </Text>
            <Picker
              selectedValue={selectedEnemies[index]?.reaction}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleEnemyChange(index, "reaction", itemValue)
              }
            >
              {reactions.map((reaction) => (
                <Picker.Item
                  key={reaction.id_rencenn}
                  label={reaction.desc_rencenn}
                  value={reaction}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                randomizeSelection(
                  reactions,
                  handleEnemyChange,
                  index,
                  "reaction"
                )
              }
            >
              <Text style={styles.buttonText}>Réaction aléatoire</Text>
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
              Vous allez retourner au menu sans sauvegarder les informations de
              cette page. Les informations des pages précédentes ont déjà été
              sauvegardées, confirmer ?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={confirmQuit}
              >
                <Text style={styles.buttonText}>OUI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>ANNULER</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={supportModalVisible}
        onRequestClose={closeSupportModal}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["#484848", "#868686"]}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Nombre de soutiens :</Text>
            {selectedEnemies[currentSupportIndex]?.support?.id_soutenn === 5 && (
              <View style={styles.supportNumberContainer}>
                <Picker
                  selectedValue={
                    selectedEnemies[currentSupportIndex]?.supportNumber
                  }
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleSupportNumberChange(currentSupportIndex, itemValue)
                  }
                >
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
                    <Picker.Item
                      key={value}
                      label={value.toString()}
                      value={value}
                    />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    const randomIndex = Math.floor(Math.random() * 5) + 1;
                    handleSupportNumberChange(currentSupportIndex, randomIndex);
                  }}
                >
                  <Text style={styles.buttonText}>Nombre aléatoire</Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedEnemies[currentSupportIndex]?.support?.id_soutenn === 6 && (
              <View style={styles.supportNumberContainer}>
                <Picker
                  selectedValue={
                    selectedEnemies[currentSupportIndex]?.supportNumber
                  }
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleSupportNumberChange(currentSupportIndex, itemValue)
                  }
                >
                  {Array.from({ length: 10 }, (_, i) => i + 6).map((value) => (
                    <Picker.Item
                      key={value}
                      label={value.toString()}
                      value={value}
                    />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    const randomIndex = Math.floor(Math.random() * 10) + 6;
                    handleSupportNumberChange(currentSupportIndex, randomIndex);
                  }}
                >
                  <Text style={styles.buttonText}>Nombre aléatoire</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.button} onPress={closeSupportModal}>
              <Text style={styles.buttonText}>Confirmer</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default GenPathEnemies;