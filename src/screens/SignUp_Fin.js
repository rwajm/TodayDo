import React from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function SignUpFin({ navigation, route }) {
  const { nickname } = route.params || {};

  return (
    <View style={styles.container}>
      <NoScaleText style={styles.text}>회원가입 완료</NoScaleText>
      <NoScaleText style={styles.welcome}>
        <NoScaleText style={styles.nickname}>{nickname}</NoScaleText>님{'\n'}환영합니다!
      </NoScaleText>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.image}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('SignIn');
        }}
      >
        <NoScaleText style={styles.buttonText}>로그인 하러 가기</NoScaleText>
      </TouchableOpacity>
    </View>
    
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 100,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 80,
  },
  welcome: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 90,
    marginBottom: 30,
  },
  nickname: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  image: {
    width: 110,
    height: 110,
    resizeMode: 'contain', // 이미지 비율 유지
  },
  button: {
    backgroundColor: '#3A9CFF',
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
    width: 150,
    alignSelf: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
  },
});
