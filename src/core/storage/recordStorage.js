import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'records';

class RecordStorage {
  /**
   * 모든 Record 가져오기
   */
  async getAll() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting records:', error);
      return [];
    }
  }

  /**
   * 날짜로 Record 찾기
   */
  async getByDate(date) {
    try {
      const records = await this.getAll();
      return records.find(record => record.date === date) || null;
    } catch (error) {
      console.error('Error getting record by date:', error);
      return null;
    }
  }

  /**
   * 월별 Record 가져오기
   */
  async getByMonth(year, month) {
    try {
      const records = await this.getAll();
      return records.filter(record => {
        if (!record.date) return false;
        const [y, m] = record.date.split('.');
        return y === year && m === month.padStart(2, '0');
      });
    } catch (error) {
      console.error('Error getting records by month:', error);
      return [];
    }
  }

  /**
   * Record 추가 또는 업데이트
   */
  async save(recordData) {
    try {
      const records = await this.getAll();
      const existingIndex = records.findIndex(r => r.date === recordData.date);
      
      const now = new Date().toISOString();
      
      if (existingIndex !== -1) {
        // 기존 Record 업데이트
        records[existingIndex] = {
          ...records[existingIndex],
          ...recordData,
          updatedAt: now
        };
      } else {
        // 새 Record 추가
        const newRecord = {
          id: `rec_${Date.now()}`,
          date: recordData.date,
          content: recordData.content || null,
          mood: recordData.mood || null,
          createdAt: now,
          updatedAt: now
        };
        records.push(newRecord);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      
      return records[existingIndex !== -1 ? existingIndex : records.length - 1];
    } catch (error) {
      console.error('Error saving record:', error);
      throw error;
    }
  }

  /**
   * Record 삭제
   */
  async delete(date) {
    try {
      const records = await this.getAll();
      const filtered = records.filter(record => record.date !== date);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }

  /**
   * 모든 Record 삭제
   */
  async clear() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing records:', error);
      throw error;
    }
  }
}

export default new RecordStorage();