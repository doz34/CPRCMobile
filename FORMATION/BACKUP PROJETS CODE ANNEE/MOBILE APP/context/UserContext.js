// context/UserContext.js

import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = async (nomUtilisateur, motDePasse) => {
    try {
      const response = await axios.post("http://192.168.1.17:3000/api/auth/login", {
        nom_utilisateur: nomUtilisateur,
        mot_de_passe: motDePasse,
      });

      if (response.data.token) {
        setUser({ nomUtilisateur }); // Considérer l'utilisateur comme connecté
      } else {
        console.error('Erreur de connexion: Aucun token reçu');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
