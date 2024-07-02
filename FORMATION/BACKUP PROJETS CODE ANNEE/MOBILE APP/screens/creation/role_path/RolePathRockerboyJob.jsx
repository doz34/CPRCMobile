import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Modal,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import styles from "./role_styles/RolePathRockerboyJob.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const RolePathRockerboyJob = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(route.params.idPerso);
  const [modalVisible, setModalVisible] = useState(false);

  const [typeRoles, setTypeRoles] = useState([]);
  const [selectedTypeRole, setSelectedTypeRole] = useState(null);

  const [travailSoloTeams, setTravailSoloTeams] = useState([]);
  const [selectedTravailSoloTeam, setSelectedTravailSoloTeam] = useState(null);

  const [travailSoloTeamsPass, setTravailSoloTeamsPass] = useState([]);
  const [selectedTravailSoloTeamPass, setSelectedTravailSoloTeamPass] = useState(null);

  const [specifiques, setSpecifiques] = useState([]);
  const [selectedSpecifique, setSelectedSpecifique] = useState(null);

  const [imageUrl, setImageUrl] = useState(null);

  const fetchData = async (endpoint, setState, filterFn) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const filteredData = response.data.filter(filterFn);
      setState(filteredData);
    } catch (error) {
      console.error(`Erreur lors de la récupération des données de ${endpoint}:`, error);
      alert(`Erreur lors de la récupération des données de ${endpoint}.`);
    } finally {
      setLoading(false);
    }
  };

  const fetchImageUrl = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.17:3000/api/roles/1",
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      if (response.status === 200 && response.data.role_img) {
        const fullImageUrl = `http://192.168.1.17:3000/${response.data.role_img}`;
        setImageUrl(fullImageUrl);
      } else {
        console.error("Invalid response data:", response.data);
        alert("Erreur: Données de réponse invalides.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'image:", error);
      alert(`Erreur lors de la récupération de l'image: ${error.message}`);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchData('roles/type_role', setTypeRoles, role => role.id_typrol >= 1 && role.id_typrol <= 10);
      fetchData('roles/travail_soloteam', setTravailSoloTeams, team => team.id_travsolteam === 1 || team.id_travsolteam === 2);
      fetchData('roles/travail_soloteam_passe', setTravailSoloTeamsPass, () => true);
      fetchData('roles/specifique', setSpecifiques, spec => spec.id_spec >= 1 && spec.id_spec <= 6);
      fetchImageUrl();
    }
  }, [user?.token]);

  const randomizeSelection = (data, setSelected) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setSelected(data[randomIndex]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleSave = async () => {
    try {
      await axios.post(
        "http://192.168.1.17:3000/api/roles/custom_role_path",
        {
          id_perso: idPerso,
          id_typrol: selectedTypeRole?.id_typrol,
          id_travsolteam: selectedTravailSoloTeam?.id_travsolteam,
          id_travsolteampass: selectedTravailSoloTeamPass?.id_travsolteampass,
          id_spec: selectedSpecifique?.id_spec,
          visibility: {
            id_typrol: true,
            id_travsolteam: true,
            id_travsolteampass: selectedTravailSoloTeam?.id_travsolteam === 2,
            id_spec: selectedTravailSoloTeam?.desc_travsolteam !== "En groupe" && selectedTravailSoloTeamPass?.id_travsolteampass === 1,
          },
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      navigation.navigate("RolePathRockerboyPlace");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données:", error);
      alert("Erreur lors de l'enregistrement des données.");
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
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.rockerImage} />
        </View>
      )}

      <LinearGradient
        colors={["#868686", "#484848"]}
        style={styles.descriptionContainer}
      >
        <Text style={styles.descriptionTitle}>QUEL ROCKEUR ÊTES-VOUS ? :</Text>
        <ScrollView style={styles.scrollableContentContainer}>
          <MyTextSimple
            text="Lorem ipsum dolor sit amet ..."
            style={styles.descriptionText}
          />
        </ScrollView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Quel genre de Rockeur êtes-vous ?</Text>
          <Picker
            selectedValue={selectedTypeRole}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedTypeRole(itemValue)}
          >
            {typeRoles.map((role) => (
              <Picker.Item key={role.id_typrol} label={role.desc_typrol} value={role} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={() => randomizeSelection(typeRoles, setSelectedTypeRole)}>
            <Text style={styles.buttonText}>Type aléatoire</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Êtes-vous dans un groupe ?</Text>
          <Picker
            selectedValue={selectedTravailSoloTeam}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedTravailSoloTeam(itemValue)}
          >
            {travailSoloTeams.map((team) => (
              <Picker.Item key={team.id_travsolteam} label={team.desc_travsolteam} value={team} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={() => randomizeSelection(travailSoloTeams, setSelectedTravailSoloTeam)}>
            <Text style={styles.buttonText}>Choisis pour moi</Text>
          </TouchableOpacity>
        </View>

        {selectedTravailSoloTeam?.id_travsolteam === 2 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>Êtiez-vous dans un groupe autrefois ?</Text>
            <Picker
              selectedValue={selectedTravailSoloTeamPass}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedTravailSoloTeamPass(itemValue)}
            >
              {travailSoloTeamsPass.map((teamPass) => (
                <Picker.Item key={teamPass.id_travsolteampass} label={teamPass.desc_travsolteampass} value={teamPass} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.button} onPress={() => randomizeSelection(travailSoloTeamsPass, setSelectedTravailSoloTeamPass)}>
              <Text style={styles.buttonText}>Choisis pour moi</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedTravailSoloTeam?.desc_travsolteam !== "En groupe" && selectedTravailSoloTeamPass?.id_travsolteampass === 1 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>Pourquoi êtes-vous parti ?</Text>
            <Picker
              selectedValue={selectedSpecifique}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedSpecifique(itemValue)}
            >
              {specifiques.map((spec) => (
                <Picker.Item key={spec.id_spec} label={spec.desc_spec} value={spec} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.button} onPress={() => randomizeSelection(specifiques, setSelectedSpecifique)}>
              <Text style={styles.buttonText}>Raison aléatoire</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
            <Text style={styles.buttonText}>QUITTER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={handleSave}>
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

export default RolePathRockerboyJob;