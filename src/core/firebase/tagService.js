import {
    collection,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    getDocs,
    doc,
    onSnapshot
} from 'firebase/firestore';
import { db } from './config';

class TagService {
    // 사용자의 tags 서브컬렉션 참조
    getTagsCollection(userId) {
        return collection(db, 'users', userId, 'tags');
    }

    /**
     * 실시간 구독: userId의 모든 Tag
     */
    subscribeTags(userId, callback) {
        const q = query(this.getTagsCollection(userId));
        return onSnapshot(
            q,
            (snapshot) => {
                const tags = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(tags);
            },
            (error) => console.error('Subscribe tags error:', error)
        );
    }

    /**
     * 모든 Tag 가져오기
     */
    async getAllByUser(userId) {
        try {
            const q = query(this.getTagsCollection(userId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Get tags error:', error);
            return [];
        }
    }

    /**
     * ID로 Tag 찾기
     */
    async getById(userId, tagId) {
        try {
            const docRef = doc(db, 'users', userId, 'tags', tagId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                };
            }
            return null;
        } catch (error) {
            console.error('Get tag by id error:', error);
            return null;
        }
    }

    /**
     * 이름 중복 확인
     */
    async exists(userId, name) {
        try {
            const tags = await this.getAllByUser(userId);
            return tags.some(t => t.name === name);
        } catch (error) {
            console.error('Check tag existence error:', error);
            return false;
        }
    }

    /**
     * Tag 생성 (신규 추가)
     */
    async create(userId, tagData) {
        try {
            if (!tagData.id) {
                throw new Error('Tag ID is required');
            }

            const name = tagData.name.trim();

            if (name === '') {
                throw new Error('태그 이름을 입력해주세요.');
            }

            // 중복 체크
            if (await this.exists(userId, name)) {
                throw new Error('이미 존재하는 태그 이름입니다.');
            }

            const docRef = doc(db, 'users', userId, 'tags', tagData.id);

            await setDoc(docRef, {
                name: name
            });

            console.log('Tag created:', tagData.id);
            return tagData.id;
        } catch (error) {
            console.error('Create tag error:', error);
            throw error;
        }
    }

    /**
     * Tag 수정
     */
    async update(userId, tagData) {
        try {
            if (!tagData.id) {
                throw new Error('Tag ID is required');
            }

            const docRef = doc(db, 'users', userId, 'tags', tagData.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Tag not found');
            }

            // id 제외 업데이트(현재 이름만)
            const { id, ...updateData } = tagData;

            await updateDoc(docRef, {
                ...updateData
            });

            console.log('Tag updated:', tagData.id);
            return tagData.id;
        } catch (error) {
            console.error('Update tag error:', error);
            throw error;
        }
    }

    /**
     * Tag 삭제
     */
    async delete(userId, tagId) {
        try {
            const docRef = doc(db, 'users', userId, 'tags', tagId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Tag not found');
            }

            await deleteDoc(docRef);
            console.log('Tag deleted:', tagId);
        } catch (error) {
            console.error('Delete tag error:', error);
            throw error;
        }
    }

    /**
     * 여러 Tag 삭제
     */
    async deleteMany(userId, tagIds) {
        try {
            await Promise.all(
                tagIds.map(id => deleteDoc(doc(db, 'users', userId, 'tags', id)))
            );
        } catch (error) {
            console.error('Delete many tags error:', error);
            throw error;
        }
    }

    /**
     * 사용자의 모든 Tag 삭제
     */
    async deleteAllByUser(userId) {
        try {
            const tags = await this.getAllByUser(userId);
            await this.deleteMany(userId, tags.map(t => t.id));
        } catch (error) {
            console.error('Delete all tags error:', error);
            throw error;
        }
    }

    /**
     * Firebase 동기화 전용 메서드
     * Firebase 데이터 신뢰 (중복체크 x)
     */
    async sync(tagData) {
        try {
            if (!tagData.id) {
                throw new Error('Sync requires tag ID');
            }

            const tags = await this.getAll();
            const index = tags.findIndex(t => t.id === tagData.id);

            if (index >= 0) {
                tags[index] = tagData;
            } else {
                tags.push(tagData);
            }

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
            return tagData;
        } catch (error) {
            console.error('Sync tag error:', error);
            throw error;
        }
    }

}

export default new TagService();