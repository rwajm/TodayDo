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

class RoutineService {
    // 사용자의 routines 서브컬렉션 참조
    getRoutinesCollection(userId) {
        return collection(db, 'users', userId, 'routines');
    }

    /**
     * 실시간 구독: userId의 모든 Routine
     */
    subscribeRoutines(userId, callback) {
        const q = query(this.getRoutinesCollection(userId));
        return onSnapshot(
            q,
            (snapshot) => {
                const routines = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(routines);
            },
            (error) => console.error('Subscribe routines error:', error)
        );
    }

    /**
     * 모든 Routine 가져오기 (동기화용)
     */
    async getAllByUser(userId) {
        try {
            const q = query(this.getRoutinesCollection(userId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Get routines error:', error);
            return [];
        }
    }

    /**
     * 월별 Routine 가져오기
     */
    async getRoutinesByMonth(userId, year, month) {
        try {
            const routines = await this.getAllByUser(userId);
            const monthStr = month.toString().padStart(2, '0');
            const yearStr = year.toString();

            return routines.filter(routine => {
                if (!routine.date) return false;
                const [y, m] = routine.date.split('.');
                return y === yearStr && m === monthStr;
            });
        } catch (error) {
            console.error('Get routines by month error:', error);
            return [];
        }
    }

    /**
     * Routine 생성 (신규 추가)
     */
    async create(userId, routineData) {
        try {
            if (!routineData.id) {
                throw new Error('Routine ID is required');
            }

            const docRef = doc(db, 'users', userId, 'routines', routineData.id);
            
            await setDoc(docRef, {
                ...routineData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            
            console.log('Routine created:', routineData.id);
            return routineData.id;
        } catch (error) {
            console.error('Create routine error:', error);
            throw error;
        }
    }

    /**
     * Routine 업데이트 (기존 항목 수정)
     */
    async update(userId, routineData) {
        try {
            if (!routineData.id) {
                throw new Error('Routine ID is required');
            }

            const docRef = doc(db, 'users', userId, 'routines', routineData.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Routine not found');
            }

            const { id, createdAt, ...updateData } = routineData;
            
            await updateDoc(docRef, {
                ...updateData,
                updatedAt: Timestamp.now()
            });
            
            console.log('Routine updated:', routineData.id);
            return routineData.id;
        } catch (error) {
            console.error('Update routine error:', error);
            throw error;
        }
    }

    /**
     * Routine 삭제
     */
    async delete(userId, routineId) {
        try {
            await deleteDoc(doc(db, 'users', userId, 'routines', routineId));
        } catch (error) {
            console.error('Delete routine error:', error);
            throw error;
        }
    }

    /**
     * 여러 Routine 삭제
     */
    async deleteMany(userId, routineIds) {
        try {
            await Promise.all(
                routineIds.map(id => deleteDoc(doc(db, 'users', userId, 'routines', id)))
            );
        } catch (error) {
            console.error('Delete many routines error:', error);
            throw error;
        }
    }

    /**
     * 사용자의 모든 Routine 삭제
     */
    async deleteAllByUser(userId) {
        try {
            const routines = await this.getAllByUser(userId);
            await this.deleteMany(userId, routines.map(r => r.id));
        } catch (error) {
            console.error('Delete all routines error:', error);
            throw error;
        }
    }
}

export default new RoutineService();