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
        <Text style={styles.modalTitle}>GRENADES 1 :</Text>
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
          style={styles.grenadeCloseButton}  // Utiliser le nouveau style
        >
          <Text style={styles.grenadeCloseButtonText}>FERMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };
  
  const renderGrenade2ModalContent = () => {
    if (!grenade2ModalContent) return null;
    return (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        <Text style={styles.modalTitle}>GRENADES 2 :</Text>
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
          style={styles.grenadeCloseButton}  // Utiliser le nouveau style
        >
          <Text style={styles.grenadeCloseButtonText}>FERMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
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
          </View>

          <View style={styles.sectionContainer}>
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
          </View>

          <View style={styles.sectionContainer}>
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
              <View style={styles.grenadeDropdownContainer}>
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
              <View style={styles.grenadeDropdownContainer}>
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
      style={styles.grenadeModalContent}  // Utiliser le nouveau style
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
      style={styles.grenadeModalContent}  // Utiliser le nouveau style
    >
      {renderGrenade2ModalContent()}
    </LinearGradient>
  </View>
</Modal>
        </LinearGradient>
      </ScrollView>
    </ImageBackground>
  );
};

export default StuffPathSelectionRockerboy;
