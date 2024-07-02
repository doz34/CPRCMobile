import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import styles from './account_styles/MyCharacters.styles';

const MyCharacters = () => {
  const { user } = useContext(UserContext);
  const [characters, setCharacters] = useState([]);
  const [sortedCharacters, setSortedCharacters] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nom_perso', direction: 'ascending' });
  const [sortBy, setSortBy] = useState('nom_perso');
  const [sortDirection, setSortDirection] = useState('ascending');

  useEffect(() => {
    fetchCharacters();
  }, [user.token]);

  useEffect(() => {
    sortCharacters(sortBy, sortDirection);
  }, [sortBy, sortDirection, characters]);

  const fetchCharacters = async () => {
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/character/characters`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (response.data && response.data.length > 0) {
        const updatedCharacters = response.data.map(char => ({
          ...char,
          icon: char.icon || '../../assets/fallback.png'
        }));
        setCharacters(updatedCharacters);
        setSortedCharacters(updatedCharacters);
      }
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    }
  };

  const sortCharacters = (key, direction) => {
    const sortedData = [...characters].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setSortedCharacters(sortedData);
    setSortConfig({ key, direction });
  };

  const renderItem = ({ item }) => {
    const creationDate = new Date(item.date_creation);
    const formattedDate = `${creationDate.toLocaleDateString()} ${creationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
      <View style={styles.characterContainer}>
        <Image
          source={{ uri: item.icon }}
          style={styles.characterIcon}
        />
        <Text style={styles.characterName}>{item.nom_perso}</Text>
        <Text style={styles.characterRole}>{item.role}</Text>
        <Text style={styles.characterDate}>{formattedDate}</Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/Inscription.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.sortContainer}>
          <Picker
            selectedValue={sortBy}
            onValueChange={(value) => setSortBy(value)}
            style={styles.picker}
          >
            <Picker.Item label="Trier par Nom" value="nom_perso" />
            <Picker.Item label="Trier par Rôle" value="role" />
            <Picker.Item label="Trier par Date" value="date_creation" />
          </Picker>
          <Picker
            selectedValue={sortDirection}
            onValueChange={(value) => setSortDirection(value)}
            style={styles.picker}
          >
            <Picker.Item label="Ascendant" value="ascending" />
            <Picker.Item label="Descendant" value="descending" />
          </Picker>
        </View>
        <LinearGradient
          colors={['#868686', '#484848']}
          style={styles.placeholderContainer}
        >
          <View style={styles.headerContainer}>
            <View style={styles.iconHeaderPlaceholder} />
            <Text style={styles.headerText}>Nom</Text>
            <Text style={styles.headerText}>Rôle</Text>
            <Text style={styles.headerText}>Date de Création</Text>
          </View>
          <FlatList
            data={sortedCharacters}
            renderItem={renderItem}
            keyExtractor={item => item.id_perso.toString()}
          />
        </LinearGradient>
      </View>
    </ImageBackground>
  );
};

export default MyCharacters;