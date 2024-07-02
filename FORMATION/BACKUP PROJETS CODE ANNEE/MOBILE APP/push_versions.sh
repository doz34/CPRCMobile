#!/bin/bash

# Chemin vers le répertoire contenant les versions
VERSIONS_DIR="/c/Users/DoZ/Desktop/FORMATION/BACKUP PROJETS CODE ANNEE/MOBILE APP"

# Assurez-vous que vous êtes dans le bon répertoire
cd "/c/Users/DoZ/Desktop/FORMATION/BACKUP PROJETS CODE ANNEE/MOBILE APP"

# Créer une nouvelle branche à partir de v0.1
git checkout -b new-branch-v0-1

# Boucle sur chaque version pour créer des tags
for version in {2..56}; do
    # Nom du dossier de la version
    VERSION_DIR="$VERSIONS_DIR/v0.$version"
    
    # Vérifier si le dossier existe
    if [ -d "$VERSION_DIR" ]; then
        echo "Traitement de la version v0.$version"
        
        # Copier les fichiers de la version dans le dépôt en excluant les dossiers .git
        robocopy "$VERSION_DIR" . /MIR /XD ".git"
        
        # Ajouter les fichiers au dépôt
        git add .
        
        # Faire un commit pour la version
        git commit -m "Ajout de la version v0.$version"
        
        # Créer un tag pour la version
        git tag -a "v0.$version" -m "Version 0.$version"
        
        # Pousser les modifications et le tag vers le dépôt distant
        git push origin new-branch-v0-1
        git push origin "v0.$version"
    else
        echo "Le dossier $VERSION_DIR n'existe pas."
    fi
done