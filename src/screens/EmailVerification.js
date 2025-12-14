import React, { useState } from 'react';
import { NoScaleText, } from '../components/NoScaleText';
import { View, TouchableOpacity, StyleSheet, } from 'react-native';

export default function EmailVerification({ navigation, route}) {
  const email = route?.params?.email || '';

  const totalSteps = 3; // 회원가입 총 단계
  const currentStep = 2; // 현재 단계
  const progressWidth = `${(currentStep / totalSteps) * 100}%`; // 진행바 길이

  const resendLink = () => {
    // TODO: 재전송 API
    console.log('이메일 재전송:', email);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        <NoScaleText style={styles.emailText}>{email}로</NoScaleText>
        <NoScaleText style={styles.noticeText}>인증링크를 전송했습니다.</NoScaleText>
        <NoScaleText style={styles.noticeText}>링크를 눌러 인증을 완료해주세요.</NoScaleText>
            
        <TouchableOpacity onPress={resendLink}>
          <NoScaleText style={styles.resend}>재전송</NoScaleText>
        </TouchableOpacity>

        <TouchableOpacity
              style={[styles.button]}
              onPress={() => {
                navigation.navigate('SignUpName');
              }}
            >
              <NoScaleText style={styles.buttonText}>계속</NoScaleText>
            </TouchableOpacity>
      </View>
    </View>
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
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3A9CFF',
    borderRadius: 2,
  },
  emailText: {
    fontSize: 18,
    marginTop: 200,
    marginBottom: 8,
    color: '#8f8f8f',
  },
  noticeText: {
    fontSize: 18,
    marginBottom: 12,
    color: '#8f8f8f',
  },
  resend: {
    fontSize: 16,
    textAlign: 'right',
    color: '#4a90e2',
    marginTop: 18,
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
