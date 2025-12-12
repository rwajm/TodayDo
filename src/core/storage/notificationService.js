import * as Notifications from 'expo-notifications';

class NotificationService {
  // 초기 설정
  async initialize() {
    await Notifications.requestPermissionsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
      }),
    });
  }

  // 알림 스케줄링
  async scheduleTodoReminder(todo) {
    if (!todo.remind || !todo.time) return;

    const [year, month, day] = todo.date.split('.');
    const [hour, minute] = todo.time.split(':');
    
    // 알림 시간 계산 (마감 시간 - remind 분)
    const dueTime = new Date(year, month - 1, day, hour, minute);
    const remindTime = new Date(dueTime.getTime() - (todo.remind * 60000));

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Todo 알림',
        body: `'${todo.title}'의 마감시간이 ${todo.remind}분 남았어요!`,
        data: { type: 'todo', id: todo.id }
      },
      trigger: remindTime
    });
  }

  // 알림 취소
  async cancelReminder(notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}

export default new NotificationService();