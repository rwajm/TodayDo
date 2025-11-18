import React, { useState } from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function ForgotPWNewPW({ navigation }) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const isPasswordValid = password.length > 0 && password === passwordConfirm;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>

          <NoScaleText style={styles.title}>비밀번호 변경</NoScaleText>

          <View style={styles.inputContainer}>
            <NoScaleText style={styles.label1}>새 비밀번호 입력</NoScaleText>
            <NoScaleTextInput
              style={styles.input}
              placeholder="password"
              placeholderTextColor="#bbb"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />
            <NoScaleText style={styles.label2}>비밀번호 확인</NoScaleText>
            <NoScaleTextInput
              style={styles.input}
              placeholder="password"
              placeholderTextColor="#bbb"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry={true}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !isPasswordValid && styles.buttonDisabled]}
            disabled={!isPasswordValid}
            onPress={() => {
              navigation.navigate('ForgotPWFin', { password });
            }}
          >
            <NoScaleText style={styles.buttonText}>계속</NoScaleText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: 8,

    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    // Android 그림자
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    marginTop: 30,
    paddingHorizontal: 15,
  },
  label1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#3A9CFF',
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
    width: 80,
    alignSelf: 'center',
    marginTop: 50,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});