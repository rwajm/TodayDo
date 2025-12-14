import React from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function ForgotPWFin({ navigation}) {

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <NoScaleText style={styles.text}>비밀번호 변경 완료</NoScaleText>
          <NoScaleText style={styles.info}>계정이 로그아웃 됩니다.{'\n'}다시 로그인 해주세요.</NoScaleText>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('InitialScreen');
            }}
          >
            <NoScaleText style={styles.buttonText}>확인</NoScaleText>
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
    alignItems: 'center',
    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    // Android 그림자
    elevation: 6,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 120,
  },
  info: {
    color: '#575757ff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  button: {
    backgroundColor: '#3A9CFF',
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
    width: 70,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
});
