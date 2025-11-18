import React, { useState } from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function AccountManagement({ navigation }) {
    const [email, setEmail] = useState('');
    const [pw, setpw] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <View style={styles.emailinputContainer}>
            <NoScaleText style={styles.emailtext}>이메일</NoScaleText>
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
            <NoScaleText style={styles.pwtext}>비밀번호</NoScaleText>
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
            onPress={() => {
              navigation.navigate('ChangePW');
            }}
          >
            <NoScaleText style={styles.changepwtext}>비밀번호 변경</NoScaleText>
          </TouchableOpacity>
          <NoScaleText style={styles.warning}>개인정보는 절대 타인에게 보여주지 마세요.</NoScaleText>
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
  emailtext: {
    marginBottom: 15,
    marginLeft: 20,
    fontWeight: 600,
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
  pwtext: {
    marginBottom: 15,
    marginLeft: 20,
    fontWeight: 600,
  },
  pwinput: {
    borderRadius: 60,
    height: 45,
    fontSize: 15,
    color: '#000',
    paddingHorizontal: 20,
    backgroundColor: '#edededff',
  },
  changepwtext: {
    color: '#3A9CFF',
    alignSelf: 'flex-end',
    marginRight: 30,
  },
  warning: {
    color: '#6D6D6D',
    alignSelf: 'center',
    marginTop: 150,
  },
});