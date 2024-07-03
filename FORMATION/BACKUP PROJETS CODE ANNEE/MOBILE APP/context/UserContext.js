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
        // Stockez à la fois le nom d'utilisateur et le token
        setUser({ nomUtilisateur, token: response.data.token });
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

  // Ajout de la fonction updateUser
  const updateUser = async (userData) => {
    try {
      const { data } = await axios.put("http://192.168.1.17:3000/api/user", userData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUser((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
