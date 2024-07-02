import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import styles from './styles';

const GenPathClothingScreen = ({ navigation, route }) => {
  const { roleId } = route.params;

  return (
    <ImageBackground source={require("../../../assets/Inscription.png")} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.descriptionTitleText}>Clothing & Style</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.descriptionText}>
            What does your character typically wear?
          </Text>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('GenPathValues', { roleId })}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default GenPathClothingScreen;