import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const InscriptionScreen = ({ navigation }) => {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [email, setEmail] = useState('');

  const handleInscription = async () => {
    try {
      const response = await axios.post('http://192.168.1.17:3000/api/auth/signup', {
        nom_utilisateur: nomUtilisateur,
        mot_de_passe: motDePasse,
        email: email,
      });

      if (response.data) {
        Alert.alert('Inscription réussie', 'Vous pouvez maintenant vous connecter.', [
          { text: 'OK', onPress: () => navigation.navigate('Connexion') },
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur lors de l\'inscription', 'Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.');
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
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="S'inscrire" onPress={handleInscription} />
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

export default InscriptionScreen;