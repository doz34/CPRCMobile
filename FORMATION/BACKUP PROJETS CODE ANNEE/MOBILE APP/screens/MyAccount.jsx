import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import axios from 'axios'; // Cette importation semble inutilisée maintenant.

const MyAccount = () => {
  const { user, updateUser } = useContext(UserContext);
  const [nomUtilisateur, setNomUtilisateur] = useState(user?.nomUtilisateur || '');
  const [email, setEmail] = useState(user?.email || '');
  const [motDePasse, setMotDePasse] = useState('');
  const [avatar, setAvatar] = useState(null); // L'implémentation de l'upload d'avatar est à faire

  const handleUpdate = async () => {
    try {
      await updateUser({ nom_utilisateur: nomUtilisateur, email, mot_de_passe: motDePasse });
      Alert.alert("Mise à jour réussie", "Vos informations ont été mises à jour.");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur lors de la mise à jour", "Une erreur s'est produite lors de la mise à jour. Veuillez réessayer.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Compte</Text>
      <TextInput style={styles.input} placeholder="Nom d'utilisateur" value={nomUtilisateur} onChangeText={setNomUtilisateur} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Nouveau mot de passe" secureTextEntry value={motDePasse} onChangeText={setMotDePasse} />
      {/* Implémenter l'upload d'avatar ici */}
      <Button title="Mettre à jour" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default MyAccount;
