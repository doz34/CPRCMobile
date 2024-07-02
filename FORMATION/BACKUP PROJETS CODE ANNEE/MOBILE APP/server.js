const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { registerUser, loginUser } = require('./auth'); // Correction : importation de loginUser

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());

// Point de terminaison pour l’inscription
app.post('/api/utilisateurs', async (req, res) => {
  const { nom_utilisateur, mot_de_passe, email } = req.body;
  if (!nom_utilisateur || !mot_de_passe || !email) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }
  try {
    const id_utilisateur = await registerUser(nom_utilisateur, mot_de_passe, email);
    res.status(201).json({ id_utilisateur });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l’utilisateur" });
  }
});

// Point de terminaison pour la connexion
app.post('/api/login', async (req, res) => {
  const { nom_utilisateur, mot_de_passe } = req.body;
  if (!nom_utilisateur || !mot_de_passe) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
  }
  try {
    const user = await loginUser(nom_utilisateur, mot_de_passe);
    res.json({ message: "Connexion réussie", user });
  } catch (error) {
    console.error(error);
    if (error.message === 'Mot de passe incorrect.' || error.message === 'Utilisateur non trouvé.') {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erreur lors de la tentative de connexion" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
