import React, { useState } from 'react';
import { View, StyleSheet, Image,   TouchableOpacity, TextInput, Switch, Keyboard, TouchableWithoutFeedback, } from 'react-native';
import { NoScaleText } from '../components/NoScaleText';

export default function ProfileEditScreen() {
  const defaultProfileImage = require('../../assets/defaultprofileimage.png');

  /* ---------- 상태 ---------- */
  const [nickname, setNickname] = useState('닉네임');
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  const [title, setTitle] = useState('칭호');

  const [privacy, setPrivacy] = useState({
    todo: true,
    routine: true,
    record: true,
    level: true,
    title: true,
    profile: true,
  });

  /* ---------- 함수 ---------- */
  const openGallery = () => {
    // TODO: expo-image-picker 연결 예정
    console.log('갤러리 열기');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>

        {/* ================= 프로필 이미지 ================= */}
        <View style={styles.profileImageWrapper}>
          <Image source={defaultProfileImage} style={styles.profileImage} />

          <TouchableOpacity style={styles.plusButton} onPress={openGallery}>
            <NoScaleText style={styles.plusText}>+</NoScaleText>
          </TouchableOpacity>
        </View>

        {/* ================= 닉네임 ================= */}
        <TouchableOpacity onPress={() => setIsEditingNickname(true)}>
          {isEditingNickname ? (
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              onBlur={() => setIsEditingNickname(false)}
              autoFocus
              style={styles.nicknameInput}
            />
          ) : (
            <NoScaleText style={styles.nicknameText}>{nickname}</NoScaleText>
          )}
        </TouchableOpacity>

        {/* ================= 칭호 드롭다운 ================= */}
        <TouchableOpacity style={styles.dropdown}>
          <NoScaleText style={styles.dropdownText}>{title}</NoScaleText>
        </TouchableOpacity>

        {/* ================= 데이터 공개 설정 ================= */}
        <View style={styles.privacyCard}>
          <NoScaleText style={styles.privacyTitle}>데이터 공개 설정</NoScaleText>

          {[
            ['todo', 'Todo 누적 완료 횟수'],
            ['routine', 'Routine 누적 완료 횟수'],
            ['record', 'Record 누적 완료 횟수'],
            ['level', '레벨'],
            ['title', '칭호'],
            ['profile', '프로필 사진'],
          ].map(([key, label]) => (
            <View key={key} style={styles.privacyRow}>
              <NoScaleText>{label}</NoScaleText>
              <Switch
                value={privacy[key]}
                onValueChange={(value) =>
                  setPrivacy({ ...privacy, [key]: value })
                }
              />
            </View>
          ))}
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}

/* ================= 스타일 ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },

  /* 프로필 이미지 */
  profileImageWrapper: {
    marginBottom: 20,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },

  plusButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3A9CFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  plusText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* 닉네임 */
  nicknameText: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    width: 200,
    textAlign: 'center',
    marginBottom: 14,
  },

  nicknameInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#3A9CFF',
    paddingVertical: 6,
    width: 200,
    textAlign: 'center',
    marginBottom: 14,
  },

  /* 칭호 드롭다운 */
  dropdown: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f3f3f3',
    width: 200,
    alignItems: 'center',
    marginBottom: 30,
  },

  dropdownText: {
    fontSize: 14,
    color: '#666',
  },

  /* 데이터 공개 설정 */
  privacyCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  privacyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  privacyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
