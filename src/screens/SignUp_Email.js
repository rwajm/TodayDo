import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';

export default function SignUpEmail({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const isButtonValid = password.length > 0 && password === passwordConfirm && email.length > 0;

  const totalSteps = 3; // 회원가입 총 단계
  const currentStep = 1; // 현재 단계
  const progressWidth = `${(currentStep / totalSteps) * 100}%`; // 진행바 길이

  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 0 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: progressWidth }]} />
            </View>

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
              />
            </View>

            <View style={styles.inputContainer}>
              <NoScaleText style={styles.label1}>비밀번호 입력</NoScaleText>
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
              style={[styles.button, !isButtonValid && styles.buttonDisabled]}
              disabled={!isButtonValid}
              onPress={() => {
                navigation.navigate('EmailVerification', { email });
              }}
            >
              <NoScaleText style={styles.buttonText}>계속</NoScaleText>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    marginTop: 30,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
    marginBottom: 500,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
