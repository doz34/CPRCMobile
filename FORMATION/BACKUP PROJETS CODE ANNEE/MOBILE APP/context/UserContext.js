import React, { createContext, useState, useContext } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = async (nomUtilisateur, motDePasse) => {
    try {
      const response = await axios.post(
        "http://192.168.1.17:3000/api/auth/login",
        {
          nom_utilisateur: nomUtilisateur.trim(), // Utilisez trim() pour supprimer les espaces inutiles
          mot_de_passe: motDePasse,
        }
      );

      if (response.data.token) {
        setUser({
          nomUtilisateur: response.data.nom_utilisateur, // Utiliser le nom d'utilisateur exact retourné par le serveur
          token: response.data.token,
        });
        return { success: true };
      } else {
        return { success: false, message: "Aucun token reçu" };
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Erreur réseau. Veuillez réessayer.",
      };
    }
  };

  const signOut = () => {
    setUser(null);
  };

  const updateUser = async (userData) => {
    if (!user || !user.token) {
      console.error("Aucun utilisateur connecté pour mettre à jour");
      return {
        success: false,
        message: "Vous devez être connecté pour effectuer cette action.",
      };
    }

    try {
      const response = await axios.put(
        "http://192.168.1.17:3000/api/user",
        userData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (response.status === 200) {
        console.log("User info updated successfully.");
        return { success: true, data: response.data }; // Indicateur de succès ajouté
      } else {
        return {
          success: false,
          message:
            "La mise à jour a échoué avec le code de statut: " +
            response.status,
        };
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Une erreur s'est produite lors de la mise à jour.",
      };
    }
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
