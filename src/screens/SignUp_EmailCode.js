import React, { useState } from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function SignUpEmailCode({ navigation, route }) {
  const { email } = route.params;
  const [code, setCode] = useState('');

  const totalSteps = 3; // 회원가입 총 단계
  const currentStep = 1; // 현재 단계 (2단계로 변경)
  const progressWidth = `${(currentStep / totalSteps) * 100}%`; // 진행바 길이

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: progressWidth }]} />
          </View>

          <View style={styles.inputContainer}>
            <NoScaleText style={styles.emailText}>{email}로 인증코드를 전송했습니다.</NoScaleText>
            <NoScaleText style={styles.label}>이메일 인증코드 입력</NoScaleText>
            <NoScaleTextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={5}
              onChangeText={setCode}
              value={code}
            />
            <TouchableOpacity onPress={() => {
              // 인증코드 재전송 기능 추가 예정
            }}>
              <NoScaleText style={styles.resend}>재전송</NoScaleText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, !code && styles.buttonDisabled]}
            disabled={!code}
            onPress={() => {
              navigation.navigate('SignUpPW', { code });
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
  progressBar: {
    height: 3,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3A9CFF',
    borderRadius: 2,
  },
  inputContainer: {
    marginBottom: 20,
    marginTop: 5,
    paddingHorizontal: 15,
  },
  emailText: {
    marginBottom: 8,
    color: '#8f8f8fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  resend: {
    textAlign: 'right',
    color: '#4a90e2',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#3A9CFF',
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
    width: 80,
    alignSelf: 'center',
    marginTop: 25,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
