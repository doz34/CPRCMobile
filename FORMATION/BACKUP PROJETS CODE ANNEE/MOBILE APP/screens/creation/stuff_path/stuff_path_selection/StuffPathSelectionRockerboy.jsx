import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../../context/UserContext";
import axios from "axios";
import styles from "./stuff_path_selection_styles/StuffPathSelectionRockerboy.styles";
import { LinearGradient } from "expo-linear-gradient";

const StuffPathSelectionRockerboy = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [idPerso, setIdPerso] = useState(route.params.idPerso);
  const [weapons, setWeapons] = useState([]);
  const [meleeWeapons, setMeleeWeapons] = useState([]);
  const [grenades, setGrenades] = useState([]);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [selectedMeleeWeapon, setSelectedMeleeWeapon] = useState(null);
  const [selectedGrenade, setSelectedGrenade] = useState(null);
  const [selectedGrenadeType, setSelectedGrenadeType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [meleeModalVisible, setMeleeModalVisible] = useState(false);
  const [grenadeModalVisible, setGrenadeModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [meleeModalContent, setMeleeModalContent] = useState({});
  const [grenadeModalContent, setGrenadeModalContent] = useState({});
  const [grenade1ModalVisible, setGrenade1ModalVisible] = useState(false);
  const [grenade2ModalVisible, setGrenade2ModalVisible] = useState(false);
  const [grenade1ModalContent, setGrenade1ModalContent] = useState({});
  const [grenade2ModalContent, setGrenade2ModalContent] = useState({});
  const [selectedAmmunition, setSelectedAmmunition] = useState(
    "Munitions Standard de Pistolet TL (x50)"
  );
  const [ammunitionModalVisible, setAmmunitionModalVisible] = useState(false);
  const [ammunitionModalContent, setAmmunitionModalContent] = useState({});
  const [selectedHeadArmor, setSelectedHeadArmor] = useState(
    "Protection de Tête (PA 11)"
  );
  const [selectedBodyArmor, setSelectedBodyArmor] = useState(
    "Protection de Corps (PA 11)"
  );
  const [headArmorModalVisible, setHeadArmorModalVisible] = useState(false);
  const [bodyArmorModalVisible, setBodyArmorModalVisible] = useState(false);
  const [headArmorModalContent, setHeadArmorModalContent] = useState({});
  const [bodyArmorModalContent, setBodyArmorModalContent] = useState({});
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedObject3, setSelectedObject3] = useState("");
  const [objectModalContent, setObjectModalContent] = useState({});
  const [objectModalVisible, setObjectModalVisible] = useState(false);
  // Ajout des états pour Cyberfashion et Cyberaudio
  const [selectedCyberfashion1, setSelectedCyberfashion1] = useState(null);
  const [selectedCyberfashion2, setSelectedCyberfashion2] = useState(null);
  const [selectedCyberaudio1, setSelectedCyberaudio1] = useState(null);
  const [selectedCyberaudio2, setSelectedCyberaudio2] = useState(null);
  const [selectedCyberaudio3, setSelectedCyberaudio3] = useState("");

  // Ajout des états pour les modales
  const [cyberfashion1ModalVisible, setCyberfashion1ModalVisible] =
    useState(false);
  const [cyberfashion2ModalVisible, setCyberfashion2ModalVisible] =
    useState(false);
  const [cyberaudio1ModalVisible, setCyberaudio1ModalVisible] = useState(false);
  const [cyberaudio2ModalVisible, setCyberaudio2ModalVisible] = useState(false);
  const [cyberaudio3ModalVisible, setCyberaudio3ModalVisible] = useState(false);

  // Ajout des états pour le contenu des modales
  const [cyberfashion1ModalContent, setCyberfashion1ModalContent] = useState(
    {}
  );
  const [cyberfashion2ModalContent, setCyberfashion2ModalContent] = useState(
    {}
  );
  const [cyberaudio1ModalContent, setCyberaudio1ModalContent] = useState({});
  const [cyberaudio2ModalContent, setCyberaudio2ModalContent] = useState({});
  const [cyberaudio3ModalContent, setCyberaudio3ModalContent] = useState({});

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.17:3000/api/roles/weapons",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        setWeapons(response.data);
        setSelectedWeapon(
          response.data.find((weapon) => weapon.id_arme === 10)
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des armes:", error);
      }
    };

    const fetchMeleeWeapons = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.17:3000/api/roles/melee-weapons",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        setMeleeWeapons(
          response.data.filter((weapon) => [6, 7, 8].includes(weapon.id_arme))
        );
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des armes de mêlée:",
          error
        );
      }
    };

    const fetchGrenades = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.17:3000/api/roles/grenades",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        console.log("Grenades data:", response.data); // Ajoutez ce log
        setGrenades(response.data);
        setSelectedGrenade(response.data.find((grenade) => grenade.id === 28));
      } catch (error) {
        console.error("Erreur lors de la récupération des grenades:", error);
      }
    };

    fetchWeapons();
    fetchMeleeWeapons();
    fetchGrenades();
  }, [user?.token]);

  const fetchCompatibleMunitions = async (weaponId) => {
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/roles/weapon-munitions/${weaponId}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des munitions compatibles:",
        error
      );
      return { typeMunitions: "Aucun(e)", qualiteMunitions: "Aucun(e)" };
    }
  };

  const fetchAmmunitionDetails = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.17:3000/api/roles/ammunition-details",
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      const { typeMunitions, qualiteMunitions, typeMunitionsArme, quantite } =
        response.data;
      setAmmunitionModalContent({
        typeMunitions: typeMunitions.map((item) => item.nom).join(", "),
        qualiteMunitions: qualiteMunitions.map((item) => item.nom).join(", "),
        typeMunitionsArme: typeMunitionsArme.categorie_arme,
        quantite: quantite * 5,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails des munitions:",
        error
      );
    }
  };

  const fetchArmorDetails = async (armorId) => {
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/roles/armor-details/${armorId}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'armure:",
        error
      );
      return {};
    }
  };

  const fetchObjectDetails = async (objectId) => {
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/roles/object-details/${objectId}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'objet:",
        error
      );
      return {};
    }
  };

  // Fonctions pour récupérer les détails du cybermatériel
  const fetchCyberDetails = async (id, type) => {
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/roles/cyber-details/${id}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des détails du ${type}:`,
        error
      );
      return {};
    }
  };

  // Fonctions pour gérer les sélections et ouvrir les modales
  const handleCyberfashion1Select = async () => {
    const details = await fetchCyberDetails(2, "cyberfashion");
    setCyberfashion1ModalContent(details);
    setCyberfashion1ModalVisible(true);
  };

  const handleCyberfashion2Select = async () => {
    const details = await fetchCyberDetails(7, "cyberfashion");
    setCyberfashion2ModalContent(details);
    setCyberfashion2ModalVisible(true);
  };

  const handleCyberaudio1Select = async () => {
    const details = await fetchCyberDetails(37, "cyberaudio");
    setCyberaudio1ModalContent(details);
    setCyberaudio1ModalVisible(true);
  };

  const handleCyberaudio2Select = async () => {
    const details = await fetchCyberDetails(29, "cyberaudio");
    setCyberaudio2ModalContent(details);
    setCyberaudio2ModalVisible(true);
  };

  const handleCyberaudio3Select = async () => {
    const details = await fetchCyberDetails(35, "cyberaudio");
    setCyberaudio3ModalContent(details);
    setCyberaudio3ModalVisible(true);
  };

  // Fonctions pour fermer les modales
  const closeCyberfashion1Modal = () => setCyberfashion1ModalVisible(false);
  const closeCyberfashion2Modal = () => setCyberfashion2ModalVisible(false);
  const closeCyberaudio1Modal = () => setCyberaudio1ModalVisible(false);
  const closeCyberaudio2Modal = () => setCyberaudio2ModalVisible(false);
  const closeCyberaudio3Modal = () => setCyberaudio3ModalVisible(false);

  const handleObjectSelect = async (objectId) => {
    const objectDetails = await fetchObjectDetails(objectId);
    setObjectModalContent(objectDetails);
    setObjectModalVisible(true);
  };

  const closeObjectModal = () => {
    setObjectModalVisible(false);
  };

  const handleHeadArmorSelect = async () => {
    const armorDetails = await fetchArmorDetails(5); // Assurez-vous que l'ID de l'armure de tête est correct
    setHeadArmorModalContent(armorDetails);
    setHeadArmorModalVisible(true);
  };

  const handleBodyArmorSelect = async () => {
    const armorDetails = await fetchArmorDetails(6);
    setBodyArmorModalContent(armorDetails);
    setBodyArmorModalVisible(true);
  };

  const closeHeadArmorModal = () => {
    setHeadArmorModalVisible(false);
  };

  const closeBodyArmorModal = () => {
    setBodyArmorModalVisible(false);
  };

  const handleWeaponSelect = async (weapon) => {
    setSelectedWeapon(weapon);
    const munitions = await fetchCompatibleMunitions(weapon.id_arme);
    setModalContent({ ...weapon, ...munitions });
  };

  const handleMeleeWeaponSelect = (weapon) => {
    setSelectedMeleeWeapon(weapon);
    setMeleeModalContent(weapon);
  };

  const handleGrenadeSelect = (grenade) => {
    setSelectedGrenade(grenade);
    setGrenade1ModalContent({ ...grenade, quantity: 2 });
  };

  const handleGrenadeTypeSelect = (grenadeType) => {
    setSelectedGrenadeType(grenadeType);
    setGrenade2ModalContent({ ...grenadeType, quantity: 1 });
  };

  const handleAmmunitionSelect = () => {
    fetchAmmunitionDetails();
    setAmmunitionModalVisible(true);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openMeleeModal = () => {
    setMeleeModalVisible(true);
  };

  const closeMeleeModal = () => {
    setMeleeModalVisible(false);
  };

  const openGrenadeModal = () => {
    setGrenadeModalVisible(true);
  };

  const closeGrenadeModal = () => {
    setGrenadeModalVisible(false);
  };

  const renderModalContent = () => {
    if (!modalContent) return null;
    return (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        <Text style={styles.modalTitle}>ARME A DISTANCE :</Text>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Nom:</Text>
            <Text style={styles.modalValue}>
              {modalContent.nom || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Marque:</Text>
            <Text style={styles.modalValue}>
              {modalContent.marque || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Qualité:</Text>
            <Text style={styles.modalValue}>
              {modalContent.qualité || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Type:</Text>
            <Text style={styles.modalValue}>
              {modalContent.type || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Catégorie:</Text>
            <Text style={styles.modalValue}>
              {modalContent.catégorie || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Compétence d'arme:</Text>
            <Text style={styles.modalValue}>
              {modalContent.compétence_d_arme || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Description:</Text>
            <Text style={styles.modalValue}>
              {modalContent.desc_arme || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Chargeur standard:</Text>
            <Text style={styles.modalValue}>
              {modalContent.chargeur_standard || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>
              Formes de munitions compatibles:
            </Text>
            <Text style={styles.modalValue}>
              {modalContent.typeMunitions || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Types de munitions compatibles:</Text>
            <Text style={styles.modalValue}>
              {modalContent.qualiteMunitions || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Attaques par round:</Text>
            <Text style={styles.modalValue}>
              {modalContent.attaques_par_round || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Dégâts:</Text>
            <Text style={styles.modalValue}>
              {modalContent.dégâts || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Mode de Tir:</Text>
            <Text style={styles.modalValue}>
              {modalContent.mode_tir || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>
              Modes de Tir Alternatifs / Traits Spéciaux:
            </Text>
            <Text style={styles.modalValue}>
              {modalContent.modes_de_tir_alternatifs_et_traits_spéciaux ||
                "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Mains:</Text>
            <Text style={styles.modalValue}>
              {modalContent.mains || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Dissimulation:</Text>
            <Text style={styles.modalValue}>
              {modalContent.dissimulation ? "Oui" : "Non"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Arme Exotique:</Text>
            <Text style={styles.modalValue}>
              {modalContent.exotique ? "Oui" : "Non"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Prix:</Text>
            <Text style={styles.modalValue}>
              {modalContent.prix || "Aucun(e)"} Eddies
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Quantité:</Text>
            <Text style={styles.modalValue}>1</Text>
          </View>
        </View>
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.buttonText}>FERMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderMeleeModalContent = () => {
    if (!meleeModalContent) return null;
    return (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        <Text style={styles.modalTitle}>ARME DE MÊLÉE :</Text>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Nom:</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.nom || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Qualité:</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.qualité || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Type:</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.type || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Catégorie:</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.catégorie || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Description:</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.desc_arme || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Attaques par round:</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.attaques_par_round || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Dégâts:</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.dégâts || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Mode de Tir:</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.mode_tir || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Mains:</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.mains || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Dissimulation:</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.dissimulation ? "Oui" : "Non"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Arme Exotique ?</Text>
            <Text style={styles.modalValue}>
              {meleeModalContent.exotique ? "Oui" : "Non"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Quantité:</Text>
            <Text style={styles.modalValue}>1</Text>
          </View>
        </View>
        <TouchableOpacity onPress={closeMeleeModal} style={styles.closeButton}>
          <Text style={styles.buttonText}>FERMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderGrenade1ModalContent = () => {
    if (!grenade1ModalContent) return null;
    return (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        <Text style={styles.modalTitle}>GRENADES 1</Text>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Type de munition:</Text>
            <Text style={styles.modalValue}>
              {grenade1ModalContent.nom || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Quantité:</Text>
            <Text style={styles.modalValue}>
              {grenade1ModalContent.quantity}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setGrenade1ModalVisible(false)}
          style={styles.closeButton}
        >
          <Text style={styles.buttonText}>FERMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderGrenade2ModalContent = () => {
    if (!grenade2ModalContent) return null;
    return (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        <Text style={styles.modalTitle}>GRENADES 2</Text>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Type de munition:</Text>
            <Text style={styles.modalValue}>
              {grenade2ModalContent.nom || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Quantité:</Text>
            <Text style={styles.modalValue}>
              {grenade2ModalContent.quantity}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setGrenade2ModalVisible(false)}
          style={styles.closeButton}
        >
          <Text style={styles.buttonText}>FERMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderAmmunitionModalContent = () => {
    if (!ammunitionModalContent) return null;
    return (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        <Text style={styles.modalTitle}>MUNITIONS</Text>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Forme de la munition:</Text>
            <Text style={styles.modalValue}>
              {ammunitionModalContent.typeMunitions || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Type de munition:</Text>
            <Text style={styles.modalValue}>
              {ammunitionModalContent.qualiteMunitions || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Type d'arme des munitions:</Text>
            <Text style={styles.modalValue}>
              {ammunitionModalContent.typeMunitionsArme || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Quantité:</Text>
            <Text style={styles.modalValue}>
              {ammunitionModalContent.quantite || "Aucun(e)"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setAmmunitionModalVisible(false)}
          style={styles.closeButton}
        >
          <Text style={styles.buttonText}>FERMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderHeadArmorModalContent = () => {
    if (!headArmorModalContent) return null;
    return (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        <Text style={styles.modalTitle}>Armure Tête</Text>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Nom:</Text>
            <Text style={styles.modalValue}>
              {headArmorModalContent.nom || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Type:</Text>
            <Text style={styles.modalValue}>
              {headArmorModalContent.type || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Description:</Text>
            <Text style={styles.modalValue}>
              {headArmorModalContent.description || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Pouvoir d'Arrêt:</Text>
            <Text style={styles.modalValue}>
              {headArmorModalContent.pouvoir_arret || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Pénalité:</Text>
            <Text style={styles.modalValue}>
              {headArmorModalContent.penalite || "Aucun(e)"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setHeadArmorModalVisible(false)}
          style={styles.closeButton}
        >
          <Text style={styles.buttonText}>FERMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderBodyArmorModalContent = () => {
    if (!bodyArmorModalContent) return null;
    return (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        <Text style={styles.modalTitle}>Armure Corps</Text>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Nom:</Text>
            <Text style={styles.modalValue}>
              {bodyArmorModalContent.nom || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Type:</Text>
            <Text style={styles.modalValue}>
              {bodyArmorModalContent.type || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Description:</Text>
            <Text style={styles.modalValue}>
              {bodyArmorModalContent.description || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Pouvoir d'Arrêt:</Text>
            <Text style={styles.modalValue}>
              {bodyArmorModalContent.pouvoir_arret || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Pénalité:</Text>
            <Text style={styles.modalValue}>
              {bodyArmorModalContent.penalite || "Aucun(e)"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setBodyArmorModalVisible(false)}
          style={styles.closeButton}
        >
          <Text style={styles.buttonText}>FERMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderCyberfashion1ModalContent = () => {
    if (!cyberfashion1ModalContent) return null;
    return (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        <Text style={styles.modalTitle}>CYBERFASHION 1</Text>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Lieu d'installation:</Text>
            <Text style={styles.modalValue}>
              {cyberfashion1ModalContent.lieu_installation || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Description:</Text>
            <Text style={styles.modalValue}>
              {cyberfashion1ModalContent.description || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Perte d'Humanité:</Text>
            <Text style={styles.modalValue}>
              {cyberfashion1ModalContent.perte_humanite || "Aucun(e)"}
            </Text>
          </View>
          <View style={styles.modalPair}>
            <Text style={styles.modalKey}>Quantité:</Text>
            <Text style={styles.modalValue}>1</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={closeCyberfashion1Modal}
          style={styles.closeButton}
        >
          <Text style={styles.buttonText}>FERMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // Répétez cette structure pour les autres modales (cyberfashion2, cyberaudio1, cyberaudio2, cyberaudio3)

  return (
    <ImageBackground
      source={require("../../../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.mainTitle}>EQUIPEMENT :</Text>
        <LinearGradient colors={["#868686", "#484848"]} style={styles.descriptionContainer}>
  <Text style={styles.descriptionTitle}>ARMES ET ARMURES</Text>
  <View style={styles.sectionContainer}>
    <View style={styles.row}>
      <TouchableOpacity
        onPress={openModal}
        style={styles.clickableTitle}
      >
        <Text style={styles.clickableTitleText}>ARME A DISTANCE</Text>
      </TouchableOpacity>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedWeapon}
          style={styles.picker}
          onValueChange={(itemValue) => handleWeaponSelect(itemValue)}
        >
          {weapons.map((weapon) => (
            <Picker.Item
              key={weapon.id_arme}
              label={weapon.nom}
              value={weapon}
            />
          ))}
        </Picker>
      </View>
    </View>
    <View style={styles.row}>
      <TouchableOpacity
        onPress={selectedMeleeWeapon ? openMeleeModal : null}
        style={[
          styles.clickableTitle,
          { borderColor: "yellow" },
          !selectedMeleeWeapon && { opacity: 0.5 },
        ]}
        disabled={!selectedMeleeWeapon}
      >
        <Text style={styles.clickableTitleText}>ARME DE MÊLÉE</Text>
      </TouchableOpacity>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedMeleeWeapon}
          style={[
            styles.picker,
            selectedMeleeWeapon
              ? { borderColor: "yellow", borderWidth: 2 }
              : {},
          ]}
          onValueChange={(itemValue) =>
            handleMeleeWeaponSelect(itemValue)
          }
        >
          <Picker.Item label="Veuillez sélectionner" value={null} />
          {meleeWeapons.map((weapon) => (
            <Picker.Item
              key={weapon.id_arme}
              label={weapon.nom}
              value={weapon}
            />
          ))}
        </Picker>
      </View>
    </View>
    <View style={styles.row}>
      <TouchableOpacity
        onPress={
          selectedGrenade ? () => setGrenade1ModalVisible(true) : null
        }
        style={[
          styles.clickableTitle,
          !selectedGrenade && { opacity: 0.5 },
        ]}
        disabled={!selectedGrenade}
      >
        <Text style={styles.clickableTitleText}>GRENADES 1</Text>
      </TouchableOpacity>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGrenade}
          style={[
            styles.picker,
            selectedGrenade
              ? { borderColor: "white", borderWidth: 2 }
              : {},
          ]}
          onValueChange={(itemValue) => handleGrenadeSelect(itemValue)}
        >
          {grenades
            .filter((grenade) => grenade.id === 11)
            .map((grenade) => (
              <Picker.Item
                key={grenade.id}
                label={`${grenade.nom} (x2)`}
                value={grenade}
              />
            ))}
        </Picker>
      </View>
    </View>
    <View style={styles.row}>
      <TouchableOpacity
        onPress={
          selectedGrenadeType
            ? () => setGrenade2ModalVisible(true)
            : null
        }
        style={[
          styles.clickableTitle,
          { borderColor: "yellow" },
          !selectedGrenadeType && { opacity: 0.5 },
        ]}
        disabled={!selectedGrenadeType}
      >
        <Text style={styles.clickableTitleText}>GRENADES 2</Text>
      </TouchableOpacity>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGrenadeType}
          style={[
            styles.picker,
            selectedGrenadeType
              ? { borderColor: "yellow", borderWidth: 2 }
              : {},
          ]}
          onValueChange={(itemValue) =>
            handleGrenadeTypeSelect(itemValue)
          }
        >
          <Picker.Item label="Veuillez sélectionner" value={null} />
          {grenades
            .filter((grenade) => grenade.id === 5)
            .map((grenade) => (
              <Picker.Item
                key={grenade.id}
                label={grenade.nom}
                value={grenade}
              />
            ))}
        </Picker>
      </View>
    </View>
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => {
          fetchAmmunitionDetails();
          setAmmunitionModalVisible(true);
        }}
        style={[styles.clickableTitle, { borderColor: "white" }]}
      >
        <Text style={styles.clickableTitleText}>MUNITIONS</Text>
      </TouchableOpacity>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAmmunition}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setSelectedAmmunition(itemValue)
          }
        >
          <Picker.Item
            label="Munitions Standard de Pistolet TL (x50)"
            value="Munitions Standard de Pistolet TL (x50)"
          />
        </Picker>
      </View>
    </View>
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.clickableTitle, { borderColor: "white" }]}
        onPress={handleHeadArmorSelect}
      >
        <Text style={styles.clickableTitleText}>Armure Tête</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={selectedHeadArmor}
        style={[styles.picker, styles.headArmorPicker]}
        onValueChange={(itemValue) => setSelectedHeadArmor(itemValue)}
      >
        <Picker.Item label="Protection de Tête (PA 11)" value="Protection de Tête (PA 11)" />
      </Picker>
    </View>
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.clickableTitle, { borderColor: "white" }]}
        onPress={handleBodyArmorSelect}
      >
        <Text style={styles.clickableTitleText}>Armure Corps</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={selectedBodyArmor}
        style={[styles.picker, styles.bodyArmorPicker]}
        onValueChange={(itemValue) => setSelectedBodyArmor(itemValue)}
      >
        <Picker.Item label="Protection de Corps (PA 11)" value="Protection de Corps (PA 11)" />
      </Picker>
    </View>
  </View>

  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={closeModal}
  >
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={["#484848", "#868686"]}
        style={styles.modalContent}
      >
        {renderModalContent()}
      </LinearGradient>
    </View>
  </Modal>

  <Modal
    animationType="slide"
    transparent={true}
    visible={meleeModalVisible}
    onRequestClose={closeMeleeModal}
  >
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={["#484848", "#868686"]}
        style={styles.modalContent}
      >
        {renderMeleeModalContent()}
      </LinearGradient>
    </View>
  </Modal>

  <Modal
    animationType="slide"
    transparent={true}
    visible={grenade1ModalVisible}
    onRequestClose={() => setGrenade1ModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={["#484848", "#868686"]}
        style={styles.modalContent}
      >
        {renderGrenade1ModalContent()}
      </LinearGradient>
    </View>
  </Modal>

  <Modal
    animationType="slide"
    transparent={true}
    visible={grenade2ModalVisible}
    onRequestClose={() => setGrenade2ModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={["#484848", "#868686"]}
        style={styles.modalContent}
      >
        {renderGrenade2ModalContent()}
      </LinearGradient>
    </View>
  </Modal>

  <Modal
    animationType="slide"
    transparent={true}
    visible={ammunitionModalVisible}
    onRequestClose={() => setAmmunitionModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={["#484848", "#868686"]}
        style={styles.modalContent}
      >
        {renderAmmunitionModalContent()}
      </LinearGradient>
    </View>
  </Modal>

  <Modal
    visible={headArmorModalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={closeHeadArmorModal}
  >
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={["#484848", "#868686"]}
        style={styles.modalContent}
      >
        {renderHeadArmorModalContent()}
      </LinearGradient>
    </View>
  </Modal>

  <Modal
    visible={bodyArmorModalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={closeBodyArmorModal}
  >
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={["#484848", "#868686"]}
        style={styles.modalContent}
      >
        {renderBodyArmorModalContent()}
      </LinearGradient>
    </View>
  </Modal>
</LinearGradient>
        <LinearGradient colors={["#868686", "#484848"]} style={styles.descriptionContainer}>
  <Text style={styles.descriptionTitle}>Objets</Text>
  <View style={styles.sectionContainer}>
    <View style={styles.objectRow}>
      <TouchableOpacity
        style={styles.objectButton}
        onPress={() => handleObjectSelect(1)}
      >
        <Text style={styles.clickableTitleText}>Objet 1</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={selectedObject}
        style={styles.objectPicker}
        onValueChange={(itemValue) => setSelectedObject(itemValue)}
      >
        <Picker.Item label="Agent" value="1" />
      </Picker>
    </View>
    <View style={styles.objectRow}>
      <TouchableOpacity
        style={styles.objectButton}
        onPress={() => handleObjectSelect(36)}
      >
        <Text style={styles.clickableTitleText}>Objet 2</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={selectedObject}
        style={styles.objectPicker}
        onValueChange={(itemValue) => setSelectedObject(itemValue)}
      >
        <Picker.Item label="Ordinateur" value="36" />
      </Picker>
    </View>
    <View style={styles.objectRow}>
      <TouchableOpacity
        style={[
          styles.objectButton,
          { borderColor: 'yellow' },
          !selectedObject3 && { opacity: 0.5 }, // Griser le bouton si aucune sélection
        ]}
        onPress={() => handleObjectSelect(25)}
        disabled={!selectedObject3} // Désactiver le bouton si aucune sélection
      >
        <Text style={styles.clickableTitleText}>Objet 3</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={selectedObject3}
        style={styles.objectPicker}
        onValueChange={(itemValue) => setSelectedObject3(itemValue)}
      >
        <Picker.Item label="Veuillez sélectionner" value="" />
        <Picker.Item label="Guitare Électrique" value="25" />
      </Picker>
    </View>
    <View style={styles.objectRow}>
      <TouchableOpacity
        style={styles.objectButton}
        onPress={() => handleObjectSelect(41)}
      >
        <Text style={styles.clickableTitleText}>Objet 4</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={selectedObject}
        style={styles.objectPicker}
        onValueChange={(itemValue) => setSelectedObject(itemValue)}
      >
        <Picker.Item label="Peinture Phosphorescente" value="41" />
      </Picker>
    </View>
    <View style={styles.objectRow}>
      <TouchableOpacity
        style={styles.objectButton}
        onPress={() => handleObjectSelect(2)}
      >
        <Text style={styles.clickableTitleText}>Objet 5</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={selectedObject}
        style={styles.objectPicker}
        onValueChange={(itemValue) => setSelectedObject(itemValue)}
      >
        <Picker.Item label="Amplificateur Portable" value="2" />
      </Picker>
    </View>
    <View style={styles.objectRow}>
      <TouchableOpacity
        style={styles.objectButton}
        onPress={() => handleObjectSelect(45)}
      >
        <Text style={styles.clickableTitleText}>Objet 6</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={selectedObject}
        style={styles.objectPicker}
        onValueChange={(itemValue) => setSelectedObject(itemValue)}
      >
        <Picker.Item label="Récepteur Radio / Lecteur de Musique" value="45" />
      </Picker>
    </View>
    <View style={styles.objectRow}>
      <TouchableOpacity
        style={styles.objectButton}
        onPress={() => handleObjectSelect(7)}
      >
        <Text style={styles.clickableTitleText}>Objet 7</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={selectedObject}
        style={styles.objectPicker}
        onValueChange={(itemValue) => setSelectedObject(itemValue)}
      >
        <Picker.Item label="Caméra" value="7" />
      </Picker>
    </View>
  </View>

  {/* Modale pour afficher les détails de l'objet */}
  <Modal
    visible={objectModalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={closeObjectModal}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Détails de l'objet</Text>
        <View style={styles.modalContentContainer}>
          <Text style={styles.modalKey}>Nom :</Text>
          <Text style={styles.modalValue}>{objectModalContent.nom_obj || 'Aucun(e)'}</Text>
          <Text style={styles.modalKey}>Description :</Text>
          <Text style={styles.modalValue}>{objectModalContent.desc_obj || 'Aucun(e)'}</Text>
          <Text style={styles.modalKey}>Particularité :</Text>
          <Text style={styles.modalValue}>{objectModalContent.particularite || 'Aucun(e)'}</Text>
          <Text style={styles.modalKey}>Quantité :</Text>
          <Text style={styles.modalValue}>1</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={closeObjectModal}>
          <Text style={styles.closeButtonText}>FERMER</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
</LinearGradient>
        <LinearGradient
          colors={["#868686", "#484848"]}
          style={styles.descriptionContainer}
        >
          <Text style={styles.descriptionTitle}>CYBERMATERIEL</Text>

          <Text style={styles.subtitle}>CYBERFASHION :</Text>
          <View style={styles.cyberMaterialContainer}>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={handleCyberfashion1Select}
                style={styles.clickableTitle}
              >
                <Text style={styles.clickableTitleText}>Cyberfashion 1</Text>
              </TouchableOpacity>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCyberfashion1}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setSelectedCyberfashion1(itemValue)
                  }
                >
                  <Picker.Item label="Nom Cyberfashion 1" value="2" />
                </Picker>
              </View>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={handleCyberfashion2Select}
                style={styles.clickableTitle}
              >
                <Text style={styles.clickableTitleText}>Cyberfashion 2</Text>
              </TouchableOpacity>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCyberfashion2}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setSelectedCyberfashion2(itemValue)
                  }
                >
                  <Picker.Item label="Nom Cyberfashion 2" value="7" />
                </Picker>
              </View>
            </View>
          </View>

          <Text style={styles.subtitle}>CYBERAUDIO :</Text>
          <View style={styles.cyberMaterialContainer}>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={handleCyberaudio1Select}
                style={styles.clickableTitle}
              >
                <Text style={styles.clickableTitleText}>Cyberaudio 1</Text>
              </TouchableOpacity>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCyberaudio1}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setSelectedCyberaudio1(itemValue)
                  }
                >
                  <Picker.Item label="Nom Cyberaudio 1" value="9" />
                </Picker>
              </View>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={handleCyberaudio2Select}
                style={styles.clickableTitle}
              >
                <Text style={styles.clickableTitleText}>Cyberaudio 2</Text>
              </TouchableOpacity>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCyberaudio2}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setSelectedCyberaudio2(itemValue)
                  }
                >
                  <Picker.Item label="Nom Cyberaudio 2" value="1" />
                </Picker>
              </View>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={handleCyberaudio3Select}
                style={[styles.clickableTitle, { borderColor: "yellow" }]}
              >
                <Text style={styles.clickableTitleText}>Cyberaudio 3</Text>
              </TouchableOpacity>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCyberaudio3}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setSelectedCyberaudio3(itemValue)
                  }
                >
                  <Picker.Item label="Veuillez sélectionner" value="" />
                  <Picker.Item label="Nom Cyberaudio 3" value="7" />
                </Picker>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </ImageBackground>
  );
};

export default StuffPathSelectionRockerboy;
