import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import styles from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-swiper";

const SelectRoleScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0); // Ajoutez cet état

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.17:3000/api/user/roles",
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        const rolesWithImages = response.data.map((role) => ({
          ...role,
          role_img: `http://192.168.1.17:3000/${role.role_img}`,
        }));
        setRoles(rolesWithImages);
      } catch (error) {
        console.error("Erreur lors de la récupération des rôles :", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchRoles();
    }
  }, [user?.token]);

  const onRoleSelect = async (selectedRole) => {
    try {
      const response = await axios.post(
        "http://192.168.1.17:3000/api/user/creer-personnage",
        {
          idRole: selectedRole.id_role,
          idParcours: selectedRole.id_parcours_role,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (response.status === 201) {
        console.log("Personnage créé avec succès:", response.data);
        navigation.navigate("PgenOrig");
      }
    } catch (error) {
      console.error("Erreur lors de la création du personnage :", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground
      source={require("../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <Swiper
        style={styles.wrapper}
        onIndexChanged={setCurrentRoleIndex}
        loop={false}
      >
        {roles.map((role) => (
          <View key={role.id_role} style={styles.roleContainer}>
            <Image source={{ uri: role.role_img }} style={styles.roleImageWrapper} />
            {/* Titre du rôle */}
            <Text style={styles.title}>{role.nom_role}</Text>

            {/* Description en bref */}
            <LinearGradient
              colors={["#C0C0C0", "#484848"]}
              style={styles.descriptionContainer}
            >
              <Text style={styles.briefTitle}>EN BREF :</Text>
              <Text style={styles.descriptionText}>
                {role.desc_role_short}
              </Text>
            </LinearGradient>

            {/* Avantages et Inconvénients */}
            <View style={styles.advantagesDisadvantagesContainer}>
              <LinearGradient
                colors={["#7ED56F", "#28B485"]}
                style={styles.advantagesContainer}
              >
                <Text style={styles.advantagesTitle}>AVANTAGES :</Text>
                <Text style={styles.advantagesText}>{role.avantages}</Text>
              </LinearGradient>

              <LinearGradient
                colors={["#FF416C", "#FF4B2B"]}
                style={styles.disadvantagesContainer}
              >
                <Text style={styles.disadvantagesTitle}>INCONVENIENTS :</Text>
                <Text style={styles.disadvantagesText}>
                  {role.inconvenients}
                </Text>
              </LinearGradient>
            </View>

            {/* Boutons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RoleDescription", {
                    role: roles[currentRoleIndex],
                  })
                }
                style={styles.learnMoreButton}
              >
                <Text style={styles.buttonText}>En savoir plus</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onRoleSelect(role)}
                style={styles.selectButton}
              >
                <Text style={styles.buttonText}>Sélectionner</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        ))}
      </Swiper>
    </ImageBackground>
  );
};

export default SelectRoleScreen;
