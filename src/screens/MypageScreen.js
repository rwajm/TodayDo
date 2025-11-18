  import React, { useState } from 'react';
  import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
  import { View, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';

  export default function SignIn({ navigation }) {

    const handleLogout = () => {
      Alert.alert(
        '로그아웃',
        '로그아웃 하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { text: '로그아웃', style: 'destructive', onPress: () => {
              // 로그아웃 로직 실행 (예: 토큰 삭제 등)
              // 이후 원하는 화면으로 이동
              navigation.navigate('InitialScreen'); // 예: 초기화면으로 이동
            }
          },
        ],
        { cancelable: true }
      );
    };
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1,justifyContent: 'flex-end', backgroundColor: '#fff' }}>
          <View style={styles.profile}>

          </View>
          <View style={styles.container}>
            <TouchableOpacity 
              onPress={() => {
                navigation.navigate('Social',);
              }}
            >
              <NoScaleText style={styles.social}>친구</NoScaleText>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                navigation.navigate('ForgotPWEmail',);
              }}
            >
              <NoScaleText style={styles.data}>통계</NoScaleText>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                navigation.navigate('ForgotPWEmail',);
              }}
            >
              <NoScaleText style={styles.reward}>리워드</NoScaleText>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                navigation.navigate('AccountManagement');
              }}
            >
              <NoScaleText style={styles.AccountManagement}>계정관리</NoScaleText>
            </TouchableOpacity>
            <View style={{marginTop: 165}}>
              <TouchableOpacity 
                onPress={handleLogout}
              >
                <NoScaleText style={styles.logout}>로그아웃</NoScaleText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  export const styles = StyleSheet.create({
    container: {
      height: 500,
      width: '90%',
      alignSelf: 'center',
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
    social: {
      fontSize: 17,
      fontWeight: 600,
      marginLeft: 20,
      marginBottom: 20,
    },
    data: {
      fontSize: 17,
      fontWeight: 600,
      marginLeft: 20,
      marginTop: 20,
      marginBottom: 20,
    },
    reward: {
      fontSize: 17,
      fontWeight: 600,
      marginLeft: 20,
      marginTop: 20,
      marginBottom: 20,
    },
    AccountManagement: {
      fontSize: 17,
      fontWeight: 600,
      marginLeft: 20,
      marginTop: 20,
      marginBottom: 20,
    },
    logout: {
      fontSize: 17,
      fontWeight: 600,
      color: '#E50000',
      marginLeft: 20,
      marginTop: 20,
      marginBottom: 20,
    },
  });