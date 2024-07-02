import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './creation_styles/DisclaimerCharacter.styles';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const DisclaimerCharacterScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [initialModalVisible, setInitialModalVisible] = useState(false); // Mettre à false par défaut
  const [createNewModalVisible, setCreateNewModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [tempCharacterName, setTempCharacterName] = useState('');
  const [characterStatus, setCharacterStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCharacterId, setLastCharacterId] = useState(null);

  useEffect(() => {
    const checkCharacterStatus = async () => {
      try {
        const status = await getCharacterStatus();
        setCharacterStatus(status);
        setLoading(false); // Arrêter le chargement une fois le statut obtenu
      } catch (error) {
        console.error('Failed to fetch character status', error);
        setLoading(false); // Assurez-vous d'arrêter le chargement en cas d'erreur
      }
    };

    checkCharacterStatus();
  }, []);

  const getCharacterStatus = async () => {
    try {
      const response = await axios.get('http://192.168.1.17:3000/api/character/last', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier personnage:', error);
      return null;
    }
  };

  const handleInitialChoice = (choice) => {
    if (choice === 'existing') {
      navigation.navigate('SelectRole', { idPerso: characterStatus.id_perso });
    } else {
      setCreateNewModalVisible(true);
      setInitialModalVisible(false);
    }
  };

  const handleSubmitName = () => {
    setCharacterName(tempCharacterName);
    setConfirmModalVisible(true);
    setCreateNewModalVisible(false);
  };

  const handleConfirmName = async () => {
    try {
      const response = await axios.post(
        'http://192.168.1.17:3000/api/character/creer-nom-personnage',
        {
          nom_perso: characterName
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );

      if (response.status === 201) {
        console.log('Nom du personnage créé avec succès:', response.data);
        setLastCharacterId(response.data.id_perso);
        navigation.navigate('SelectRole', { idPerso: response.data.id_perso });
      }
    } catch (error) {
      console.error('Erreur lors de la création du personnage:', error);
    }
    setConfirmModalVisible(false);
  };

  const renderButton = (title, onPress, buttonStyle) => (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderInitialModal = () => (
    <LinearGradient
      colors={['#868686', '#484848']}
      style={styles.modalGradient}
    >
      <Text style={styles.modalText}>Voulez-vous créer un nouveau personnage ou continuer avec un personnage existant ?</Text>
      {renderButton('Créer un nouveau personnage', () => handleInitialChoice('new'), styles.createCharacterButton)}
      {renderButton('Continuer avec un personnage existant', () => handleInitialChoice('existing'), styles.continueWithExistingButton)}
    </LinearGradient>
  );

  const renderCreateNewModal = () => (
    <LinearGradient
      colors={['#868686', '#484848']}
      style={styles.modalGradient}
    >
      <Text style={styles.modalText}>Choisissez un nom pour votre personnage :</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du personnage"
        value={tempCharacterName}
        onChangeText={(text) => setTempCharacterName(text)}
      />
      {renderButton('Confirmer', handleSubmitName, styles.confirmButton)}
      {renderButton('Annuler', () => { setCreateNewModalVisible(false); setInitialModalVisible(true); }, styles.cancelButton)}
    </LinearGradient>
  );

  const renderConfirmModal = () => (
    <LinearGradient
      colors={['#868686', '#484848']}
      style={styles.modalGradient}
    >
      <Text style={styles.modalText}>Est-ce que le nom "{characterName}" est correct ?</Text>
      {renderButton('Oui', handleConfirmName, styles.confirmButton)}
      {renderButton('Modifier', () => { setCreateNewModalVisible(true); setConfirmModalVisible(false); }, styles.modifyButton)}</LinearGradient>
  );

  return (
    <ImageBackground
      source={require('../../assets/Inscription.png')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={['#868686', '#484848']}
          style={[styles.placeholderContainer, styles.capacityContainer]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.roleDescriptionTitleText}>DÉROULÉ DE LA CRÉATION :</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.roleDescriptionText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ...
            </Text>
          </View>
        </LinearGradient>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={[styles.continueButton]} onPress={() => setInitialModalVisible(true)}>
            <Text style={styles.buttonText}>Continuer</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={initialModalVisible}
        onRequestClose={() => setInitialModalVisible(false)}
      >
        <View style={styles.blurredBackground}>
          {renderInitialModal()}
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={createNewModalVisible}
        onRequestClose={() => setCreateNewModalVisible(false)}
      >
        <View style={styles.blurredBackground}>
          {renderCreateNewModal()}
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.blurredBackground}>
          {renderConfirmModal()}
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default DisclaimerCharacterScreen;