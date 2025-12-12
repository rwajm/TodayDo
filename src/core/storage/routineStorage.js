import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'routines';

class RoutineStorage {
  /**
   * 모든 Routine 가져오기
   */
  async getAll() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting routines:', error);
      return [];
    }
  }

  /**
   * ID로 Routine 찾기
   */
  async getById(id) {
    try {
      const routines = await this.getAll();
      return routines.find(routine => routine.id === id) || null;
    } catch (error) {
      console.error('Error getting routine by id:', error);
      return null;
    }
  }

  /**
   * 월별 Routine 가져오기
   */
  async getByMonth(year, month) {
    try {
      const routines = await this.getAll();
      return routines.filter(routine => {
        if (!routine.date) return false;
        const [y, m] = routine.date.split('.');
        return y === year && m === month.padStart(2, '0');
      });
    } catch (error) {
      console.error('Error getting routines by month:', error);
      return [];
    }
  }

  /**
   * Routine 추가
   */
  async add(routineData) {
    try {
      const routines = await this.getAll();
      const newRoutine = {
        id: `r_${Date.now()}`,
        title: routineData.title,
        date: routineData.date,
        time: routineData.time || null,
        completed: false,
        important: false,
        remind: routineData.remind || null,
        repeated: routineData.repeated || null,
        tag: routineData.tag || null,
        subs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      routines.push(newRoutine);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
      
      return newRoutine;
    } catch (error) {
      console.error('Error adding routine:', error);
      throw error;
    }
  }

  /**
   * Routine 업데이트
   */
  async update(id, updates) {
    try {
      const routines = await this.getAll();
      const index = routines.findIndex(routine => routine.id === id);
      
      if (index === -1) {
        throw new Error('Routine not found');
      }
      
      routines[index] = {
        ...routines[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
      
      return routines[index];
    } catch (error) {
      console.error('Error updating routine:', error);
      throw error;
    }
  }

  /**
   * Sub 추가
   */
  async addSub(routineId, subData) {
    try {
      const routines = await this.getAll();
      const index = routines.findIndex(routine => routine.id === routineId);
      
      if (index === -1) {
        throw new Error('Routine not found');
      }
      
      const newSub = {
        id: `s_${Date.now()}`,
        title: subData.title,
        completed: false,
      };
      
      if (!routines[index].subs) {
        routines[index].subs = [];
      }
      
      routines[index].subs.push(newSub);
      routines[index].updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
      
      return newSub;
    } catch (error) {
      console.error('Error adding sub:', error);
      throw error;
    }
  }
  
  /**
   * Sub 업데이트
   */
  async updateSub(routineId, subId, updates) {
    try {
      const routines = await this.getAll();
      const routineIndex = routines.findIndex(routine => routine.id === routineId);
      
      if (routineIndex === -1) {
        throw new Error('Routine not found');
      }
      
      const routine = routines[routineIndex];
      const subIndex = routine.subs?.findIndex(sub => sub.id === subId);
      
      if (subIndex === -1 || subIndex === undefined) {
        throw new Error('Sub not found');
      }
      
      routine.subs[subIndex] = {
        ...routine.subs[subIndex],
        ...updates
      };
      routine.updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
      
      return routine;
    } catch (error) {
      console.error('Error updating sub:', error);
      throw error;
    }
  }

  /**
   * Sub 삭제
   */
  async deleteSub(routineId, subId) {
    try {
      const routines = await this.getAll();
      const index = routines.findIndex(routine => routine.id === routineId);
      
      if (index === -1) {
        throw new Error('Routine not found');
      }
      
      routines[index].subs = routines[index].subs?.filter(
        sub => sub.id !== subId
      ) || [];
      
      routines[index].updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
      
      return true;
    } catch (error) {
      console.error('Error deleting sub:', error);
      throw error;
    }
  }

  /**
   * Routine 삭제
   */
  async delete(id) {
    try {
      const routines = await this.getAll();
      const filtered = routines.filter(routine => routine.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting routine:', error);
      throw error;
    }
  }

  /**
   * 여러 Routine 삭제
   */
  async deleteMany(ids) {
    try {
      const routines = await this.getAll();
      const filtered = routines.filter(routine => !ids.includes(routine.id));
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting routines:', error);
      throw error;
    }
  }

  /**
   * 모든 Routine 삭제
   */
  async clear() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing routines:', error);
      throw error;
    }
  }
}

export default new RoutineStorage();