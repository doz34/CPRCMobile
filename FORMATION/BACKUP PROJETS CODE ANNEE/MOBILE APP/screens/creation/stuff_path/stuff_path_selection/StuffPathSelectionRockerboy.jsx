import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../../../context/UserContext";
import axios from "axios";
import styles from "./stuff_path_selection_styles/StuffPathSelectionRockerboy.styles";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StuffPathSelectionRockerboy = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [idPerso, setIdPerso] = useState(route.params.idPerso);
  const [idUtilisateur, setIdUtilisateur] = useState(null);
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
  const [selectedCyberaudio3, setSelectedCyberaudio3] = useState(null);

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

  const [selectedVeste, setSelectedVeste] = useState(null);
  const [selectedBijoux, setSelectedBijoux] = useState(null);
  const [selectedHaut, setSelectedHaut] = useState(null);

  const [vesteModalVisible, setVesteModalVisible] = useState(false);
  const [bijouxModalVisible, setBijouxModalVisible] = useState(false);
  const [hautModalVisible, setHautModalVisible] = useState(false);

  const [otherModalVisible, setOtherModalVisible] = useState(false);

  const [vesteModalContent, setVesteModalContent] = useState({});
  const [bijouxModalContent, setBijouxModalContent] = useState({});
  const [hautModalContent, setHautModalContent] = useState({});

  const [guitarModalVisible, setGuitarModalVisible] = useState(false);
  const [guitarModalContent, setGuitarModalContent] = useState({});
  const [microphoneModalVisible, setMicrophoneModalVisible] = useState(false);
  const [microphoneModalContent, setMicrophoneModalContent] = useState({});
  const [meleeWeaponModalVisible, setMeleeWeaponModalVisible] = useState(false);
  const [meleeWeaponModalContent, setMeleeWeaponModalContent] = useState({});
  const [grenade2DistinctModalVisible, setGrenade2DistinctModalVisible] = useState(false);
  const [isContinueModalVisible, setContinueModalVisible] = useState(false);
  const [isQuitModalVisible, setQuitModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User context in component:", user);
      setIdUtilisateur(user.id);
    }
  }, [user]);

  useEffect(() => {
    const initialize = async () => {
      console.log('Initializing with idUtilisateur:', idUtilisateur, 'and idPerso:', idPerso);
      if (idUtilisateur && idPerso) {
        await storeInitialIds();
        await fetchUserAndCharacterIds();
      } else {
        console.error('ID utilisateur ou ID personnage non défini');
        Alert.alert('Erreur', 'ID utilisateur ou ID personnage non défini.');
      }
    };

    // Fonction pour stocker les IDs utilisateur et personnage dans AsyncStorage
    const storeInitialIds = async () => {
      try {
        console.log('Storing IDs in AsyncStorage');
        await AsyncStorage.multiSet([
          ['id_utilisateur', idUtilisateur.toString()],
          ['id_perso', idPerso.toString()]
        ]);
        console.log('IDs stored successfully');
      } catch (error) {
        console.error('Erreur lors du stockage des IDs:', error);
      }
    };

    // Fonction pour récupérer les IDs stockés et effectuer les opérations nécessaires
    const fetchUserAndCharacterIds = async () => {
      try {
          console.log('Fetching stored IDs from AsyncStorage');
          const storedIds = await AsyncStorage.multiGet(['id_utilisateur', 'id_perso']);
          const storedIdUtilisateur = storedIds[0][1];
          const storedIdPerso = storedIds[1][1];
          console.log('Stored IDs:', { storedIdUtilisateur, storedIdPerso });
          if (!storedIdUtilisateur || !storedIdPerso) {
              Alert.alert('Erreur', 'ID utilisateur ou ID personnage non défini.');
              return;
          }
          await transmitIdPerso(storedIdPerso);
          const equipmentData = [
              { id_arme: 10, quantite: 1, id_perso: storedIdPerso },
              // autres entrées...
          ];
          // La boucle for a été supprimée ici
      } catch (error) {
          console.error('Error updating equipment:', error);
          Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour de l\'équipement.');
      }
  };

    if (idUtilisateur !== null) {
      initialize();
    }
  }, [user?.token, idPerso, idUtilisateur]);

  // Définir la fonction transmitIdPerso
  const transmitIdPerso = async (idPerso) => {
    try {
      console.log('Transmitting idPerso:', idPerso);
      // Ajoutez ici la logique pour transmettre l'idPerso
    } catch (error) {
      console.error('Erreur lors de la transmission de l\'idPerso:', error);
    }
  };

  useEffect(() => {

    const fetchInitialData = async () => {
      try {
        const cyberfashion1Name = await fetchCyberfashionNames(2);
        setSelectedCyberfashion1(cyberfashion1Name);
        const cyberfashion2Name = await fetchCyberfashionNames(7);
        setSelectedCyberfashion2(cyberfashion2Name);
        const cyberaudio1Name = await fetchCyberaudioNames(9);
        setSelectedCyberaudio1(cyberaudio1Name);
        const cyberaudio2Name = await fetchCyberaudioNames(1);
        setSelectedCyberaudio2(cyberaudio2Name);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données initiales:",
          error
        );
      }
    };

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
        const filteredWeapons = response.data.filter((weapon) =>
          [6, 7, 8].includes(weapon.id_arme)
        );
        setMeleeWeapons(filteredWeapons);
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

  // Fonctions de fetch pour les détails
  const fetchCyberfashion1Details = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.17:3000/api/roles/cyberfashion-details/1",
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de Cyberfashion 1:",
        error
      );
      return {};
    }
  };

  const fetchCyberfashion2Details = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.17:3000/api/roles/cyberfashion-details/2",
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de Cyberfashion 2:",
        error
      );
      return {};
    }
  };

  const fetchCyberaudio1Details = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.17:3000/api/roles/cyberaudio-details/1",
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de Cyberaudio 1:",
        error
      );
      return {};
    }
  };

  const fetchCyberaudio2Details = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.17:3000/api/roles/cyberaudio-details/2",
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de Cyberaudio 2:",
        error
      );
      return {};
    }
  };

  const fetchCyberaudio3Details = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.17:3000/api/roles/cyberaudio-details/3",
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de Cyberaudio 3:",
        error
      );
      return {};
    }
  };

  // Fonctions de fetch pour les noms
  const fetchCyberfashionNames = async (id) => {
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/roles/cyberfashion-names/${id}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      return response.data.nom;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des noms de Cyberfashion:",
        error
      );
      return "";
    }
  };

  const fetchCyberaudioNames = async (id) => {
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/roles/cyberaudio-names/${id}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      return response.data.nom;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des noms de Cyberaudio:",
        error
      );
      return "";
    }
  };

  const fetchVesteDetails = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/roles/veste-details/${idPerso}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de la veste:",
        error
      );
      return {};
    }
  };

  const fetchBijouxDetails = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/roles/bijoux-details/${idPerso}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails des bijoux:",
        error
      );
      return {};
    }
  };

  const fetchHautDetails = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.17:3000/api/roles/haut-details/${idPerso}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du haut:",
        error
      );
      return {};
    }
  };

  // Fonctions de sélection
  const handleCyberfashion1Select = async () => {
    const details = await fetchCyberfashion1Details();
    setCyberfashion1ModalContent(details);
    setCyberfashion1ModalVisible(true);
  };

  const handleCyberfashion2Select = async () => {
    const details = await fetchCyberfashion2Details();
    setCyberfashion2ModalContent(details);
    setCyberfashion2ModalVisible(true);
  };

  const handleCyberaudio1Select = async () => {
    const details = await fetchCyberaudio1Details();
    setCyberaudio1ModalContent(details);
    setCyberaudio1ModalVisible(true);
  };

  const handleCyberaudio2Select = async () => {
    const details = await fetchCyberaudio2Details();
    setCyberaudio2ModalContent(details);
    setCyberaudio2ModalVisible(true);
  };

  const handleCyberaudio3Select = async () => {
    const details = await fetchCyberaudio3Details();
    setCyberaudio3ModalContent(details);
    setCyberaudio3ModalVisible(true);
  };

  const handleCyberaudio3Change = (itemValue) => {
    console.log("Dropdown Cyberaudio 3 value changed:", itemValue); // Log de la nouvelle valeur sélectionnée
    setSelectedCyberaudio3(itemValue);

    // Condition pour déclencher la modale si la valeur sélectionnée n'est pas "Veuillez sélectionner"
    if (itemValue !== "") {
      console.log("Triggering modal for Cyberaudio 3 selection:", itemValue); // Log pour vérifier que la condition est remplie
      setGuitarModalVisible(true);
      setGuitarModalContent({
        title: "ATTENTION :",
        description:
          "Si vous sélectionnez le Détecteur de Micros (Cybermatériel), vous ne pourrez pas choisir la Guitare Electrique (objet). Confirmer ?",
        confirmButtonText: "OUI",
        cancelButtonText: "NON",
        onConfirm: () => {
          setSelectedCyberaudio3(itemValue);
          setSelectedObject3(null);
          setGuitarModalVisible(false);
        },
        onCancel: () => {
          setSelectedCyberaudio3(null);
          setSelectedObject3(itemValue);
          setGuitarModalVisible(false);
        },
      });
    } else {
      console.log("Selected 'Veuillez sélectionner', no modal triggered."); // Log si la valeur est "Veuillez sélectionner"
    }
  };

  const handleMeleeWeaponChangeAndSelect = (itemValue) => {
    console.log("Dropdown Melee Weapon value changed:", itemValue);
    setSelectedMeleeWeapon(itemValue);
    setMeleeModalContent(itemValue); // Ajout de la logique de handleMeleeWeaponSelect

    // Vérifiez si l'arme sélectionnée doit déclencher une modale
    const triggerModalIds = [6, 7, 8];
    if (itemValue && triggerModalIds.includes(itemValue.id_arme)) {
      console.log("Triggering modal for Melee Weapon selection:", itemValue);
      setMeleeWeaponModalContent({
        title: "ATTENTION :",
        description:
          "Si vous sélectionnez une Arme de Mêlée, vous ne pourrez pas choisir la Grenade Etourdissante en supplément des Grenades Lacrymogène (x2). Confirmer ?",
        confirmButtonText: "OUI",
        cancelButtonText: "NON",
        onConfirm: () => {
          setSelectedMeleeWeapon(itemValue);
          setSelectedGrenadeType(null);
          setMeleeWeaponModalVisible(false);
        },
        onCancel: () => {
          setSelectedMeleeWeapon(null);
          setSelectedGrenadeType(itemValue);
          setMeleeWeaponModalVisible(false);
        },
      });
      setMeleeWeaponModalVisible(true);
    } else {
      console.log(
        "Selected 'Veuillez sélectionner' or non-triggering weapon, no modal triggered."
      );
      setMeleeWeaponModalVisible(false);
    }
  };

  const MeleeWeaponModal = ({ visible, content, onRequestClose }) => {
    if (!content) return null;
    return (
      <Modal visible={visible} onRequestClose={onRequestClose}>
        <View>
          <Text>{content.title}</Text>
          <Text>{content.description}</Text>
          <TouchableOpacity
            onPress={content.onConfirm}
            style={{ backgroundColor: "green" }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {content.confirmButtonText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={content.onCancel}
            style={{ backgroundColor: "red" }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {content.cancelButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const Grenade2Modal = ({ visible, content, onRequestClose }) => {
    if (!content) return null;
    return (
      <Modal
        visible={visible}
        onRequestClose={onRequestClose}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{content.title}</Text>
            <Text style={styles.modalDescription}>{content.description}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={content.onConfirm}
                style={styles.confirmButton}
              >
                <Text style={styles.buttonText}>
                  {content.confirmButtonText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={content.onCancel}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>
                  {content.cancelButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const handleVesteSelect = async () => {
    const details = await fetchVesteDetails();
    setVesteModalContent(details);
    setVesteModalVisible(true);
    setOtherModalVisible(false); // Assurez-vous que l'autre modale est fermée
  };

  const handleOtherSelect = async () => {
    const details = await fetchOtherDetails();
    setOtherModalContent(details);
    setOtherModalVisible(true);
    setVesteModalVisible(false); // Assurez-vous que la modale de veste est fermée
  };

  const handleBijouxSelect = async () => {
    const details = await fetchBijouxDetails();
    setBijouxModalContent(details);
    setBijouxModalVisible(true);
  };

  const handleHautSelect = async () => {
    const details = await fetchHautDetails();
    setHautModalContent(details);
    setHautModalVisible(true);
  };

  // Fermeture des modales
  const closeCyberfashion1Modal = () => setCyberfashion1ModalVisible(false);
  const closeCyberfashion2Modal = () => setCyberfashion2ModalVisible(false);
  const closeCyberaudio1Modal = () => setCyberaudio1ModalVisible(false);
  const closeCyberaudio2Modal = () => setCyberaudio2ModalVisible(false);
  const closeCyberaudio3Modal = () => setCyberaudio3ModalVisible(false);

  const closeVesteModal = () => setVesteModalVisible(false);
  const closeBijouxModal = () => setBijouxModalVisible(false);
  const closeHautModal = () => setHautModalVisible(false);

  const handleObjectSelect = async (objectId) => {
    const objectDetails = await fetchObjectDetails(objectId);
    setObjectModalContent(objectDetails);
    setObjectModalVisible(true);
  };

  const handleObject3Change = (itemValue) => {
    console.log("Dropdown 3 value changed:", itemValue); // Log de la nouvelle valeur sélectionnée
    setSelectedObject3(itemValue);

    // Condition pour déclencher la modale si la valeur sélectionnée n'est pas "Veuillez sélectionner"
    if (itemValue !== "") {
      console.log("Triggering modal for Object 3 selection:", itemValue); // Log pour vérifier que la condition est remplie
      setGuitarModalVisible(true);
      setGuitarModalContent({
        title: "ATTENTION :",
        description:
          "Si vous sélectionnez cet objet, vous ne pourrez pas choisir le Détecteur de Micros (Cybermatériel). Confirmer ?",
        confirmButtonText: "OUI",
        cancelButtonText: "NON",
        onConfirm: () => {
          setSelectedObject3(itemValue);
          setSelectedCyberaudio3(null);
          setGuitarModalVisible(false);
        },
        onCancel: () => {
          setSelectedCyberaudio3(itemValue);
          setSelectedObject3(null);
          setGuitarModalVisible(false);
        },
      });
    } else {
      console.log("Selected 'Veuillez sélectionner', no modal triggered."); // Log si la valeur est "Veuillez sélectionner"
    }
  };

  const handleGrenade2Change = (itemValue) => {
    console.log("handleGrenade2Change appelé avec :", itemValue);
    setSelectedGrenadeType(itemValue);
    // Condition pour vérifier si l'ID de la grenade est 5
    if (itemValue && itemValue.id === 5) {
      console.log("ID de la grenade est 5 :", itemValue);
      setGrenade2ModalContent({
        title: "ATTENTION :",
        description:
          "Si vous sélectionnez la Grenade Etourdissante, vous ne pourrez pas choisir l'Arme de Mêlée. Confirmer ?",
        confirmButtonText: "OUI",
        cancelButtonText: "NON",
        onConfirm: () => {
          setSelectedGrenadeType(itemValue);
          setSelectedMeleeWeapon(null);
          setGrenade2ModalVisible(false);
        },
        onCancel: () => {
          setSelectedGrenadeType(null);
          setSelectedMeleeWeapon(itemValue);
          setGrenade2ModalVisible(false);
        },
      });
      setGrenade2ModalVisible(true);
    } else {
      console.log(
        "Sélectionné 'Veuillez sélectionner' ou grenade non-déclenchante, pas de modale déclenchée."
      );
    }
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

  // Modal components for guitar and microphone warnings
  const GuitarModal = ({ visible, content, onRequestClose }) => {
    if (!content) return null;

    return (
      <Modal visible={visible} onRequestClose={onRequestClose}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{content.title}</Text>
          <Text style={styles.modalDescription}>{content.description}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={content.onConfirm}
              style={styles.confirmButton}
            >
              <Text style={styles.buttonText}>{content.confirmButtonText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={content.onCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>{content.cancelButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const MicrophoneModal = ({ visible, content, onRequestClose }) => {
    if (!content) return null;

    return (
      <Modal visible={visible} onRequestClose={onRequestClose}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{content.title}</Text>
          <Text style={styles.modalDescription}>{content.description}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={content.onConfirm}
              style={styles.confirmButton}
            >
              <Text style={styles.buttonText}>{content.confirmButtonText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={content.onCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>{content.cancelButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
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
          onPress={() => setGrenade2DistinctModalVisible(false)}
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
      <Modal
        visible={cyberfashion1ModalVisible}
        onRequestClose={closeCyberfashion1Modal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Lieu d'installation:{" "}
              {cyberfashion1ModalContent.lieu_installation || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>
              Description: {cyberfashion1ModalContent.description || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>
              Perte d'Humanité:{" "}
              {cyberfashion1ModalContent.perte_humanite || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>Quantité: 1</Text>
            <TouchableOpacity
              onPress={closeCyberfashion1Modal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>FERMER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCyberfashion2ModalContent = () => {
    if (!cyberfashion2ModalContent) return null;
    return (
      <Modal
        visible={cyberfashion2ModalVisible}
        onRequestClose={closeCyberfashion2Modal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Lieu d'installation:{" "}
              {cyberfashion2ModalContent.lieu_installation || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>
              Description: {cyberfashion2ModalContent.description || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>
              Perte d'Humanité:{" "}
              {cyberfashion2ModalContent.perte_humanite || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>Quantité: 1</Text>
            <TouchableOpacity
              onPress={closeCyberfashion2Modal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>FERMER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCyberaudio1ModalContent = () => {
    if (!cyberaudio1ModalContent) return null;
    return (
      <Modal
        visible={cyberaudio1ModalVisible}
        onRequestClose={closeCyberaudio1Modal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Lieu d'installation:{" "}
              {cyberaudio1ModalContent.lieu_installation || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>
              Description: {cyberaudio1ModalContent.description || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>
              Perte d'Humanité:{" "}
              {cyberaudio1ModalContent.perte_humanite || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>Quantité: 1</Text>
            <TouchableOpacity
              onPress={closeCyberaudio1Modal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>FERMER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCyberaudio2ModalContent = () => {
    if (!cyberaudio2ModalContent) return null;
    return (
      <Modal
        visible={cyberaudio2ModalVisible}
        onRequestClose={closeCyberaudio2Modal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Lieu d'installation:{" "}
              {cyberaudio2ModalContent.lieu_installation || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>
              Description: {cyberaudio2ModalContent.description || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>
              Perte d'Humanité:{" "}
              {cyberaudio2ModalContent.perte_humanite || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>Quantité: 1</Text>
            <TouchableOpacity
              onPress={closeCyberaudio2Modal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>FERMER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCyberaudio3ModalContent = () => {
    if (!cyberaudio3ModalContent) return null;
    return (
      <Modal
        visible={cyberaudio3ModalVisible}
        onRequestClose={closeCyberaudio3Modal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Lieu d'installation:{" "}
              {cyberaudio3ModalContent.lieu_installation || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>
              Description: {cyberaudio3ModalContent.description || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>
              Perte d'Humanité:{" "}
              {cyberaudio3ModalContent.perte_humanite || "Aucun(e)"}
            </Text>
            <Text style={styles.modalDescription}>Quantité: 1</Text>
            <TouchableOpacity
              onPress={closeCyberaudio3Modal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>FERMER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderVesteModalContent = () => {
    if (!vesteModalContent) return null;
    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Type de vêtement: Veste</Text>
        <Text style={styles.modalDescription}>
          Style du vêtement: {vesteModalContent.nom || "Aucun(e)"}
        </Text>
        <Text style={styles.modalDescription}>
          Image renvoyée: {vesteModalContent.description || "Aucun(e)"}
        </Text>
        <Text style={styles.modalDescription}>Quantité: 1</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setVesteModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>FERMER</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBijouxModalContent = () => {
    if (!bijouxModalContent) return null;
    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Type de vêtement: Bijou</Text>
        <Text style={styles.modalDescription}>
          Style du vêtement: {bijouxModalContent.nom || "Aucun(e)"}
        </Text>
        <Text style={styles.modalDescription}>
          Image renvoyée: {bijouxModalContent.description || "Aucun(e)"}
        </Text>
        <Text style={styles.modalDescription}>Quantité: 3</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setBijouxModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>FERMER</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHautModalContent = () => {
    if (!hautModalContent) return null;
    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Type de vêtement: Haut</Text>
        <Text style={styles.modalDescription}>
          Style du vêtement: {hautModalContent.nom || "Aucun(e)"}
        </Text>
        <Text style={styles.modalDescription}>
          Image renvoyée: {hautModalContent.description || "Aucun(e)"}
        </Text>
        <Text style={styles.modalDescription}>Quantité: 1</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setHautModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>FERMER</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleContinue = async () => {
    console.log("Début de handleContinue");
    if (!selectedMeleeWeapon && !selectedGrenadeType) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner au moins une valeur pour Arme de mêlée ou pour Grenades."
      );
      console.log(
        "Erreur: Aucune arme de mêlée ou type de grenade sélectionné"
      );
      return;
    }
    if (!selectedObject3 && !selectedCyberaudio3) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner au moins une valeur pour Objet 3 ou pour Cyberaudio 3."
      );
      console.log("Erreur: Aucun objet 3 ou cyberaudio 3 sélectionné");
      return;
    }
    try {
      const idUtilisateur = await AsyncStorage.getItem("id_utilisateur");
      const idPerso = await AsyncStorage.getItem("id_perso");
      console.log("idUtilisateur récupéré:", idUtilisateur);
      console.log("id_perso récupéré:", idPerso);
      if (!idUtilisateur) {
        Alert.alert("Erreur", "ID utilisateur non défini.");
        console.log("Erreur: ID utilisateur non défini");
        return;
      }
      if (!idPerso) {
        Alert.alert("Erreur", "ID personnage non défini.");
        console.log("Erreur: ID personnage non défini");
        return;
      }
      // Transmettre id_perso avant d'exécuter la requête POST
      await transmitIdPerso(idPerso);

      // Ajouter les nouvelles entrées
      const equipmentData = [
        { id_arme: 10, quantite: 1, id_perso: idPerso },
        { id_equipement: selectedMeleeWeapon, quantite: 1, id_perso: idPerso },
        { id_equipement: 28, quantite: 1, id_perso: idPerso },
        { id_equipement: selectedGrenadeType, quantite: 1, id_perso: idPerso },
        { id_equipement: 1, quantite: 5, id_perso: idPerso },
        { id_equipement: 5, quantite: 1, id_perso: idPerso },
        { id_equipement: 6, quantite: 1, id_perso: idPerso },
        { id_equipement: 1, quantite: 1, id_perso: idPerso },
        { id_equipement: 36, quantite: 1, id_perso: idPerso },
        { id_equipement: selectedObject3, quantite: 1, id_perso: idPerso },
        { id_equipement: 41, quantite: 1, id_perso: idPerso },
        { id_equipement: 2, quantite: 1, id_perso: idPerso },
        { id_equipement: 45, quantite: 1, id_perso: idPerso },
        { id_equipement: 7, quantite: 1, id_perso: idPerso },
        { id_equipement: 2, quantite: 1, id_attribut: 2, id_perso: idPerso },
        { id_equipement: 7, quantite: 1, id_attribut: 7, id_perso: idPerso },
        { id_equipement: 9, quantite: 1, id_attribut: 37, id_perso: idPerso },
        { id_equipement: 1, quantite: 1, id_attribut: 29, id_perso: idPerso },
        {
          id_equipement: selectedCyberaudio3,
          quantite: 1,
          id_attribut: 35,
          id_perso: idPerso,
        },
      ];

      console.log("Données d'équipement à envoyer:", equipmentData);

      for (const item of equipmentData) {
        console.log("Envoi de l'équipement:", item);
        await axios.post(
          "http://192.168.1.17:3000/api/roles/personnage_equipement",
          item,
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
      }

      console.log("Navigation vers StuffPathEnding");
      navigation.navigate("StuffPathEnding");
    } catch (error) {
      console.error("Error updating equipment:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour de l'équipement."
      );
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.mainTitle}>EQUIPEMENT :</Text>
        <LinearGradient
          colors={["#868686", "#484848"]}
          style={styles.descriptionContainer}
        >
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
                  onValueChange={(itemValue) => {
                    console.log("Picker value changed:", itemValue);
                    handleMeleeWeaponChangeAndSelect(itemValue); // Remplacez handleMeleeWeaponSelect par handleMeleeWeaponChange
                  }}
                >
                  <Picker.Item label="Veuillez sélectionner" value="" />
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
                    ? () => setGrenade2DistinctModalVisible(true)
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
                  onValueChange={(itemValue) => {
                    handleGrenade2Change(itemValue);
                  }}
                >
                  <Picker.Item label="Veuillez sélectionner" value={null} />
                  {grenades
                    .filter((grenade) => {
                      const isGrenadeIdFive = grenade.id === 5;
                      return isGrenadeIdFive;
                    })
                    .map((grenade) => {
                      return (
                        <Picker.Item
                          key={grenade.id}
                          label={grenade.nom}
                          value={grenade}
                        />
                      );
                    })}
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
                <Picker.Item
                  label="Protection de Tête (PA 11)"
                  value="Protection de Tête (PA 11)"
                />
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
                <Picker.Item
                  label="Protection de Corps (PA 11)"
                  value="Protection de Corps (PA 11)"
                />
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
            visible={grenade2DistinctModalVisible}
            onRequestClose={() => setGrenade2DistinctModalVisible(false)}
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
        <LinearGradient
          colors={["#868686", "#484848"]}
          style={styles.descriptionContainer}
        >
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
                  { borderColor: "yellow" },
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
                onValueChange={handleObject3Change}
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
                <Picker.Item
                  label="Récepteur Radio / Lecteur de Musique"
                  value="45"
                />
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
                  <Text style={styles.modalValue}>
                    {objectModalContent.nom_obj || "Aucun(e)"}
                  </Text>
                  <Text style={styles.modalKey}>Description :</Text>
                  <Text style={styles.modalValue}>
                    {objectModalContent.desc_obj || "Aucun(e)"}
                  </Text>
                  <Text style={styles.modalKey}>Particularité :</Text>
                  <Text style={styles.modalValue}>
                    {objectModalContent.particularite || "Aucun(e)"}
                  </Text>
                  <Text style={styles.modalKey}>Quantité :</Text>
                  <Text style={styles.modalValue}>1</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeObjectModal}
                >
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
            {/* Cyberfashion 1 */}
            <View style={styles.objectRow}>
              <TouchableOpacity
                onPress={handleCyberfashion1Select}
                style={styles.objectButton}
              >
                <Text style={styles.clickableTitleText}>Cyberfashion 1</Text>
              </TouchableOpacity>
              <Picker
                selectedValue={selectedCyberfashion1}
                onValueChange={(itemValue) =>
                  setSelectedCyberfashion1(itemValue)
                }
                style={styles.objectPicker}
              >
                <Picker.Item
                  label={selectedCyberfashion1 || "Veuillez sélectionner"}
                  value={selectedCyberfashion1}
                />
              </Picker>
            </View>
            {renderCyberfashion1ModalContent()}

            {/* Cyberfashion 2 */}
            <View style={styles.objectRow}>
              <TouchableOpacity
                onPress={handleCyberfashion2Select}
                style={styles.objectButton}
              >
                <Text style={styles.clickableTitleText}>Cyberfashion 2</Text>
              </TouchableOpacity>
              <Picker
                selectedValue={selectedCyberfashion2}
                onValueChange={(itemValue) =>
                  setSelectedCyberfashion2(itemValue)
                }
                style={styles.objectPicker}
              >
                <Picker.Item
                  label={selectedCyberfashion2 || "Veuillez sélectionner"}
                  value={selectedCyberfashion2}
                />
              </Picker>
            </View>
            {renderCyberfashion2ModalContent()}
          </View>

          <Text style={styles.subtitle}>CYBERAUDIO :</Text>
          <View style={styles.cyberMaterialContainer}>
            {/* Cyberaudio 1 */}
            <View style={styles.objectRow}>
              <TouchableOpacity
                onPress={handleCyberaudio1Select}
                style={styles.objectButton}
              >
                <Text style={styles.clickableTitleText}>Cyberaudio 1</Text>
              </TouchableOpacity>
              <Picker
                selectedValue={selectedCyberaudio1}
                onValueChange={(itemValue) => setSelectedCyberaudio1(itemValue)}
                style={styles.objectPicker}
              >
                <Picker.Item
                  label={selectedCyberaudio1 || "Veuillez sélectionner"}
                  value={selectedCyberaudio1}
                />
              </Picker>
            </View>
            {renderCyberaudio1ModalContent()}

            {/* Cyberaudio 2 */}
            <View style={styles.objectRow}>
              <TouchableOpacity
                onPress={handleCyberaudio2Select}
                style={styles.objectButton}
              >
                <Text style={styles.clickableTitleText}>Cyberaudio 2</Text>
              </TouchableOpacity>
              <Picker
                selectedValue={selectedCyberaudio2}
                onValueChange={(itemValue) => setSelectedCyberaudio2(itemValue)}
                style={styles.objectPicker}
              >
                <Picker.Item
                  label={selectedCyberaudio2 || "Veuillez sélectionner"}
                  value={selectedCyberaudio2}
                />
              </Picker>
            </View>
            {renderCyberaudio2ModalContent()}

            {/* Cyberaudio 3 */}
            <View style={styles.objectRow}>
              <TouchableOpacity
                style={[
                  styles.objectButton,
                  { borderColor: "yellow" },
                  !selectedCyberaudio3 && { opacity: 0.5 },
                ]}
                disabled={!selectedCyberaudio3}
                onPress={handleCyberaudio3Select}
              >
                <Text style={styles.clickableTitleText}>Cyberaudio 3</Text>
              </TouchableOpacity>
              <Picker
                selectedValue={selectedCyberaudio3}
                onValueChange={handleCyberaudio3Change}
                style={styles.objectPicker}
              >
                <Picker.Item label="Veuillez sélectionner" value="" />
                <Picker.Item
                  label="Détecteur de Micros"
                  value="detecteur_de_micros"
                />
              </Picker>
            </View>
            {renderCyberaudio3ModalContent()}
          </View>
        </LinearGradient>
        <View style={styles.sectionContainer}>
          <LinearGradient
            colors={["#868686", "#484848"]}
            style={styles.descriptionContainer}
          >
            <Text style={styles.descriptionTitle}>VÊTEMENTS</Text>
            <View style={styles.sectionContainer}>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={handleVesteSelect}
                  style={styles.clickableTitle}
                >
                  <Text style={styles.clickableTitleText}>VESTE</Text>
                </TouchableOpacity>
              </View>
              {vesteModalVisible && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={vesteModalVisible}
                  onRequestClose={closeVesteModal}
                >
                  <View style={styles.modalContainer}>
                    <LinearGradient
                      colors={["#484848", "#868686"]}
                      style={styles.modalContent}
                    >
                      {renderVesteModalContent()}
                    </LinearGradient>
                  </View>
                </Modal>
              )}

              <View style={styles.row}>
                <TouchableOpacity
                  onPress={handleBijouxSelect}
                  style={styles.clickableTitle}
                >
                  <Text style={styles.clickableTitleText}>BIJOUX</Text>
                </TouchableOpacity>
              </View>
              {bijouxModalVisible && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={bijouxModalVisible}
                  onRequestClose={closeBijouxModal}
                >
                  <View style={styles.modalContainer}>
                    <LinearGradient
                      colors={["#484848", "#868686"]}
                      style={styles.modalContent}
                    >
                      {renderBijouxModalContent()}
                    </LinearGradient>
                  </View>
                </Modal>
              )}

              <View style={styles.row}>
                <TouchableOpacity
                  onPress={handleHautSelect}
                  style={styles.clickableTitle}
                >
                  <Text style={styles.clickableTitleText}>HAUT</Text>
                </TouchableOpacity>
              </View>
              {hautModalVisible && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={hautModalVisible}
                  onRequestClose={closeHautModal}
                >
                  <View style={styles.modalContainer}>
                    <LinearGradient
                      colors={["#484848", "#868686"]}
                      style={styles.modalContent}
                    >
                      {renderHautModalContent()}
                    </LinearGradient>
                  </View>
                </Modal>
              )}
            </View>
          </LinearGradient>
        </View>
        <View style={styles.container}>
          {/* Autres composants et éléments de l'interface utilisateur */}

          {/* Modale pour la guitare */}
          {guitarModalVisible && (
            <GuitarModal
              visible={guitarModalVisible}
              content={guitarModalContent}
              onRequestClose={() => setGuitarModalVisible(false)}
            />
          )}

          {/* Modale pour le microphone */}
          {microphoneModalVisible && (
            <MicrophoneModal
              visible={microphoneModalVisible}
              content={microphoneModalContent}
              onRequestClose={() => setMicrophoneModalVisible(false)}
            />
          )}

          {/* Autres modales et contenus */}
        </View>
        <View style={styles.container}>
          <MeleeWeaponModal
            visible={meleeWeaponModalVisible}
            content={meleeWeaponModalContent}
            onRequestClose={() => setMeleeWeaponModalVisible(false)}
          />
        </View>
        <View>
          <Grenade2Modal
            visible={grenade2ModalVisible}
            content={grenade2ModalContent}
            onRequestClose={() => setGrenade2ModalVisible(false)}
          />
        </View>
        <View style={styles.container}>
          {/* Votre contenu existant */}

          {/* Boutons CONTINUER et QUITTER */}
          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={styles.quitButton}
              onPress={() => setQuitModalVisible(true)}
            >
              <Text style={styles.buttonText}>QUITTER</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setContinueModalVisible(true)}
            >
              <Text style={styles.buttonText}>CONTINUER</Text>
            </TouchableOpacity>
          </View>

          {/* Modale CONTINUER */}
          <Modal
            visible={isContinueModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setContinueModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text>Confirmez-vous le choix de l'équipement ?</Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonYes]}
                    onPress={handleContinue}
                  >
                    <Text style={styles.buttonText}>OUI</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonNo]}
                    onPress={() => setContinueModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>NON</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modale QUITTER */}
          <Modal
            visible={isQuitModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setQuitModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>TERMINER PLUS TARD :</Text>
                <Text>
                  Vous allez retourner au menu sans sauvegarder les informations
                  de cette page. Les informations des pages précédentes ont déjà
                  été sauvegardées, confirmer ?
                </Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonYes]}
                    onPress={() => navigation.navigate("Home")}
                  >
                    <Text style={styles.buttonText}>OUI</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonNo]}
                    onPress={() => setQuitModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>ANNULER</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default StuffPathSelectionRockerboy;
