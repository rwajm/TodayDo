import React, { useState } from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function ForgotPWEmail({ navigation }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handlePress = () => {
    if (!isCodeSent) {
      // 1단계: 인증코드 보내기
      sendEmailCode(email);
      setIsCodeSent(true);
    } else {
      // 2단계: 인증코드 확인 후 다음 단계
      navigation.navigate('SignUpPW', { email, code });
    }
  };

  //인증코드 전송
  const sendEmailCode = () => {
    // 실제 API 연결
    console.log('인증코드 전송:', email);
    setIsCodeSent(true);
  };

  const resendCode = () => {
    // TODO: 재전송 API
    console.log('인증코드 재전송:', email);
  };

  const isButtonDisabled =
    (!isCodeSent && !email) ||
    (isCodeSent && !code);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>

          <View style={styles.inputContainer}>
            <NoScaleText style={styles.label}>이메일 입력</NoScaleText>
            <NoScaleTextInput
              style={styles.input}
              placeholder="e-mail"
              placeholderTextColor="#bbb"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isCodeSent}
            />
          </View>

          {isCodeSent && (
            <View style={styles.inputContainer}>
              <NoScaleText style={styles.emailText}>
                {email}로 인증코드를 전송했습니다.
              </NoScaleText>

              <NoScaleText style={styles.label}>이메일 인증코드 입력</NoScaleText>
              <NoScaleTextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={5}
                value={code}
                onChangeText={setCode}
              />

              <TouchableOpacity onPress={resendCode}>
                <NoScaleText style={styles.resend}>재전송</NoScaleText>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
            disabled={isButtonDisabled}
            onPress={handlePress}
          >
            <NoScaleText style={styles.buttonText}>계속</NoScaleText>
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
  inputContainer: {
    marginBottom: 20,
    marginTop: 30,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  emailText: {
    marginBottom: 8,
    color: '#8f8f8f',
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
