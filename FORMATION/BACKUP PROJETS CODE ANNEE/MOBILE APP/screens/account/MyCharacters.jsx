import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const MyCharacters = () => {
  const { user } = useContext(UserContext);
  const [characters, setCharacters] = useState([]);
  const [sortedCharacters, setSortedCharacters] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nom_perso', direction: 'ascending' });

  useEffect(() => {
    fetchCharacters();
  }, [user.token]);

  const fetchCharacters = async () => {
    console.log('Starting to fetch characters...');
    try {
      console.log('Sending request to server...');
      const response = await axios.get(`http://192.168.1.17:3000/api/character/characters`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log('Response received:', response.data);
  
      if (response.data && response.data.length > 0) {
        const updatedCharacters = response.data.map(char => {
          console.log(`Processed icon URL for ${char.nom_perso}: ${char.icon}`);
          return {
            ...char,
            icon: char.icon || '../../assets/fallback.png'
          };
        });
        setCharacters(updatedCharacters);
        setSortedCharacters(updatedCharacters);
        console.log('Characters updated successfully');
      } else {
        console.log('No characters found in response');
      }
    } catch (error) {
      console.error('Failed to fetch characters:', error);
      console.log('Error details:', error.response ? error.response.data : 'No additional error information available');
    }
};

  
  
  const sortCharacters = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    const sortedData = [...characters].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setSortedCharacters(sortedData);
    setSortConfig({ key, direction });
  };

  const renderItem = ({ item }) => (
    <View style={styles.characterContainer}>
      <Image 
        source={{ uri: item.icon }}
        style={styles.characterIcon}
        onError={(e) => console.log('Failed to load character icon', e)}
      />
      <Text style={styles.characterName}>{item.nom_perso}</Text>
      <Text style={styles.characterRole}>{item.role}</Text>
      <Text style={styles.characterDate}>{new Date(item.date_creation).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => sortCharacters('nom_perso')}>
        <Text style={styles.sortText}>Sort by Name</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => sortCharacters('role')}>
        <Text style={styles.sortText}>Sort by Role</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => sortCharacters('date_creation')}>
        <Text style={styles.sortText}>Sort by Date</Text>
      </TouchableOpacity>
      <FlatList
        data={sortedCharacters}
        renderItem={renderItem}
        keyExtractor={item => item.id_perso.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  characterContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  characterIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  characterName: {
    flex: 3,
  },
  characterRole: {
    flex: 3,
  },
  characterDate: {
    flex: 3,
  },
  sortText: {
    fontSize: 18,
    padding: 10,
  },
});

export default MyCharacters;
