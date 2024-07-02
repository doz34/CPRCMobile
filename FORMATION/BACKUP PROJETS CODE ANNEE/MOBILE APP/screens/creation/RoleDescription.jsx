import React, { useContext } from 'react';
import { View, Text, ScrollView, ImageBackground } from 'react-native';
import { UserContext } from '../../context/UserContext';
import MyTextComponent from './MyText';
import styles from './styles';
import { LinearGradient } from 'expo-linear-gradient';

const RoleDescriptionScreen = ({ route }) => {
  const { role } = route.params;
  const { roles } = useContext(UserContext);

  if (!role) {
    return <Text>Aucun rôle sélectionné</Text>;
  }

  return (
    <ImageBackground
      source={require("../../assets/Inscription.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        

        <LinearGradient
          colors={["#868686", "#484848"]}
          style={[styles.placeholderContainer, styles.capacityContainer]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.roleDescriptionTitleText}>CAPACITÉ DU RÔLE :</Text>
          </View>
          <View style={styles.contentContainer}>
            <View>
              <MyTextComponent text={role.capa_role} style={styles.roleDescriptionText} />
            </View>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={["#868686", "#484848"]}
          style={styles.placeholderContainer}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.roleDescriptionTitleText}>DESCRIPTION DÉTAILLÉE DU RÔLE :</Text>
          </View>
          <View style={styles.contentContainer}>
            <View>
              <MyTextComponent text={role.desc_role_long} style={styles.roleDescriptionText} />
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </ImageBackground>
  );
};

export default RoleDescriptionScreen;