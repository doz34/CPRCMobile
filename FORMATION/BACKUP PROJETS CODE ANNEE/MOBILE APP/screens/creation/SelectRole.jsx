import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
  Animated
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
  const [isAdvantagesModalVisible, setIsAdvantagesModalVisible] = useState(false);
  const [isDisadvantagesModalVisible, setIsDisadvantagesModalVisible] = useState(false);
  const idPerso = route.params.idPerso;

  const order = [1, 2, 8, 4, 5, 6, 7, 3, 9, 10];
  const swiperRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
        const orderedRoles = order.map(id => rolesWithImages.find(role => role.id_role === id));
        setRoles(orderedRoles);
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles :', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchRoles();
    }
  }, [user?.token, order]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const onRoleSelect = async () => {
    try {
      const selectedRole = roles[swiperRef.current.state.index];
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

  const renderArrow = (direction) => {
    const arrowStyle = direction === 'left' ? styles.leftArrow : styles.rightArrow;
    return (
      <Animated.View style={[styles.arrow, arrowStyle, { opacity: fadeAnim }]}>
        <Text style={styles.arrowText}>{direction === 'left' ? '←' : '→'}</Text>
      </Animated.View>
    );
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
        ref={swiperRef}
        style={styles.wrapper}
        loop={true} // Permettre le swipe infini
        index={0} // Afficher par défaut l'id_role=1
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

      {/* Flèches clignotantes */}
      {renderArrow('left')}
      {renderArrow('right')}

      {/* Boutons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('RoleDescription', {
              role: roles[swiperRef.current.state.index]
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
          role={roles[swiperRef.current.state.index]}
          onClose={() => setIsAdvantagesModalVisible(false)}
        />
      )}

      {isDisadvantagesModalVisible && (
        <DisadvantagesModal
          role={roles[swiperRef.current.state.index]}
          onClose={() => setIsDisadvantagesModalVisible(false)}
        />
      )}
    </ImageBackground>
  );
};

export default SelectRoleScreen;