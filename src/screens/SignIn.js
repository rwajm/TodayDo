import React, { useState } from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function SignIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [pw, setpw] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>

          <View style={styles.emailinputContainer}>
            <NoScaleTextInput
              style={styles.emailinput}
              
              placeholder="e-mail"
              placeholderTextColor="#9a9a9aff"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.pwinputContainer}>
            <NoScaleTextInput
              style={styles.pwinput}
              placeholder="password"
              placeholderTextColor="#9a9a9aff"
              value={pw}
              onChangeText={setpw}
              autoCapitalize="none"
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !email && styles.buttonDisabled]}
            disabled={!email}
            onPress={() => {
              navigation.navigate('Main');
            }}
          >
            <NoScaleText style={styles.buttonText}>로그인</NoScaleText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: 8,

    //iOS 그림자 속성
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    //Android 그림자 속성
    elevation: 6,
  },
  emailinputContainer: {
    marginBottom: 20,
    marginTop: 30,
    paddingHorizontal: 15,
  },
  emailinput: {
    borderRadius: 60,
    height: 45,
    fontSize: 15,
    color: '#000',
    paddingHorizontal: 20,
    backgroundColor: '#edededff',
  },
  pwinputContainer: {
    marginBottom: 20,
    marginTop: 5,
    paddingHorizontal: 15,
  },
  pwinput: {
    borderRadius: 60,
    height: 45,
    fontSize: 15,
    color: '#000',
    paddingHorizontal: 20,
    backgroundColor: '#edededff',
  },
  button: {
    backgroundColor: '#3A9CFF',
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
    width: 90,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});