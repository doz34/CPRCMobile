import React, { useState, useEffect, useContext, useCallback, useRef, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
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
  const idPerso = route.params.idPerso;
  const currentRoleIndex = useRef(0);

  console.log('Component Rendered');

  const fetchRoles = useCallback(async () => {
    console.log('Fetching roles...');
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
      console.log('Roles fetched:', rolesWithImages);
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles :', error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    console.log('useEffect triggered');
    if (user?.token) {
      fetchRoles();
    }
  }, [user?.token, fetchRoles]);

  const onRoleSelect = useCallback(async () => {
    console.log('Selecting role...');
    try {
      const selectedRole = roles[currentRoleIndex.current];
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
  }, [roles, idPerso, user.token, navigation]);

  if (loading) {
    console.log('Loading...');
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground
      source={require('../../assets/Inscription.png')}
      style={styles.backgroundImage}
    >
      <Swiper
        style={styles.wrapper}
        onIndexChanged={(index) => {
          console.log('Swiper index changed:', index);
          currentRoleIndex.current = index;
        }}
        loop={true} // Enable looping
        removeClippedSubviews={false} // Prevents re-rendering of off-screen components
      >
        {roles.map((role) => (
          <RoleCard
            key={role.id_role}
            role={role}
          />
        ))}
      </Swiper>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('RoleDescription', {
              role: roles[currentRoleIndex.current]
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
      <Arrow direction="left" />
      <Arrow direction="right" />
      <ModalManager />
    </ImageBackground>
  );
};

const RoleCard = memo(({ role }) => {
  const openModal = useCallback((content) => {
    ModalManager.open(content);
  }, []);

  console.log('Rendering RoleCard:', role.id_role);
  return (
    <View style={styles.roleContainer}>
      <Image source={{ uri: role.role_img }} style={styles.roleImageWrapper} />
      <Text style={styles.title}>{role.nom_role}</Text>
      <LinearGradient
        colors={['#C0C0C0', '#484848']}
        style={styles.descriptionContainer}
      >
        <Text style={styles.briefTitle}>EN BREF :</Text>
        <MyTextComponent text={role.desc_role_short} style={styles.descriptionText} />
      </LinearGradient>
      <View style={styles.advantagesDisadvantagesContainer}>
        <TouchableOpacity
          onPress={() => openModal({ type: 'advantages', content: role.avantages })}
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
          onPress={() => openModal({ type: 'disadvantages', content: role.inconvenients })}
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
  );
});

const ModalManager = () => {
  const [modalContent, setModalContent] = useState(null);

  const open = useCallback((content) => {
    setModalContent(content);
  }, []);

  const close = useCallback(() => {
    setModalContent(null);
  }, []);

  ModalManager.open = open;
  ModalManager.close = close;

  return (
    <Modal
      visible={modalContent !== null}
      transparent={true}
      animationType="slide"
      onRequestClose={close}
    >
      <View style={styles.modalMainContainer}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={modalContent?.type === 'advantages' ? ['#7ED56F', '#28B485'] : ['#FF416C', '#FF4B2B']}
            style={styles.modalContentContainer}
          >
            <Text style={styles.modalTitle}>
              {modalContent?.type === 'advantages' ? 'AVANTAGES :' : 'INCONVÉNIENTS :'}
            </Text>
            <MyTextComponent text={modalContent?.content} style={styles.modalText} />
            <TouchableOpacity style={styles.modalCloseButton} onPress={close}>
              <Text style={styles.modalCloseButtonText}>Fermer</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const Arrow = ({ direction }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <Animated.View
      style={[
        styles.arrow,
        direction === 'left' ? styles.arrowLeft : styles.arrowRight,
        { opacity: fadeAnim },
      ]}
    >
      <View style={direction === 'left' ? styles.arrowLeftShape : styles.arrowRightShape} />
    </Animated.View>
  );
};

export default SelectRoleScreen;