import React from 'react';
import { Text, View } from 'react-native';

const MyTextComponent = ({ text, style }) => {
  // Supprime les espaces supplémentaires avant et après le texte
  const trimmedText = text ? text.trim() : '';

  // Remplace les caractères \n par de véritables sauts de ligne
  const formattedText = trimmedText.split('\\n').map((line, index) => (
    <View key={index} style={{ flexDirection: 'row' }}>
      <Text style={style}>{line}</Text>
      {/* Ajout d'un saut de ligne après chaque ligne de texte, avec une taille de police plus petite */}
      {index !== trimmedText.split('\\n').length - 1 && (
        <Text style={{ fontSize: 10 }}>{'\n'}</Text>
      )}
    </View>
  ));

  return <View>{formattedText}</View>;
};

export default MyTextComponent;
