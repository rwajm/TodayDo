import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { Ionicons } from '@expo/vector-icons';

export default function Social({ navigation }) {
  const [activeTab, setActiveTab] = useState('friendsList');
  const [email, setEmail] = useState('');

  //데이터 리스트
  const [currentfriends, setcurrentfriends] = useState([
    { id: '1', email: 'aaa@test.com' },
    { id: '2', email: 'bbb@test.com' },
    { id: '3', email: 'ccc@test.com' },
    { id: '4', email: 'ddd@test.com' },
    { id: '5', email: 'eee@test.com' },
    { id: '6', email: 'fff@test.com' },
    { id: '7', email: 'ggg@test.com' },
    { id: '8', email: 'hhh@test.com' },
    { id: '9', email: 'iii@test.com' },
  ]);

  const [sentRequests, setSentRequests] = useState([
    { id: '1', email: 'aaa@test.com' },
    { id: '2', email: 'bbb@test.com' },
    { id: '3', email: 'ccc@test.com' },
    { id: '4', email: 'ddd@test.com' },
    { id: '5', email: 'eee@test.com' },
    { id: '6', email: 'fff@test.com' },
    { id: '7', email: 'ggg@test.com' },
    { id: '8', email: 'hhh@test.com' },
    { id: '9', email: 'iii@test.com' },
  ]);
  
  const [recievefriends, setrecievefriends] = useState([
    { id: '1', email: 'aaa@test.com' },
    { id: '2', email: 'bbb@test.com' },
    { id: '3', email: 'ccc@test.com' },
    { id: '4', email: 'ddd@test.com' },
    { id: '5', email: 'eee@test.com' },
    { id: '6', email: 'fff@test.com' },
    { id: '7', email: 'ggg@test.com' },
    { id: '8', email: 'hhh@test.com' },
    { id: '9', email: 'iii@test.com' },
  ]);


  return (
    
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'friendsList' && styles.activeTab]}
            onPress={() => setActiveTab('friendsList')}
          >
            <NoScaleText style={[styles.tabText, activeTab === 'friendsList' && styles.activeTabText]}>
              친구 목록
            </NoScaleText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'friendRequest' && styles.activeTab]}
            onPress={() => setActiveTab('friendRequest')}
          >
            <NoScaleText style={[styles.tabText, activeTab === 'friendRequest' && styles.activeTabText]}>
              친구 신청
            </NoScaleText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'receivedRequest' && styles.activeTab]}
            onPress={() => setActiveTab('receivedRequest')}
          >
            <NoScaleText style={[styles.tabText, activeTab === 'receivedRequest' && styles.activeTabText]}>
              받은 신청
            </NoScaleText>
          </TouchableOpacity>
        </View>

        {/* 내용 영역 */}
        <View style={styles.content}>
          {activeTab === 'friendsList' && (
            <View style={styles.listContainer}>
              <FlatList
                  data={currentfriends}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.requestItem}>
                      <NoScaleText>{item.email}</NoScaleText>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                      <NoScaleText style={styles.emptyText}>아직 친구가 없습니다.{'\n'}친구를 추가해보세요!</NoScaleText>
                    </View>
                  }
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: sentRequests.length === 0 ? 'center' : 'flex-start',
                  }}
                />
            </View>
          )}

          {activeTab === 'friendRequest' && (
            <View style={{ flex: 1 }}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View>
                  <View style={styles.inputContainer}>
                    <NoScaleText style={styles.label}>친구 신청</NoScaleText>
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
                  <TouchableOpacity
                    style={[styles.button, !email && styles.buttonDisabled]}
                    disabled={!email}
                    onPress={() => {
                      navigation.navigate('SignUpEmailCode', { email });
                    }}
                  >
                    <NoScaleText style={styles.buttonText}>신청</NoScaleText>
                  </TouchableOpacity>

                  {/*<View style={styles.listContainer}>
                    <NoScaleText style={styles.sublabel}>보낸 신청 목록</NoScaleText>
                  </View>*/}
                </View>
              </TouchableWithoutFeedback>

              <View style={styles.listContainer}>
                <NoScaleText style={styles.sublabel}>보낸 신청 목록</NoScaleText>
                <FlatList
                  data={sentRequests}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.requestItem}>
                      <NoScaleText>{item.email}</NoScaleText>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                      <NoScaleText style={styles.emptyText}>친구 신청 내역이 없습니다.</NoScaleText>
                    </View>
                  }
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: sentRequests.length === 0 ? 'center' : 'flex-start',
                  }}
                />
              </View>
            </View>
          )}
          {activeTab === 'receivedRequest' && (
            <View style={styles.listContainer}>
              <FlatList
                  data={recievefriends}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.requestItem}>
                      <NoScaleText>{item.email}</NoScaleText>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                      <NoScaleText style={styles.emptyText}>친구 신청 내역이 없습니다.</NoScaleText>
                    </View>
                  }
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: sentRequests.length === 0 ? 'center' : 'flex-start',
                  }}
                />
            </View>
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#3A9CFF',
  },
  tabText: {
    color: '#999',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    marginTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },

  //친구 신청 탭
  inputContainer: {
    marginBottom: 30,
    paddingHorizontal: 35,
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
  button: {
    backgroundColor: '#3A9CFF',
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
    width: 320,
    alignSelf: 'center',
    marginBottom: 50,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sublabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: 35,
  },
  requestList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  requestItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 