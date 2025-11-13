import React from 'react';
import { Text, TextInput } from 'react-native';

export function NoScaleText(props) {
  return <Text {...props} allowFontScaling={false} />;
}

export function NoScaleTextInput(props) {
  return <TextInput {...props} allowFontScaling={false} />;
}
