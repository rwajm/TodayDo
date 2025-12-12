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

class RecordService {
    // 사용자의 records 서브컬렉션 참조
    getRecordsCollection(userId) {
        return collection(db, 'users', userId, 'records');
    }

    /**
     * 실시간 구독: userId의 모든 Record
     */
    subscribeRecords(userId, callback) {
        const q = query(this.getRecordsCollection(userId));
        return onSnapshot(
            q,
            (snapshot) => {
                const records = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(records);
            },
            (error) => console.error('Subscribe records error:', error)
        );
    }

    /**
     * 모든 Record 가져오기 (동기화용)
     */
    async getAllByUser(userId) {
        try {
            const q = query(this.getRecordsCollection(userId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Get records error:', error);
            return [];
        }
    }

    /**
     * 월별 Record 가져오기
     */
    async getRecordsByMonth(userId, year, month) {
        try {
            const records = await this.getAllByUser(userId);
            const monthStr = month.toString().padStart(2, '0');
            const yearStr = year.toString();

            return records.filter(record => {
                if (!record.date) return false;
                const [y, m] = record.date.split('.');
                return y === yearStr && m === monthStr;
            });
        } catch (error) {
            console.error('Get records by month error:', error);
            return [];
        }
    }

    /**
     * Record 생성 (신규 추가)
     */
    async create(userId, recordData) {
        try {
            if (!recordData.id) {
                throw new Error('Record ID is required');
            }

            const docRef = doc(db, 'users', userId, 'records', recordData.id);
            
            await setDoc(docRef, {
                ...recordData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            
            console.log('Record created:', recordData.id);
            return recordData.id;
        } catch (error) {
            console.error('Create record error:', error);
            throw error;
        }
    }

    /**
     * Record 업데이트 (기존 항목 수정)
     */
    async update(userId, recordData) {
        try {
            if (!recordData.id) {
                throw new Error('Record ID is required');
            }

            const docRef = doc(db, 'users', userId, 'records', recordData.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Record not found');
            }

            const { id, createdAt, ...updateData } = recordData;
            
            await updateDoc(docRef, {
                ...updateData,
                updatedAt: Timestamp.now()
            });
            
            console.log('Record updated:', recordData.id);
            return recordData.id;
        } catch (error) {
            console.error('Update record error:', error);
            throw error;
        }
    }

    /**
     * Record 삭제
     */
    async delete(userId, recordId) {
        try {
            await deleteDoc(doc(db, 'users', userId, 'records', recordId));
        } catch (error) {
            console.error('Delete record error:', error);
            throw error;
        }
    }

    /**
     * 여러 Record 삭제
     */
    async deleteMany(userId, recordIds) {
        try {
            await Promise.all(
                recordIds.map(id => deleteDoc(doc(db, 'users', userId, 'records', id)))
            );
        } catch (error) {
            console.error('Delete many records error:', error);
            throw error;
        }
    }

    /**
     * 사용자의 모든 Record 삭제
     */
    async deleteAllByUser(userId) {
        try {
            const records = await this.getAllByUser(userId);
            await this.deleteMany(userId, records.map(r => r.id));
        } catch (error) {
            console.error('Delete all records error:', error);
            throw error;
        }
    }
}

export default new RecordService();