import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Social({ navigation }) {
  const [activeTab, setActiveTab] = useState('friendsList');

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'friendsList' && styles.activeTab]}
          onPress={() => setActiveTab('friendsList')}
        >
          <Text style={[styles.tabText, activeTab === 'friendsList' && styles.activeTabText]}>
            친구 목록
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'friendRequest' && styles.activeTab]}
          onPress={() => setActiveTab('friendRequest')}
        >
          <Text style={[styles.tabText, activeTab === 'friendRequest' && styles.activeTabText]}>
            친구 신청
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'receivedRequest' && styles.activeTab]}
          onPress={() => setActiveTab('receivedRequest')}
        >
          <Text style={[styles.tabText, activeTab === 'receivedRequest' && styles.activeTabText]}>
            받은 신청
          </Text>
        </TouchableOpacity>
      </View>

      {/* 내용 영역 */}
      <View style={styles.content}>
        {activeTab === 'friendsList' && (
          <Text style={styles.emptyText}>아직 친구가 없습니다.{'\n'}친구를 추가해보세요!</Text>
        )}
        {activeTab === 'friendRequest' && (
          <Text style={styles.emptyText}>보낸 친구 신청이 없습니다.</Text>
        )}
        {activeTab === 'receivedRequest' && (
          <Text style={styles.emptyText}>받은 친구 신청이 없습니다.</Text>
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
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 