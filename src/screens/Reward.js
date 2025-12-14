import React, { useRef, useState, useCallback } from 'react';
import { View, TouchableOpacity, SectionList, StyleSheet } from 'react-native';
import { NoScaleText } from '../components/NoScaleText';
import RewardItem from '../components/RewardItem';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../components/CustomToast';


export default function Reward({ navigation }) {
  const sectionListRef = useRef(null);

  const userStats = {
    todoCompleted: 1,
    routineStreak: 1,
    recordStreak: 3,
    etcStreak: 1,
  };
  
  const [TodoReward, setTodoReward] = useState([
    { id: 'todo-1', 
      title: '🐣 처음 날개 단 병아리',
      description: '첫 Todo 완료!',
      claimed: false,
      isAchieved: (stats) => stats.todoCompleted >= 1,
    },
    { id: 'todo-2', 
      title: '🐿️ 할일 수집 다람쥐',
      description: '하루 5개 완료!',
      claimed: false,
      isAchieved: (stats) => stats.todoCompleted >= 2,
    },
    { id: 'todo-3', 
      title: '🐰 부지런 토끼',
      description: '하루 10개 완료!',
      claimed: false,
      isAchieved: (stats) => stats.todoCompleted >= 1,
    },
    { id: 'todo-4', 
      title: '🐝 열일 벌',
      description: '일주일 연속 100% 완료!',
      claimed: false,
      isAchieved: (stats) => stats.todoCompleted >= 1,
    },
    { id: 'todo-5', 
      title: '🦊 센스 여우',
      description: '마감 1시간 전 완료!',
      claimed: false,
      isAchieved: (stats) => stats.todoCompleted >= 1,
    },
    { id: 'todo-6', 
      title: '🐓 아침형 닭',
      description: 'Todo를 오전에 전부 완료!',
      claimed: false,
      isAchieved: (stats) => stats.todoCompleted >= 1,
    },
    { id: 'todo-7', 
      title: '🦉 야근 부엉이',
      description: 'Todo를 밤 10시 이후 완료!',
      claimed: false,
      isAchieved: (stats) => stats.todoCompleted >= 1,
    },
    { id: 'todo-8', 
      title: '🐘 미리미리 코끼리',
      description: '일정 3일 전 미리 완료!',
      claimed: false,
      isAchieved: (stats) => stats.todoCompleted >= 1,
    },
    { id: 'todo-9', 
      title: '🐨 휴일도 일하는 코알라',
      description: '주말에도 Todo 달성!',
      claimed: false,
      isAchieved: (stats) => stats.todoCompleted >= 1,
    },
  ]);

  const [RoutineReward, setRoutineReward] = useState([
    { id: 'routine-1',
      title: '🌱 자라나는 루틴 새싹',
      description: '첫 루틴 완료!',
      claimed: false,
      isAchieved: (stats) => stats.routineStreak >= 1,
    },
    { id: 'routine-2',
      title: '🦔 꾸준 고슴도치',
      description: '7일 연속 루틴 성공!',
      claimed: false,
      isAchieved: (stats) => stats.routineStreak >= 7,
    },
    { id: 'routine-3', 
      title: '🕊️ 둥지 짓는 새',
      description: '30일 연속 루틴 성공!',
      claimed: false,
      isAchieved: (stats) => stats.routineStreak >= 30,
    },
    { id: 'routine-4', 
      title: '🦦 완벽주의 수달',
      description: '100일 연속 루틴 성공!',
      claimed: false,
      isAchieved: (stats) => stats.routineStreak >= 100,
    },
  ]);

  const [RecordReward, setRecordReward] = useState([
    { id: 'record-1', 
      title: '🦊 생각 먹는 여우',
      description: '첫 일기 작성!',
      claimed: false,
      isAchieved: (stats) => stats.recordStreak >= 1,
    },
    { id: 'record-2', 
      title: '🐱 감정 기록 고양이',
      description: '7일 연속 일기 작성!',
      claimed: false,
      isAchieved: (stats) => stats.recordStreak >= 7,
    },
    { id: 'record-3', 
      title: '🐢 자기성찰 거북이',
      description: '30일 연속 일기 작성!',
      claimed: false,
      isAchieved: (stats) => stats.recordStreak >= 30,
    },
    { id: 'record-4', 
      title: '🐋 기억의 고래',
      description: '100개 일기 작성!',
      claimed: false,
      isAchieved: (stats) => stats.recordStreak >= 100,
    },
  ]);

  const [etcReward, setetcReward] = useState([
    { id: 'etc-1', 
      title: '🦢 완벽 백조',
      description: '하루에 Todo, 루틴, 일기 모두 완료',
      claimed: false,
      isAchieved: (stats) => stats.etcStreak >= 1,
    },
    { id: 'etc-2', 
      title: '🦆 함께하는 오리',
      description: '친구와 Todo 공유',
      claimed: false,
      isAchieved: (stats) => stats.etcStreak >= 1,
    },
    { id: 'etc-3', 
      title: '🐶 인싸 강아지',
      description: '친구 10명 이상 추가',
      claimed: false,
      isAchieved: (stats) => stats.etcStreak >= 1,
    },
    { id: 'etc-4', 
      title: '🐪 꾸준한 낙타',
      description: '앱 가입 1주년',
      claimed: false,
      isAchieved: (stats) => stats.etcStreak >= 1,
    },
    { id: 'etc-5', 
      title: '🐉 성실함의 전설 드래곤',
      description: '한 해 전체 달성률 100%',
      claimed: false,
      isAchieved: (stats) => stats.etcStreak >= 1,
    },
  ]);

  const sections = [
    {
      title: 'Todo',
      data: TodoReward.map(item => ({
        ...item,
        conditionMet: item.isAchieved(userStats),
      })),
    },
    {
      title: 'Routine',
      data: RoutineReward.map(item => ({
        ...item,
        conditionMet: item.isAchieved(userStats),
      })),
    },
    {
      title: 'Record',
      data: RoutineReward.map(item => ({
        ...item,
        conditionMet: item.isAchieved(userStats),
      })),
    },
    {
      title: 'etc.',
      data: etcReward.map(item => ({
        ...item,
        conditionMet: item.isAchieved(userStats),
      })),
    },
  ];

  const handleClaim = (sectionTitle, item) => {
  if (!item.conditionMet || item.claimed) return;

  const setterMap = {
    Todo: setTodoReward,
    Routine: setRoutineReward,
    Record: setRecordReward,
    'etc.': setetcReward,
  };

  setterMap[sectionTitle](prev =>
    prev.map(i =>
      i.id === item.id ? { ...i, claimed: true } : i
    )
  );

  Toast.show({
    type: 'reward',
    text1: '칭호 획득!',
    text2: item.title,
    position: 'bottom',
    visibilityTime: 2000,
  });
};

  const [activeTab, setActiveTab] = useState('Todo');

  // 사용자가 스크롤해서 보이는 섹션을 추적해서 탭 업데이트
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    // index가 null인 것은 섹션 헤더임
    const visibleSectionHeaders = viewableItems.filter(
      item => item.section && item.index === null
    )

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
        renderItem={({ item, section }) => (
          <RewardItem
            item={item}
            onPress={() => handleClaim(section.title, item)}
          />
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
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
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
