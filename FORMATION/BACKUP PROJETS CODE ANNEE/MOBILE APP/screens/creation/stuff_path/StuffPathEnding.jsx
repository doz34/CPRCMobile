import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from "react-native";
import { UserContext } from "../../../context/UserContext";
import styles from "./stuff_styles/StuffPathEnding.styles";
import { LinearGradient } from "expo-linear-gradient";
import MyTextSimple from "../MyTextSimple";

const StuffPathEnding = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [idPerso, setIdPerso] = useState(user?.idPerso || route.params?.idPerso);

  useEffect(() => {
    if (!idPerso) {
      setLoading(true);
      // Simulate a network request to fetch idPerso
      setTimeout(() => {
        setIdPerso(user?.idPerso || route.params?.idPerso);
        setLoading(false);
      }, 1000);
    }
  }, [idPerso, user, route.params]);

  const onReturnToMenu = useCallback(() => {
    navigation.navigate("Home");
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={["#868686", "#484848"]}
          style={styles.descriptionContainer}
        >
          <Text style={styles.descriptionTitle}>
            LA CREATION DE VOTRE PERSONNAGE EST TERMINEE, BRAVO !
          </Text>
          <ScrollView style={styles.scrollableContentContainer}>
            <MyTextSimple
              text={
                "Votre personnage est fin prêt pour vivre des aventures rocambolesques à l'ère du rouge ... A vous de jouer, choomba !"
              }
              style={styles.descriptionText}
            />
          </ScrollView>
        </LinearGradient>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onReturnToMenu}
            accessibilityLabel="Retourner au menu principal"
          >
            <Text style={styles.buttonText}>
              RETOURNER AU MENU PRINCIPAL
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default StuffPathEnding;