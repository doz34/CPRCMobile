import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import styles from "./creation_styles/DisclaimerCharacter.styles";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import MyTextSimple from "./MyTextSimple";

const DisclaimerCharacterScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [initialModalVisible, setInitialModalVisible] = useState(false);
  const [createNewModalVisible, setCreateNewModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmNameModalVisible, setConfirmNameModalVisible] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [tempCharacterName, setTempCharacterName] = useState("");
  const [characterStatus, setCharacterStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCharacterId, setLastCharacterId] = useState(null);
  const [selectCharacterModalVisible, setSelectCharacterModalVisible] =
    useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [sortedCharacters, setSortedCharacters] = useState([]);
  const [sortBy, setSortBy] = useState("date_creation");
  const [sortDirection, setSortDirection] = useState("descending");

  useEffect(() => {
    const checkCharacterStatus = async () => {
      try {
        const status = await getCharacterStatus();
        setCharacterStatus(status);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch character status", error);
        setLoading(false);
      }
    };

    checkCharacterStatus();
  }, []);

  useEffect(() => {
    sortCharacters(sortBy, sortDirection);
  }, [characters, sortBy, sortDirection]);

  const getCharacterStatus = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.17:3000/api/character/last",
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du dernier personnage:",
        error
      );
      return null;
    }
  };

  const handleInitialChoice = async (choice) => {
    if (choice === "existing") {
      setLoading(true);
      await fetchCharacters();
      setSelectCharacterModalVisible(true);
      setLoading(false);
      setInitialModalVisible(false);
    } else {
      setCreateNewModalVisible(true);
      setInitialModalVisible(false);
    }
  };

  const handleSubmitName = () => {
    setCharacterName(tempCharacterName);
    setCreateNewModalVisible(false);
    setConfirmNameModalVisible(true);
  };

  const handleConfirmName = async () => {
    try {
      const response = await axios.post(
        "http://192.168.1.17:3000/api/character/creer-nom-personnage",
        { nom_perso: characterName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (response.status === 201) {
        console.log("Nom du personnage créé avec succès:", response.data);
        setLastCharacterId(response.data.id_perso);
        navigation.navigate("SelectRole", { idPerso: response.data.id_perso });
      }
    } catch (error) {
      console.error("Erreur lors de la création du personnage:", error);
      alert('Erreur lors de la création du nom du personnage.');
    }
    setConfirmNameModalVisible(false);
  };
  

  const renderButton = (title, onPress, buttonStyle) => (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderInitialModal = () => (
    <LinearGradient
      colors={["#868686", "#484848"]}
      style={styles.modalGradient}
    >
      <Text style={styles.modalText}>
        Voulez-vous créer un nouveau personnage ou continuer avec un personnage
        existant ?
      </Text>
      {renderButton(
        "Créer un nouveau personnage",
        () => handleInitialChoice("new"),
        styles.createCharacterButton
      )}
      {renderButton(
        "Continuer avec un personnage existant",
        () => handleInitialChoice("existing"),
        styles.continueWithExistingButton
      )}
    </LinearGradient>
  );

  const renderCreateNewModal = () => (
    <LinearGradient
      colors={["#868686", "#484848"]}
      style={styles.modalGradient}
    >
      <Text style={styles.modalText}>
        Choisissez un nom pour votre personnage :
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du personnage"
        value={tempCharacterName}
        onChangeText={setTempCharacterName}
      />
      {renderButton("Confirmer", handleSubmitName, styles.confirmButton)}
      {renderButton(
        "Annuler",
        () => {
          setCreateNewModalVisible(false);
          setInitialModalVisible(true);
        },
        styles.cancelButton
      )}
    </LinearGradient>
  );

  const renderConfirmNameModal = () => (
    <LinearGradient
      colors={["#868686", "#484848"]}
      style={styles.modalGradient}
    >
      <Text style={styles.modalText}>
        Confirmez-vous le nom du personnage : {characterName} ?
      </Text>
      {renderButton("Confirmer", handleConfirmName, styles.confirmButton)}
      {renderButton(
        "Annuler",
        () => {
          setConfirmNameModalVisible(false);
          setCreateNewModalVisible(true);
        },
        styles.cancelButton
      )}
    </LinearGradient>
  );

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://192.168.1.17:3000/api/character/characters",
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (response.data && response.data.length > 0) {
        const charactersWithRoleIds = response.data.map((character) => {
          return { ...character, id_role: character.id_role };
        });
        setCharacters(charactersWithRoleIds);
        sortCharacters(sortBy, sortDirection);
      } else {
        setCharacters([]);
        alert('Aucun personnage trouvé.');
      }
    } catch (error) {
      console.error("Failed to fetch characters:", error);
      alert('Erreur lors de la récupération des personnages.');
    } finally {
      setLoading(false);
    }
  };
  

  const sortCharacters = (key, direction) => {
    const sortedData = [...characters].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setSortedCharacters(sortedData);
  };

  const CharacterItem = ({ character }) => (
    <TouchableOpacity
      style={styles.characterContainer}
      onPress={() => handleSelectCharacter(character)}
    >
      <Image
        source={{ uri: character.icon || "../../assets/fallback.png" }}
        style={styles.characterIcon}
      />
      <View style={styles.characterInfo}>
        <Text style={styles.characterName}>{character.nom_perso}</Text>
        <Text style={styles.characterDetails}>{`Rôle: ${character.role}`}</Text>
        <Text style={styles.characterDetails}>{`Créé le: ${new Date(
          character.date_creation
        ).toLocaleDateString()}`}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSelectCharacterModal = () => (
    <LinearGradient
      colors={["#868686", "#484848"]}
      style={styles.modalGradient}
    >
      <Text style={styles.modalText}>Sélectionnez un personnage :</Text>
      <View style={styles.sortContainer}>
        <Picker
          selectedValue={sortBy}
          onValueChange={(itemValue) => {
            setSortBy(itemValue);
            sortCharacters(itemValue, sortDirection);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Nom" value="nom_perso" />
          <Picker.Item label="Rôle" value="role" />
          <Picker.Item label="Date de création" value="date_creation" />
        </Picker>
        <Picker
          selectedValue={sortDirection}
          onValueChange={(itemValue) => {
            setSortDirection(itemValue);
            sortCharacters(sortBy, itemValue);}}
            style={styles.picker}
          >
            <Picker.Item label="Ascendant" value="ascending" />
            <Picker.Item label="Descendant" value="descending" />
          </Picker>
        </View>
        <FlatList
          data={sortedCharacters}
          renderItem={({ item }) => <CharacterItem character={item} />}
          keyExtractor={(item) => item.id_perso.toString()}
          style={styles.characterList}
        />
        {renderButton(
          "Annuler",
          () => setSelectCharacterModalVisible(false),
          styles.cancelButton
        )}
      </LinearGradient>
    );
  
    const handleSelectCharacter = (character) => {
      console.log("Selected Character:", character);
      setSelectedCharacter(character);
      setConfirmModalVisible(true);
      setSelectCharacterModalVisible(false);
    };
  
    const renderConfirmCharacterModal = () => {
      if (!selectedCharacter) return null; // Safety check
  
      return (
        <LinearGradient
          colors={["#868686", "#484848"]}
          style={styles.modalGradient}
        >
          <Text style={styles.modalText}>
            Confirmez-vous continuer avec {selectedCharacter.nom_perso} ?
          </Text>
  
          <View style={styles.selectedCharacterContainer}>
            <Image
              source={{
                uri: selectedCharacter.icon || "../../assets/fallback.png",
              }}
              style={styles.characterIcon}
            />
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>
                {selectedCharacter.nom_perso}
              </Text>
              <Text
                style={styles.characterDetails}
              >{`Rôle: ${selectedCharacter.role}`}</Text>
              <Text style={styles.characterDetails}>{`Créé le: ${new Date(
                selectedCharacter.date_creation
              ).toLocaleDateString()}`}</Text>
            </View>
          </View>
  
          {renderButton(
            "Continuer",
            handleContinueWithCharacter,
            styles.confirmButton
          )}
          {renderButton(
            "Annuler",
            () => {
              setConfirmModalVisible(false);
              setSelectCharacterModalVisible(true);
            },
            styles.cancelButton
          )}
        </LinearGradient>
      );
    };
  
    const handleContinueWithCharacter = () => {
      if (!selectedCharacter) {
        alert('Aucun personnage sélectionné.');
        return;
      }
    
      console.log("Selected Character:", {
        id_perso: selectedCharacter.id_perso,
        id_role: selectedCharacter.id_role,
        id_origine: selectedCharacter.id_origine,
        id_langue: selectedCharacter.id_langue,
        nom_perso: selectedCharacter.nom_perso,
        role: selectedCharacter.role // Assurez-vous que ce champ est bien `id_role` et non `nom_role`
      });
    
      // Vérifiez si id_role est défini
      if (!selectedCharacter.id_role) {
        alert('Le rôle du personnage sélectionné est introuvable.');
        return;
      }
    
      // Condition pour déterminer la page de destination
      if (selectedCharacter.id_origine && selectedCharacter.id_langue) {
        console.log("Navigating to GenPathClothing with:", {
          idPerso: selectedCharacter.id_perso,
          idRole: selectedCharacter.id_role,
        });
    
        navigation.navigate("GenPathClothing", {
          idPerso: selectedCharacter.id_perso,
          idRole: selectedCharacter.id_role,
        });
      } else {
        console.log("Navigating to CulturalOrigin with:", {
          idPerso: selectedCharacter.id_perso,
          idOrigine: selectedCharacter.id_origine,
          idLangue: selectedCharacter.id_langue,
          idRole: selectedCharacter.id_role,
        });
    
        navigation.navigate("CulturalOrigin", {
          idPerso: selectedCharacter.id_perso,
          idOrigine: selectedCharacter.id_origine || null, // Fallback to null if undefined
          idLangue: selectedCharacter.id_langue || null, // Fallback to null if undefined
          idRole: selectedCharacter.id_role,
        });
      }
    
      setConfirmModalVisible(false);
    };
  
    return (
      <ImageBackground
        source={require("../../assets/Inscription.png")}
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <LinearGradient
            colors={["#868686", "#484848"]}
            style={styles.placeholderContainer}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.roleDescriptionTitleText}>
                DÉROULÉ DE LA CRÉATION :
              </Text>
            </View>
            <ScrollView style={styles.contentContainer}>
              <MyTextSimple text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...' style={styles.roleDescriptionText} />
            </ScrollView>
          </LinearGradient>
        </ScrollView>
        <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setInitialModalVisible(true)}
            >
              <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={initialModalVisible}
          onRequestClose={() => setInitialModalVisible(false)}
        >
          <View style={styles.blurredBackground}>{renderInitialModal()}</View>
        </Modal>
  
        <Modal
          animationType="slide"
          transparent={true}
          visible={createNewModalVisible}
          onRequestClose={() => setCreateNewModalVisible(false)}
        >
          <View style={styles.blurredBackground}>{renderCreateNewModal()}</View>
        </Modal>
  
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmNameModalVisible}
          onRequestClose={() => setConfirmNameModalVisible(false)}
        >
          <View style={styles.blurredBackground}>{renderConfirmNameModal()}</View>
        </Modal>
  
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmModalVisible}
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <View style={styles.blurredBackground}>
            {renderConfirmCharacterModal()}
          </View>
        </Modal>
  
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectCharacterModalVisible}
          onRequestClose={() => setSelectCharacterModalVisible(false)}
        >
          <View style={styles.blurredBackground}>
            {renderSelectCharacterModal()}
          </View>
        </Modal>
      </ImageBackground>
    );     
  };
  
  export default DisclaimerCharacterScreen;