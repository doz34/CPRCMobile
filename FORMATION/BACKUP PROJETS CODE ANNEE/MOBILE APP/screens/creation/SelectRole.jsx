import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground
} from 'react-native';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import styles from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-swiper';
import MyTextComponent from './MyText';

const SelectRoleScreen = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isAdvantagesModalVisible, setIsAdvantagesModalVisible] = useState(false);
  const [isDisadvantagesModalVisible, setIsDisadvantagesModalVisible] = useState(false);
  const idPerso = route.params.idPerso;

  const AdvantagesModal = ({ role, onClose }) => (
    <View style={styles.modalMainContainer}>
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#7ED56F', '#28B485']}
          style={styles.modalContentContainer}
        >
          <Text style={styles.modalTitle}>AVANTAGES :</Text>
          <MyTextComponent text={role.avantages} style={styles.modalText} />
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Fermer</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );

  const DisadvantagesModal = ({ role, onClose }) => (
    <View style={styles.modalMainContainer}>
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#FF416C', '#FF4B2B']}
          style={styles.modalContentContainer}
        >
          <Text style={styles.modalTitle}>INCONVÉNIENTS :</Text>
          <MyTextComponent text={role.inconvenients} style={styles.modalText} />
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Fermer</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          'http://192.168.1.17:3000/api/user/roles',
          {
            headers: { Authorization: `Bearer ${user?.token}` }
          }
        );
        const rolesWithImages = response.data.map((role) => ({
          ...role,
          role_img: `http://192.168.1.17:3000/${role.role_img}`
        }));
        setRoles(rolesWithImages);
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles :', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchRoles();
    }
  }, [user?.token]);

  const onRoleSelect = async () => {
    try {
      const selectedRole = roles[currentRoleIndex];
      const requestBody = {
        idRole: selectedRole.id_role
      };

      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-role/${idPerso}`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );

      if (response.status === 200) {
        console.log('Rôle mis à jour avec succès :', response.data);
        navigation.navigate('CulturalOrigin', { idPerso });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle du personnage :', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground
      source={require('../../assets/Inscription.png')}
      style={styles.backgroundImage}
    >
      <Swiper
        style={styles.wrapper}
        onIndexChanged={setCurrentRoleIndex}
        loop={false}
      >
        {roles.map((role) => (
          <View key={role.id_role} style={styles.roleContainer}>
            <Image source={{ uri: role.role_img }} style={styles.roleImageWrapper} />
            {/* Titre du rôle */}
            <Text style={styles.title}>{role.nom_role}</Text>

            {/* Description en bref */}
            <LinearGradient
              colors={['#C0C0C0', '#484848']}
              style={styles.descriptionContainer}
            >
              <Text style={styles.briefTitle}>EN BREF :</Text>
              <MyTextComponent text={role.desc_role_short} style={styles.descriptionText} />
            </LinearGradient>

            {/* Avantages et Inconvénients */}
            <View style={styles.advantagesDisadvantagesContainer}>
              <TouchableOpacity
                onPress={() => setIsAdvantagesModalVisible(true)}
                style={styles.thirdContainer}
              >
                <LinearGradient
                  colors={['#7ED56F', '#28B485']}
                  style={[styles.advantagesContainer, { borderRadius: 30 }]}
                >
                  <Text style={styles.advantagesTitle}>AVANTAGES :</Text>
                  <MyTextComponent text={role.avantages} style={styles.advantagesText} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsDisadvantagesModalVisible(true)}
                style={styles.thirdContainer}
              >
                <LinearGradient
                  colors={['#FF416C', '#FF4B2B']}
                  style={[styles.disadvantagesContainer, { borderRadius: 30 }]}
                >
                  <Text style={styles.disadvantagesTitle}>INCONVÉNIENTS :</Text>
                  <MyTextComponent text={role.inconvenients} style={styles.disadvantagesText} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Swiper>

      {/* Boutons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('RoleDescription', {
              role: roles[currentRoleIndex]
            })
          }
          style={styles.learnMoreButton}
        >
          <Text style={styles.buttonText}>En savoir plus</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRoleSelect} style={styles.selectButton}>
          <Text style={styles.buttonText}>Sélectionner</Text>
        </TouchableOpacity>
      </View>

      {isAdvantagesModalVisible && (
        <AdvantagesModal
          role={roles[currentRoleIndex]}
          onClose={() => setIsAdvantagesModalVisible(false)}
        />
      )}

      {isDisadvantagesModalVisible && (
        <DisadvantagesModal
          role={roles[currentRoleIndex]}
          onClose={() => setIsDisadvantagesModalVisible(false)}
        />
      )}
    </ImageBackground>
  );
};

export default SelectRoleScreen;