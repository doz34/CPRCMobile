#!/bin/bash

for version in v*; do
  if [ -d "$version" ]; then
    echo "Processing $version"
    cp -r "$version"/* .
    find . -name ".git" -type d -exec rm -rf {} +  # Supprimer les dossiers .git imbriqués
    git add .
    git commit -m "Add $version"
    git tag "$version"
    git rm -r *  # Supprimer les fichiers pour préparer l'importation de la prochaine version
  fi
done