  import React, { useState } from 'react';
  import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
  import { View, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert,  Image, ImageBackground } from 'react-native';

  export default function SignIn({ navigation }) {

    const defaultProfileImage = require('../../assets/defaultprofileimage.png');
    const editIcon = require('../../assets/edit.png');
    const levelbg = require('../../assets/levelbg.png');

    const level = 5;
    const currentExp = 60;
    const maxExp = 100;
    const expPercent = `${(currentExp / maxExp) * 100}%`;

    const handleLogout = () => {
      Alert.alert(
        '로그아웃',
        '로그아웃 하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { text: '로그아웃', style: 'destructive', onPress: () => {
              // 로그아웃 로직 실행 (예: 토큰 삭제 등)
              navigation.navigate('InitialScreen');
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
            {/* 프로필 이미지 */}
            <Image source={defaultProfileImage} style={styles.profileImage} />

            {/* 오른쪽 정보 영역 */}
            <View style={styles.profileRight}>
              {/* 칭호 */}
              <NoScaleText style={styles.title}>🐣 처음 날개 단 병아리</NoScaleText>
              {/* 닉네임 + 레벨 + 연필 */}
              <View style={styles.profileInfoRow}>
                <ImageBackground source={levelbg} style={styles.levelBadge}>
                  <NoScaleText style={styles.levelText}>{level}</NoScaleText>
                </ImageBackground>

                <NoScaleText style={styles.nickname}>User</NoScaleText>

                <TouchableOpacity
                  onPress={() => navigation.navigate('AccountManagement')}
                >
                  <Image source={editIcon} style={styles.editIcon} />
                </TouchableOpacity>
              </View>

              

              {/* EXP 바 */}
              <View style={styles.expBar}>
                <View style={[styles.expFill, { width: expPercent }]} />
              </View>

              <NoScaleText style={styles.expText}>
                {currentExp}/{maxExp} EXP
              </NoScaleText>
            </View>
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
                navigation.navigate('Statistics',);
              }}
            >
              <NoScaleText style={styles.data}>통계</NoScaleText>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                navigation.navigate('Reward',);
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
    profile: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 45,
      marginBottom: 40,
    },
    profileImage: {
      width: 110,
      height: 110,
      borderRadius: 60,
      backgroundColor: '#eee',
      marginRight: 15,
    },
    profileRight: {
      flex: 1,
    },
    profileInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    title: {
      fontSize: 14,
      color: '#3A9CFF',
      marginBottom: 6,
      marginTop: 10,
    },
    levelBadge: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 5,
    },
    levelText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#3A9CFF',
    },
    nickname: {
      fontSize: 20,
      fontWeight: 'bold',
      marginRight: 6,
    },
    editIcon: {
      width: 18,
      height: 18,
      tintColor: '#3A9CFF',
      marginLeft: 20,
    },
    expBar: {
      width: 180,
      height: 4,
      backgroundColor: '#e0e0e0',
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 4,
      marginTop: 6,
    },
    expFill: {
      height: '100%',
      backgroundColor: '#3A9CFF',
      borderRadius: 8,
    },
    expText: {
      fontSize: 11,
      color: '#999',
      marginLeft: 115,
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