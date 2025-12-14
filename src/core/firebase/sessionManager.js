import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './config';

class SessionManager {
  constructor() {
    this.currentSessionId = null;
    this.sessionUnsubscribe = null;
    this.isActiveSession = true;
  }

  /**
   * 세션 ID 생성 (디바이스 고유 ID)
   */
  generateSessionId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 세션 시작 (로그인 시 호출)
   */
  async startSession(userId) {
    try {
      // 1. 새 세션 ID 생성
      this.currentSessionId = this.generateSessionId();
      this.isActiveSession = true;

      console.log('[Session] Starting session:', this.currentSessionId);

      // 2. Firestore에 현재 세션 저장
      const sessionRef = doc(db, 'users', userId, 'session', 'active');
      await setDoc(sessionRef, {
        sessionId: this.currentSessionId,
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      // 3. 세션 변경 감지 (다른 기기에서 로그인 시)
      this.sessionUnsubscribe = onSnapshot(sessionRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // 다른 세션 ID가 감지되면 강제 로그아웃
          if (data.sessionId !== this.currentSessionId) {
            console.warn('[Session] Another device logged in. Logging out...');
            this.handleSessionConflict();
          }
        }
      });

      console.log('✅ Session started successfully');
      return true;

    } catch (error) {
      console.error('[Session] Start session error:', error);
      throw error;
    }
  }

  /**
   * 세션 충돌 처리 (다른 기기 로그인 감지)
   */
  handleSessionConflict() {
    this.isActiveSession = false;
    
    // 실시간 구독 정리
    if (this.sessionUnsubscribe) {
      this.sessionUnsubscribe();
      this.sessionUnsubscribe = null;
    }

    // 사용자에게 알림 후 로그아웃
    alert('다른 기기에서 로그인되어 현재 세션이 종료됩니다.');
    
    // Firebase 로그아웃
    auth.signOut();
  }

  /**
   * 세션 종료 (로그아웃 시 호출)
   */
  async endSession(userId) {
    try {
      console.log('[Session] Ending session:', this.currentSessionId);

      // 실시간 구독 정리
      if (this.sessionUnsubscribe) {
        this.sessionUnsubscribe();
        this.sessionUnsubscribe = null;
      }

      // Firestore 세션 삭제 (선택사항)
      // 삭제하지 않으면 마지막 활성 세션이 남아있음
      
      this.currentSessionId = null;
      this.isActiveSession = false;

      console.log('✅ Session ended');

    } catch (error) {
      console.error('[Session] End session error:', error);
    }
  }

  /**
   * 세션 활성화 여부 확인
   */
  isActive() {
    return this.isActiveSession;
  }

  /**
   * 주기적으로 세션 활성화 업데이트 (선택사항)
   * 앱이 활성 상태일 때 주기적으로 호출
   */
  async updateLastActive(userId) {
    if (!this.isActiveSession || !this.currentSessionId) return;

    try {
      const sessionRef = doc(db, 'users', userId, 'session', 'active');
      await setDoc(sessionRef, {
        sessionId: this.currentSessionId,
        lastActive: serverTimestamp()
      }, { merge: true });

    } catch (error) {
      console.error('[Session] Update last active error:', error);
    }
  }
}

export default new SessionManager();