import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import styles from "./role_styles/RolePathRockerboyDisclaimer.styles";
import MyTextSimple from "../MyTextSimple";

const RolePathRockerboyDisclaimer = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idPerso, setIdPerso] = useState(route.params?.idPerso);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        console.log("Fetching image URL for role 1...");
        const response = await axios.get(
          "http://192.168.1.17:3000/api/roles/1",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );

        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        if (response.status === 200 && response.data.role_img) {
          const fullImageUrl = `http://192.168.1.17:3000/${response.data.role_img}`;
          console.log("Image URL fetched successfully:", fullImageUrl);
          setImageUrl(fullImageUrl);
        } else {
          console.error("Invalid response data:", response.data);
          alert("Erreur: Données de réponse invalides.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'image:", error);
        alert(`Erreur lors de la récupération de l'image: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, [user?.token]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground
      source={require("../../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.roleDescriptionTitleText}>
          PARCOURS RÔLE DU ROCKEUR :
        </Text>
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
                eiusmod tempor incididunt ut labore et dolore magna aliqua. ...'
                style={styles.roleDescriptionText}
              />
            </ScrollView>
          </View>
        </LinearGradient>
        {imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.rockerImage} />
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate("RolePathRockerboyJob", { idPerso })}
      >
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default RolePathRockerboyDisclaimer;