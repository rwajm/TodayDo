import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NextScreen({ route }) {
  const { email } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World!</Text>
      <Text>이메일: {email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
