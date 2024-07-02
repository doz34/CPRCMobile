import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import axios from 'axios';
import { UserContext } from '../../../context/UserContext';
import styles from './styles';

const DisclaimerCharacterScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://192.168.1.17:3000/api/character/last`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setCharacter(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch character:', error);
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [user.token]);

  const handleContinue = () => {
    if (!character) {
      navigation.navigate('SelectRole');
    } else {
      // Supposer que character a une propriété 'currentStage'
      navigation.navigate(character.currentStage);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/Inscription.png')} // Assurez-vous que le chemin est correct
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <ActivityIndicator animating={loading} size="large" />
        {!loading && (
          <>
            <Text style={styles.descriptionText}>
              Page de description du déroulé de la création du personnage.
            </Text>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={showModal}
              onRequestClose={() => {
                setShowModal(!showModal);
              }}
            >
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Choisissez une option</Text>
                <TouchableOpacity onPress={handleContinue}>
                  <Text style={styles.buttonText}>Continuer la création</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SelectRole')}>
                  <Text style={styles.buttonText}>Créer un nouveau personnage</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </>
        )}
      </View>
    </ImageBackground>
  );
};

export default DisclaimerCharacterScreen;
