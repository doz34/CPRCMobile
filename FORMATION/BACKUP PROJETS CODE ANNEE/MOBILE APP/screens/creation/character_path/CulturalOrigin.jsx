import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { UserContext } from '../../../context/UserContext';
import axios from 'axios';

const CulturalOrigin = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const [origins, setOrigins] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLanguages = async (originId) => {
    try {
      const response = await axios.get(`http://192.168.1.17:3000/api/languages/${originId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setLanguages(response.data);
      if (response.data.length > 0) {
        setSelectedLanguage(response.data[0].nom_langue); // Set default language as the first in the list
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des langues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrigins = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://192.168.1.17:3000/api/origins', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setOrigins(response.data);
        if (response.data.length > 0) {
          setSelectedOrigin(response.data[0].nom_origine);
          fetchLanguages(response.data[0].id_origine);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des origines culturelles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchOrigins();
    }
  }, [user?.token]);

  const handleOriginChange = (itemValue, itemIndex) => {
    setSelectedOrigin(itemValue);
    fetchLanguages(origins[itemIndex].id_origine);
  };

  const randomizeOrigin = () => {
    const randomIndex = Math.floor(Math.random() * origins.length);
    const randomOrigin = origins[randomIndex];
    setSelectedOrigin(randomOrigin.nom_origine);
    fetchLanguages(randomOrigin.id_origine);
  };

  const randomizeLanguage = () => {
    if (languages.length > 0) {
      const randomIndex = Math.floor(Math.random() * languages.length);
      setSelectedLanguage(languages[randomIndex].nom_langue);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const onContinue = async () => {
    try {
      const originId = origins.find(o => o.nom_origine === selectedOrigin).id_origine;
      const languageId = languages.find(l => l.nom_langue === selectedLanguage).id_langue;
      // Access the idPerso parameter directly from the route.params object
      const idPerso = route.params.idPerso;

      const response = await axios.put(
        `http://192.168.1.17:3000/api/character/update-personnage/${idPerso}`,
        {
          id_origine: originId,
          id_langue: languageId
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );

      if (response.status === 200) {
        console.log('Personnage mis à jour avec succès:', response.data);
        // Navigate to the next screen or perform other actions
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du personnage :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre origine culturelle :</Text>
      <Picker
        selectedValue={selectedOrigin}
        style={{ height: 50, width: 300 }}
        onValueChange={handleOriginChange}>
        {origins.map(origin => (
          <Picker.Item key={origin.id_origine} label={origin.nom_origine} value={origin.nom_origine} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={randomizeOrigin}>
        <Text style={styles.buttonText}>Origine aléatoire</Text>
      </TouchableOpacity>

      <Text style={styles.title}>La langue que vous connaissez :</Text>
      <Picker
        selectedValue={selectedLanguage}
        style={{ height: 50, width: 300 }}
        onValueChange={(itemValue) => setSelectedLanguage(itemValue)}>
        {languages.map(language => (
          <Picker.Item key={language.id_langue} label={language.nom_langue} value={language.nom_langue} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={randomizeLanguage}>
        <Text style={styles.buttonText}>Langue aléatoire</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  button: {
    marginTop: 10,
    backgroundColor: '#000',
    padding: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});

export default CulturalOrigin;