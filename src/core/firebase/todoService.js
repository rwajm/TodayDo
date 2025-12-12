import {
    collection,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    getDocs,
    doc,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';
import { db } from './config';

class TodoService {
    // 사용자의 todos 서브컬렉션 참조
    getTodosCollection(userId) {
        return collection(db, 'users', userId, 'todos');
    }

    /**
     * 실시간 구독: userId의 모든 Todo
     */
    subscribeTodos(userId, callback) {
        const q = query(this.getTodosCollection(userId));
        return onSnapshot(
            q,
            (snapshot) => {
                const todos = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(todos);
            },
            (error) => console.error('Subscribe todos error:', error)
        );
    }

    /**
     * 모든 Todo 가져오기 (동기화)
     */
    async getAllByUser(userId) {
        try {
            const q = query(this.getTodosCollection(userId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Get todos error:', error);
            return [];
        }
    }

    /**
     * 월별 Todo 가져오기
     */
    async getTodosByMonth(userId, year, month) {
        try {
            const todos = await this.getAllByUser(userId);
            const monthStr = month.toString().padStart(2, '0');
            const yearStr = year.toString();

            return todos.filter(todo => {
                if (!todo.date) return false;
                const [y, m] = todo.date.split('.');
                return y === yearStr && m === monthStr;
            });
        } catch (error) {
            console.error('Get todos by month error:', error);
            return [];
        }
    }

    /**
     * Todo 생성 (신규 추가)
     */
    async create(userId, todoData) {
        try {
            if (!todoData.id) {
                throw new Error('Todo ID is required');
            }

            const docRef = doc(db, 'users', userId, 'todos', todoData.id);
            
            await setDoc(docRef, {
                ...todoData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            
            console.log('Todo created:', todoData.id);
            return todoData.id;
        } catch (error) {
            console.error('Create todo error:', error);
            throw error;
        }
    }

    /**
     * Todo 업데이트 (기존 항목 수정)
     */
    async update(userId, todoData) {
        try {
            if (!todoData.id) {
                throw new Error('Todo ID is required');
            }

            const docRef = doc(db, 'users', userId, 'todos', todoData.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Todo not found');
            }

            const { id, createdAt, ...updateData } = todoData;
            
            await updateDoc(docRef, {
                ...updateData,
                updatedAt: Timestamp.now()
            });
            
            console.log('Todo updated:', todoData.id);
            return todoData.id;
        } catch (error) {
            console.error('Update todo error:', error);
            throw error;
        }
    }

    /**
     * Todo 삭제
     */
    async delete(userId, todoId) {
        try {
            console.log('Deleting todo:', todoId);
            await deleteDoc(doc(db, 'users', userId, 'todos', todoId));
        } catch (error) {
            console.error('Delete todo error:', error);
            throw error;
        }
    }

    /**
     * 여러 Todo 삭제
     */
    async deleteMany(userId, todoIds) {
        try {
            await Promise.all(
                todoIds.map(id => deleteDoc(doc(db, 'users', userId, 'todos', id)))
            );
        } catch (error) {
            console.error('Delete many todos error:', error);
            throw error;
        }
    }

    /**
     * 사용자의 모든 Todo 삭제
     */
    async deleteAllByUser(userId) {
        try {
            const todos = await this.getAllByUser(userId);
            await this.deleteMany(userId, todos.map(t => t.id));
        } catch (error) {
            console.error('Delete all todos error:', error);
            throw error;
        }
    }
}

export default new TodoService();