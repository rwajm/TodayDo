import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NoScaleText } from '../components/NoScaleText'; 

const INITIAL_DATA = [
  {
    id: '1',
    type: 'todo',
    category: 'Todo',
    message: "'할 일 1'의 마감시간이 5분 남았어요.\n서둘러 완료하세요!",
    time: '5분 전',
    isRead: false,
  },
  {
    id: '2',
    type: 'routine',
    category: 'Routine',
    message: "'루틴 1'의 마감시간이 5분 남았어요.\n서둘러 완료하세요!",
    time: '1시간 전',
    isRead: false,
  },
  {
    id: '3',
    type: 'record',
    category: 'Record',
    message: "아직 오늘의 한줄 기록을 남기지 않았어요.\n서둘러 완료하세요!",
    time: '8시간 전',
    isRead: true,
  },
];

export default function NotificationScreen({navigation}) {
  const [notifications, setNotifications] = useState(INITIAL_DATA);
  const [rewardCount, setRewardCount] = useState(2);

  const getIconByType = (type) => {
    switch (type) {
      case 'todo':
        return <MaterialIcons name="library-add-check" size={24} color={"#3A9CFF"}/>;
      case 'routine':
        return <MaterialCommunityIcons name="history" size={24} color="#3A9CFF" />;
      case 'record':
        return <MaterialCommunityIcons name="playlist-edit" size={24} color={"#3A9CFF"}/>;
      default:
        return <Ionicons name="notifications-outline" size={24} color="#3A9CFF" />;
    }
  };

  const handlePressNotification = (type) => {
    const screenName = type.charAt(0).toUpperCase() + type.slice(1);

    navigation.navigate('Main', { screen: screenName });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem} onPress={() => handlePressNotification(item.type)}>
      <View style={styles.iconContainer}>
        {getIconByType(item.type)}
      </View>

      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <NoScaleText style={styles.categoryText}>{item.category}</NoScaleText>
          <NoScaleText style={styles.timeText}>{item.time}</NoScaleText>
        </View>
        <NoScaleText style={styles.messageText}>{item.message}</NoScaleText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.rewardBanner} onPress={() => navigation.navigate('Reward')} >
        <Ionicons name="gift-outline" size={20} color="#3A9CFF" style={{ marginRight: 8 }} />
        <NoScaleText style={styles.rewardText}>
          받을 수 있는 리워드가 <NoScaleText style={styles.rewardCount}>{rewardCount}개</NoScaleText> 있습니다!
        </NoScaleText>
      </TouchableOpacity>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <NoScaleText style={styles.emptyText}>새로운 알림이 없습니다.</NoScaleText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  rewardText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  rewardCount: {
    color: '#3A9CFF',
    fontWeight: 'bold',
  },
  listContent: {
    flexGrow: 1, 
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginRight: 14,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});