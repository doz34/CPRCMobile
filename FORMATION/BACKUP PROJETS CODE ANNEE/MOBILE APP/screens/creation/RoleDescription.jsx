import React, { useContext } from 'react';
import { View, Text, ScrollView, ImageBackground } from 'react-native';
import { UserContext } from '../../context/UserContext';
import styles from './styles';

const RoleDescriptionScreen = ({ route }) => {
    const { role } = route.params;
    const { roles } = useContext(UserContext);

  if (!role) {
    return <Text>Aucun rôle sélectionné</Text>; // Ou tout autre JSX de fallback
  }

  return (
    <ImageBackground
      source={require("../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>DESCRIPTION DÉTAILLÉE DU RÔLE :</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>
            {role.desc_role_long}
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default RoleDescriptionScreen;