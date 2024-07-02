import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const ConnexionScreen = ({ navigation }) => {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const handleConnexion = async () => {
    try {
      const response = await axios.post('http://192.168.1.17:3000/api/login', {
        nom_utilisateur: nomUtilisateur,
        mot_de_passe: motDePasse,
      });
      
      // Supposons que la réponse réussie du serveur renvoie l'utilisateur et un message de succès
      if (response.data.user && response.data.message === "Connexion réussie") {
        // Ici, vous pouvez gérer la navigation ou le stockage du token d'authentification si nécessaire
        // Par exemple : AsyncStorage.setItem('userToken', response.data.token);
        // Remplacez 'NomDeLaRouteDeLApplicationPrincipale' par le nom de votre route principale
        Alert.alert('Connexion réussie', 'Vous êtes maintenant connecté.', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
        
        navigation.navigate('Home');
      } else {
        // Si la connexion échoue mais que le serveur répond quand même (par exemple, mauvais identifiants)
        Alert.alert('Erreur de connexion', response.data.message || 'Nom d’utilisateur ou mot de passe incorrect.');
      }
    } catch (error) {
      // Si la requête échoue (problème réseau, serveur indisponible, etc.)
      Alert.alert('Erreur de connexion', 'Une erreur s’est produite lors de la connexion.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={nomUtilisateur}
        onChangeText={setNomUtilisateur}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={motDePasse}
        onChangeText={setMotDePasse}
      />
      <Button title="Se connecter" onPress={handleConnexion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default ConnexionScreen;
