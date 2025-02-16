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
import styles from "./stuff_styles/CaracPathDisclaimer.styles";
import MyTextSimple from "../MyTextSimple";

const CaracPathDisclaimer = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [idPerso, setIdPerso] = useState(route.params?.idPerso);

  return (
    <ImageBackground
      source={require("../../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.roleDescriptionTitleText}>CARACTERISTIQUES :</Text>
        <LinearGradient
          colors={["#868686", "#484848"]}
          style={styles.placeholderContainer}
        >
          <View style={styles.textContainer}>
            <ScrollView style={styles.contentContainer}>
              <MyTextSimple
                text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...'
                style={styles.roleDescriptionText}
              />
            </ScrollView>
          </View>
        </LinearGradient>
      </ScrollView>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate("CaracPathSelection", { idPerso })}
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
              Vous allez retourner au menu sans sauvegarder les informations de
              cette page. Les informations des pages précédentes ont déjà été
              sauvegardées, confirmer ?
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

export default CaracPathDisclaimer;