import React from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function SignUpFin({ navigation}) {

  return (
    <View style={styles.container}>
      <NoScaleText style={styles.text}>일상을 내 손 안에</NoScaleText>
      <NoScaleText style={styles.appname}>오늘Do</NoScaleText>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.image}
      />

      <TouchableOpacity
        style={styles.signup}
        onPress={() => {
          navigation.navigate('SignUpEmail');
        }}
      >
        <NoScaleText style={styles.signupText}>계정 생성하기</NoScaleText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signin}
        onPress={() => {
          navigation.navigate('SignIn');
        }}
      >
        <NoScaleText style={styles.signinText}>로그인</NoScaleText>
      </TouchableOpacity>
    </View>
    
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 220,
  },
  appname: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3A9CFF',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  image: {
    width: 130,
    height: 130,
    resizeMode: 'contain', // 이미지 비율 유지
  },
  signup: {
    backgroundColor: '#3A9CFF',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    width: 180,
    alignSelf: 'center',
    marginTop: 100,
  },
  signin: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    width: 180,
    alignSelf: 'center',
    marginTop: 30,
  },
  signupText: {
    color: '#fff',
    fontWeight: 'bold',

  },
  signinText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
