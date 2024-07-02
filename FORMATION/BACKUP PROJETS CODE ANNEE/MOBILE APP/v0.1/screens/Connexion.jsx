import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const ConnexionScreen = ({ navigation }) => {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const handleConnexion = async () => {
    try {
      const response = await axios.post('/api/auth', {
        nom_utilisateur: nomUtilisateur,
        mot_de_passe: motDePasse,
      });
      // Stocker le jeton d'authentification et rediriger vers l'application principale
      // Exemple: navigation.navigate('NomDeLaRouteDeLApplicationPrincipale');
    } catch (error) {
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
