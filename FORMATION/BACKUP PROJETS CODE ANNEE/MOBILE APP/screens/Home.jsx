import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { UserContext } from "../context/UserContext";

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useContext(UserContext);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.welcomeText}>Bienvenue, {user.nomUtilisateur}</Text>
          {/* Bouton pour naviguer vers la page Mon Compte */}
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
