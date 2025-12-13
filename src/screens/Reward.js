import React, { useRef, useState, useCallback } from 'react';
import { View, TouchableOpacity, SectionList, StyleSheet } from 'react-native';
import { NoScaleText } from '../components/NoScaleText';

export default function Reward({ navigation }) {
  const sectionListRef = useRef(null);

  const [TodoReward] = useState([
    { id: 'todo-1', email: 'Todo@test.com' },
    { id: 'todo-2', email: 'bbb@test.com' },
    { id: 'todo-3', email: 'ccc@test.com' },
    { id: 'todo-4', email: 'ddd@test.com' },
    { id: 'todo-5', email: 'eee@test.com' },
    { id: 'todo-6', email: 'fff@test.com' },
    { id: 'todo-7', email: 'ggg@test.com' },
    { id: 'todo-8', email: 'hhh@test.com' },
    { id: 'todo-9', email: 'iii@test.com' },
  ]);

  const [RoutineReward] = useState([
    { id: 'routine-1', email: 'Routine@test.com' },
    { id: 'routine-2', email: 'bbb@test.com' },
    { id: 'routine-3', email: 'ccc@test.com' },
    { id: 'routine-4', email: 'ddd@test.com' },
    { id: 'routine-5', email: 'eee@test.com' },
    { id: 'routine-6', email: 'fff@test.com' },
    { id: 'routine-7', email: 'ggg@test.com' },
    { id: 'routine-8', email: 'hhh@test.com' },
    { id: 'routine-9', email: 'iii@test.com' },
  ]);

  const [RecordReward] = useState([
    { id: 'record-1', email: 'Record@test.com' },
    { id: 'record-2', email: 'bbb@test.com' },
    { id: 'record-3', email: 'ccc@test.com' },
    { id: 'record-4', email: 'ddd@test.com' },
    { id: 'record-5', email: 'eee@test.com' },
    { id: 'record-6', email: 'fff@test.com' },
    { id: 'record-7', email: 'ggg@test.com' },
    { id: 'record-8', email: 'hhh@test.com' },
    { id: 'record-9', email: 'iii@test.com' },
  ]);

  const [etcReward] = useState([
    { id: 'etc-1', email: 'etc@test.com' },
    { id: 'etc-2', email: 'bbb@test.com' },
    { id: 'etc-3', email: 'ccc@test.com' },
    { id: 'etc-4', email: 'ddd@test.com' },
    { id: 'etc-5', email: 'eee@test.com' },
    { id: 'etc-6', email: 'fff@test.com' },
    { id: 'etc-7', email: 'ggg@test.com' },
    { id: 'etc-8', email: 'hhh@test.com' },
    { id: 'etc-9', email: 'iii@test.com' },
  ]);

  const sections = [
    { title: 'Todo', data: TodoReward },
    { title: 'Routine', data: RoutineReward },
    { title: 'Record', data: RecordReward },
    { title: 'etc.', data: etcReward },
  ];

  const [activeTab, setActiveTab] = useState('Todo');

  // 사용자가 스크롤해서 보이는 섹션을 추적해서 탭 업데이트
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    // index가 null인 것은 섹션 헤더임
    const visibleSectionHeaders = viewableItems.filter(
      item => item.section && item.index === null
    );

    if (visibleSectionHeaders.length > 0) {
      const topSectionTitle = visibleSectionHeaders[0].section.title;
      if (activeTab !== topSectionTitle) {
        setActiveTab(topSectionTitle);
      }
    }
  }, [activeTab]);

  // 섹션 헤더가 적어도 50% 보일 때 뷰어블로 간주
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      {/* 탭 버튼 영역 */}
      <View style={styles.tabsContainer}>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={section.title}
            style={[styles.tabButton, activeTab === section.title && styles.activeTab]}
            onPress={() => {
              setActiveTab(section.title);
              sectionListRef.current?.scrollToLocation({
                sectionIndex: index,
                itemIndex: 0,
                animated: true,
                viewPosition: 0,
              });
            }}
          >
            <NoScaleText style={[styles.tabText, activeTab === section.title && styles.activeTabText]}>
              {section.title}
            </NoScaleText>
          </TouchableOpacity>
        ))}
      </View>

      {/* SectionList */}
      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.achievements}>
            <NoScaleText>{item.email}</NoScaleText>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <NoScaleText style={styles.sectionHeaderText}>{title}</NoScaleText>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 35, paddingBottom: 30 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  achievements: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
