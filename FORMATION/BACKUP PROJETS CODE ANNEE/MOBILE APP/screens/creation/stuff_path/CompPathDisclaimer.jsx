import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../../../context/UserContext";
import styles from "./stuff_styles/CompPathDisclaimer.styles";
import MyTextSimple from "../MyTextSimple";

const CompPathDisclaimer = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [idPerso, setIdPerso] = useState(route.params?.idPerso);

  return (
    <ImageBackground
      source={require("../../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.roleDescriptionTitleText}>COMPETENCES DE BASE :</Text>
        <LinearGradient
          colors={["#868686", "#484848"]}
          style={styles.placeholderContainer}
        >
          <View style={styles.textContainer}>
            <ScrollView style={styles.contentContainer}>
              <MyTextSimple
                text="Les compétences des Rats des Rues sont prédéterminées. Quand vous créez un personnage avec cette méthode, la liste des compétences de base et des compétences professionnelles est déjà établie à l’avance en fonction de votre rôle."
                style={styles.roleDescriptionText}
              />
            </ScrollView>
          </View>
        </LinearGradient>
      </ScrollView>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate("CompPathSelection", { idPerso })}
      >
        <Text style={styles.buttonText}>CONTINUER</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.quitButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>QUITTER</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>TERMINER PLUS TARD :</Text>
            <Text style={styles.modalDescription}>
              Vous allez retourner au menu sans sauvegarder les informations de cette page. Les informations des pages précédentes ont déjà été sauvegardées, confirmer ?
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("Home");
                }}
              >
                <Text style={styles.buttonText}>OUI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>ANNULER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default CompPathDisclaimer;