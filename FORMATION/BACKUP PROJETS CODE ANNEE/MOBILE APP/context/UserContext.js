import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    console.log("User context initialized with user:", user);
  }, [user]);

  const signIn = async (nomUtilisateur, motDePasse) => {
    try {
      console.log("Attempting to sign in with username:", nomUtilisateur);
      const response = await axios.post(
        "http://192.168.1.17:3000/api/auth/login",
        {
          nom_utilisateur: nomUtilisateur.trim(), // Utilisez trim() pour supprimer les espaces inutiles
          mot_de_passe: motDePasse,
        }
      );

      if (response.data.token) {
        const userData = {
          id: response.data.id_utilisateur, // Assurez-vous que l'ID utilisateur est inclus dans la réponse
          nomUtilisateur: response.data.nom_utilisateur, // Utiliser le nom d'utilisateur exact retourné par le serveur
          token: response.data.token,
        };
        setUser(userData);
        console.log("User signed in:", userData);
        return { success: true };
      } else {
        console.log("No token received during sign in");
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
    console.log("Signing out user:", user?.nomUtilisateur);
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
      console.log("Updating user info for:", user.nomUtilisateur);
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
        console.log("Failed to update user info with status code:", response.status);
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
    <UserContext.Provider value={{ user, signIn, signOut, updateUser, roles, setRoles }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);