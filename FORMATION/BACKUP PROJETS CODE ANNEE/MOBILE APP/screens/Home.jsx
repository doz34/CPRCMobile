import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { UserContext } from "../context/UserContext";
import axios from 'axios'; // Importez axios

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null); // Nouvel état pour les informations de l'utilisateur

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const response = await axios.get('http://192.168.1.17:3000/api/user/me', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setUserInfo(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.welcomeText}>Bienvenue, {user.nomUtilisateur}</Text>
          {userInfo && userInfo.avatarUrl && (
  <Image
    source={{ uri: userInfo.avatarUrl }}
    style={{ width: 100, height: 100 }} // Ajustez les dimensions selon vos besoins
  />
)}
          <Button title="Mon Compte" onPress={() => navigation.navigate('MyAccount')} />
          <Button title="Se déconnecter" onPress={signOut} />
        </>
      ) : (
        <>
          <Text style={styles.welcomeText}>Bienvenue sur Cyberpunk Red Companion</Text>
          <Button title="Se connecter" onPress={() => navigation.navigate('Connexion')} />
          <Button title="S'inscrire" onPress={() => navigation.navigate('Inscription')} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
