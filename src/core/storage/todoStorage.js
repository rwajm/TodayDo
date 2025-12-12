import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'todos';

class TodoStorage {
  /**
   * 모든 Todo 가져오기
   */
  async getAll() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting todos:', error);
      return [];
    }
  }

  /**
   * ID로 Todo 찾기
   */
  async getById(id) {
    try {
      const todos = await this.getAll();
      return todos.find(todo => todo.id === id) || null;
    } catch (error) {
      console.error('Error getting todo by id:', error);
      return null;
    }
  }

  /**
   * 월별 Todo 가져오기
   */
  async getByMonth(year, month) {
    try {
      const todos = await this.getAll();
      return todos.filter(todo => {
        if (!todo.date) return false;
        const [y, m] = todo.date.split('.');
        return y === year && m === month.padStart(2, '0');
      });
    } catch (error) {
      console.error('Error getting todos by month:', error);
      return [];
    }
  }

  /**
   * Todo 추가
   */
  async add(todoData) {
    try {
      const todos = await this.getAll();
      const newTodo = {
        id: `t_${Date.now()}`,
        title: todoData.title,
        date: todoData.date,
        time: todoData.time || null,
        completed: false,
        important: false,
        remind: todoData.remind || null,
        repeated: null,
        tag: todoData.tag || null,
        subs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      todos.push(newTodo);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      
      return newTodo;
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  }

  /**
   * Todo 업데이트
   */
  async update(id, updates) {
    try {
      const todos = await this.getAll();
      const index = todos.findIndex(todo => todo.id === id);
      
      if (index === -1) {
        throw new Error('Todo not found');
      }
      
      todos[index] = {
        ...todos[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      
      return todos[index];
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  /**
   * Sub(하위 할 일) 추가
   */
  async addSub(todoId, subData) {
    try {
      const todos = await this.getAll();
      const index = todos.findIndex(todo => todo.id === todoId);
      
      if (index === -1) {
        throw new Error('Todo not found');
      }
      
      const newSub = {
        id: `sub_${Date.now()}`,
        title: subData.title,
        completed: false,
      };
      
      if (!todos[index].subs) {
        todos[index].subs = [];
      }
      
      todos[index].subs.push(newSub);
      todos[index].updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      
      return newSub;
    } catch (error) {
      console.error('Error adding sub:', error);
      throw error;
    }
  }
  
  /**
   * Sub 업데이트
   */
  async updateSub(todoId, subId, updates) {
    try {
      const todos = await this.getAll();
      const todoIndex = todos.findIndex(todo => todo.id === todoId);
      
      if (todoIndex === -1) {
        throw new Error('Todo not found');
      }
      
      const todo = todos[todoIndex];
      const subIndex = todo.subs?.findIndex(sub => sub.id === subId);
      
      if (subIndex === -1 || subIndex === undefined) {
        throw new Error('Sub not found');
      }
      
      todo.subs[subIndex] = {
        ...todo.subs[subIndex],
        ...updates
      };
      todo.updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      
      return todo;
    } catch (error) {
      console.error('Error updating sub:', error);
      throw error;
    }
  }

  /**
   * Sub 삭제
   */
  async deleteSub(todoId, subId) {
    try {
      const todos = await this.getAll();
      const index = todos.findIndex(todo => todo.id === todoId);
      
      if (index === -1) {
        throw new Error('Todo not found');
      }
      
      todos[index].subs = todos[index].subs?.filter(
        sub => sub.id !== subId
      ) || [];
      
      todos[index].updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      
      return true;
    } catch (error) {
      console.error('Error deleting sub:', error);
      throw error;
    }
  }
  
  /**
   * Todo 삭제
   */
  async delete(id) {
    try {
      const todos = await this.getAll();
      const filtered = todos.filter(todo => todo.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  /**
   * 여러 Todo 삭제
   */
  async deleteMany(ids) {
    try {
      const todos = await this.getAll();
      const filtered = todos.filter(todo => !ids.includes(todo.id));
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting todos:', error);
      throw error;
    }
  }

  /**
   * 모든 Todo 삭제
   */
  async clear() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing todos:', error);
      throw error;
    }
  }
}

export default new TodoStorage();