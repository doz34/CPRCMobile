import React from 'react';
import { Text, View } from 'react-native';

const MyTextSimple = ({ text, style }) => {
  // Split the text by sentences ending with a period, question mark, or exclamation mark followed by a space or end of the text.
  const sentences = text ? text.match(/[^.!?]+[.!?]*\s*/g) : [];

  return (
    <View>
      {sentences.map((sentence, index) => (
        <Text key={index} style={style}>
          {sentence.trim()}
          {'\n'} {/* Ajout du saut de ligne après chaque fin de phrase */}
        </Text>
      ))}
    </View>
  );
};

export default MyTextSimple;
