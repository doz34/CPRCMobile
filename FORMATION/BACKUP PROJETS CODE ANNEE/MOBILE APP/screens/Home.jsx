import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans Cyberpunk Red</Text>
      <Button
        title="Inscription"
        onPress={() => navigation.navigate('Inscription')}
        color="#ff3d00"
      />
      <Button
        title="Connexion"
        onPress={() => navigation.navigate('Connexion')}
        color="#ff3d00"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
