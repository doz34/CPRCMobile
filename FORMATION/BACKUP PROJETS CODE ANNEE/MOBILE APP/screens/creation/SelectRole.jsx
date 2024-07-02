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
import { LinearGradient } from 'expo-linear-gradient';

const SelectRoleScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get(`http://192.168.1.17:3000/api/user/roles/1`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        // Concaténer l'adresse du serveur avec le chemin de l'image
        const imageUrl = `http://192.168.1.17:3000/${response.data.role_img}`;
        console.log("Complete Image URL:", imageUrl); // Pour déboguer l'URL complète
        setSelectedRole({ ...response.data, role_img: imageUrl });
        console.log(response.data)
      } catch (error) {
        console.error("Erreur lors de la récupération des informations du rôle :", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchRole();
    }
  }, [user?.token]);

  const onRoleSelect = async () => {
    if (selectedRole) {
      try {
        const response = await axios.post(
          "http://192.168.1.17:3000/api/user/creer-personnage",
          {
            idRole: selectedRole.id_role,
            idParcours: selectedRole.id_parcours_role, // Assurez-vous que cela correspond à votre structure de données
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
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!selectedRole) {
    return <Text>Aucun rôle sélectionné</Text>; // Ou tout autre JSX de fallback
  }

  return (
    <ImageBackground
      source={require("../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.gridContainer}>
        <Text style={styles.title}>{selectedRole.nom_role}</Text>
        <View style={styles.roleImageWrapper}>
        <Image source={{ uri: selectedRole.role_img }} style={styles.roleImage} />
        </View>
        <View style={styles.advantagesDisadvantagesContainer}>
        <LinearGradient
  colors={['#7ED56F', '#28B485']} // Dégradé progressif de vert clair à vert foncé
  style={styles.advantagesContainer}
>
  <Text style={styles.advantagesTitle}>AVANTAGES :</Text>
  <Text style={styles.advantagesText}>{selectedRole.avantages}</Text>
</LinearGradient>


<LinearGradient
  colors={['#FF416C', '#FF4B2B']} // Exemple de dégradé de rouge
  style={styles.disadvantagesContainer}
>
  <Text style={styles.disadvantagesTitle}>INCONVENIENTS :</Text>
  <Text style={styles.disadvantagesText}>{selectedRole.inconvenients}</Text>
</LinearGradient>
        </View>

        <LinearGradient
  colors={['#C0C0C0', '#484848']} // Gris clair à gris foncé
  start={{x: 0.9, y: 0}} // Commence à la moitié du haut
  end={{x: 0.5, y: 1}} // Se termine à la moitié du bas
  style={styles.descriptionContainer}
>
  <Text style={styles.disadvantagesTitle}>EN BREF :</Text>
  <Text style={styles.descriptionText}>{selectedRole.desc_role_short}</Text>
</LinearGradient>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("RoleDescription", { id: selectedRole.id_role })}
            style={styles.learnMoreButton}
          >
            <Text style={styles.buttonText}>En savoir plus</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRoleSelect} style={styles.selectButton}>
            <Text style={styles.buttonText}>Sélectionner</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SelectRoleScreen;
