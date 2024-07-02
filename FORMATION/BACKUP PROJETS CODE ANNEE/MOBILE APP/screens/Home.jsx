import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 35,
    marginTop: 20,
    textAlign: "center",
    color: "white",
    fontFamily: "Roboto",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  boldText: {
    fontWeight: "bold",
  },
  avatarImage: {
    width: 328,
    height: 328,
    borderRadius: 164,
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#fd0d1b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
});

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const [imageKey, setImageKey] = useState(Date.now()); // Ajoutez un état pour gérer la clé de l'image

  const fetchUserInfo = useCallback(async () => {
    if (user) {
      try {
        const response = await axios.get(
          "http://192.168.1.17:3000/api/user/me",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setUserInfo(response.data);
        setImageKey(Date.now()); // Mettez à jour la clé de l'image à chaque fois que vous récupérez les informations de l'utilisateur
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur :",
          error
        );
      }
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo(); // Appellez fetchUserInfo à chaque fois que l'écran est focalisé
    }, [fetchUserInfo])
  );

  return (
    <ImageBackground
      source={require("../assets/Home.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {user ? (
          <>
            <Text style={styles.welcomeText}>
              Bienvenue,{" "}
              <Text style={styles.boldText}>{user.nomUtilisateur}</Text> !
            </Text>
            {userInfo && userInfo.avatarUrl && (
              <Image
              key={imageKey} // Utilisez la clé unique pour l'élément <Image>
              source={{ uri: userInfo.avatarUrl }}
              style={styles.avatarImage}
            />
            )}
            <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("DisclaimerCharacter")}
              >
                <Text style={styles.buttonText}>Nouveau Personnage</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("MyAccount")}
              >
                <Text style={styles.buttonText}>Mon Compte</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={signOut}>
                <Text style={styles.buttonText}>Se déconnecter</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.welcomeText}>
              Bienvenue dans Cyberpunk Red Companion
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Connexion")}
              >
                <Text style={styles.buttonText}>Se connecter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Inscription")}
              >
                <Text style={styles.buttonText}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
};
export default HomeScreen;
