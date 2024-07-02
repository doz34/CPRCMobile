const db = require('./db'); // Correction des guillemets
const bcrypt = require('bcryptjs'); // Correction des guillemets

// Fonction pour hasher le mot de passe
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Fonction pour enregistrer un utilisateur
async function registerUser(nom_utilisateur, mot_de_passe, email) {
  const hashedPassword = await hashPassword(mot_de_passe);
  const result = await db.query(
    'INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, date_inscription) VALUES ($1, $2, $3, NOW()) RETURNING id_utilisateur', // Correction des guillemets
    [nom_utilisateur, hashedPassword, email]
  );
  return result.rows[0].id_utilisateur;
}

// Fonction pour connecter un utilisateur
async function loginUser(nom_utilisateur, mot_de_passe) {
  try {
    const userResult = await db.query(
      'SELECT * FROM utilisateurs WHERE nom_utilisateur = $1 OR email = $1', // Correction des guillemets
      [nom_utilisateur]
    );

    if (userResult.rows.length) {
      const user = userResult.rows[0];
      // Assurez-vous que le nom de la colonne mot de passe haché est correct
      const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe); // Ici, ‘user.mot_de_passe’ doit correspondre à la colonne de votre DB

      if (match) {
        return user; // L’utilisateur est authentifié
      } else {
        throw new Error('Mot de passe incorrect.'); // Correction des guillemets
      }
    } else {
      throw new Error('Utilisateur non trouvé.'); // Correction des guillemets
    }
  } catch (error) {
    // Gérer les erreurs de la base de données ou autres erreurs ici
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser, // Ajouté pour l’exportation
};
