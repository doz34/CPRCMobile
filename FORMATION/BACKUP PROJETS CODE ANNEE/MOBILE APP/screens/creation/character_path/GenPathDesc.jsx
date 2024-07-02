import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import styles from './styles';

const GenPathDescScreen = ({ navigation, route }) => {
  const { roleId } = route.params;

  return (
    <ImageBackground source={require("../../../assets/Inscription.png")} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.descriptionTitleText}>Generic Path Description</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.descriptionText}>
            Here is where you describe the generic path for character creation...
          </Text>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('CulturalOrigin', { roleId })}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default GenPathDescScreen;