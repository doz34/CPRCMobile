import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, Modal, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

const DisclaimerCharacterScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [characterStatus, setCharacterStatus] = useState(null);

  useEffect(() => {
    const checkCharacterStatus = async () => {
      try {
        // Placeholder for backend call
        const status = await getCharacterStatus();
        setCharacterStatus(status);
      } catch (error) {
        console.error('Failed to fetch character status', error);
      }
    };

    checkCharacterStatus();
  }, []);

  const getCharacterStatus = async () => {
    // Simulate an API call to get the character status
    // This should be replaced with your actual backend call
    return { status: 'GENERIC_PATH', currentStep: 'GenPathPersonality' }; // Example response
  };

  const handleContinue = () => {
    if (!characterStatus) {
      // If the status has not been fetched yet, do nothing
      return;
    }

    switch (characterStatus.status) {
      case 'GENERIC_PATH':
        navigation.navigate(characterStatus.currentStep);
        break;
      case 'ROLE_PATH':
        navigation.navigate(characterStatus.currentStep);
        break;
      case 'COMPLETED':
        setModalVisible(true);
        break;
      default:
        navigation.navigate("SelectRole");
        break;
    }
  };

  const renderModalContent = () => {
    return (
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Your character creation is complete.</Text>
        <Button
          title="Edit Generic Path"
          onPress={() => {
            setModalVisible(!modalVisible);
            // Navigate to the last step of the generic path
            navigation.navigate(characterStatus.lastGenericStep);
          }}
        />
        <Button
          title="Edit Role Path"
          onPress={() => {
            setModalVisible(!modalVisible);
            // Navigate to the last step of the role-specific path
            navigation.navigate(characterStatus.lastRoleStep);
          }}
        />
        <Button
          title="Close"
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        />
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={["#868686", "#484848"]}
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
        <TouchableOpacity
          style={[styles.continueButton]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {renderModalContent()}
      </Modal>
    </ImageBackground>
  );
};

export default DisclaimerCharacterScreen;