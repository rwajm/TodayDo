import { doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './config';

class SessionManager {
  constructor() {
    this.currentSessionId = null;
    this.sessionUnsubscribe = null;
    this.isActiveSession = true;
    this.isHandlingConflict = false;
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
      // 기존 구독 정리
      if (this.sessionUnsubscribe) {
        this.sessionUnsubscribe();
        this.sessionUnsubscribe = null;
      }

      // 1. 새 세션 ID 생성
      this.currentSessionId = this.generateSessionId();
      this.isActiveSession = true;
      this.isHandlingConflict = false;

      console.log('[Session] Starting session:', this.currentSessionId);

      // 2. Firestore에 현재 세션 저장
      const sessionRef = doc(db, 'users', userId, 'session', 'active');
      await setDoc(sessionRef, {
        sessionId: this.currentSessionId,
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      // 3. 세션 변경 감지 (다른 기기에서 로그인 시)
      this.sessionUnsubscribe = onSnapshot(
        sessionRef, 
        (docSnap) => {
          // 이미 충돌 처리 중이거나 세션이 비활성화되면 무시
          if (this.isHandlingConflict || !this.isActiveSession) {
            return;
          }

          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // 다른 세션 ID가 감지되면 강제 로그아웃
            if (data.sessionId !== this.currentSessionId) {
              console.warn('[Session] Another device logged in. Current session will be terminated.');
              this.handleSessionConflict();
            }
          }
        },
        (error) => {
          // permission-denied 오류는 세션이 만료되었다는 의미
          if (error.code === 'permission-denied') {
            console.warn('[Session] Permission denied - session has been replaced by another device');
            
            // 이미 처리 중이 아니면 충돌 처리
            if (!this.isHandlingConflict && this.isActiveSession) {
              this.handleSessionConflict();
            }
          } else {
            console.error('[Session] Snapshot listener error:', error);
          }
        }
      );

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
    if (this.isHandlingConflict) {
      return; // 이미 처리 중이면 중복 실행 방지
    }

    this.isHandlingConflict = true;
    this.isActiveSession = false;
    
    console.log('[Session] Handling session conflict - cleaning up');
    
    // 실시간 구독 즉시 정리 (추가 오류 방지)
    if (this.sessionUnsubscribe) {
      try {
        this.sessionUnsubscribe();
      } catch (err) {
        console.error('[Session] Error unsubscribing:', err);
      }
      this.sessionUnsubscribe = null;
    }

    // 사용자에게 알림
    alert('다른 기기에서 로그인되어 현재 세션이 종료됩니다.');
    
    // Firebase 로그아웃 강제 실행
    console.log('[Session] Force logout due to session conflict');
    auth.signOut().catch(err => {
      console.error('[Session] Logout error:', err);
    });
  }

  /**
   * 세션 충돌 콜백 등록 (UI에서 모달 표시용)
   */
  setOnSessionConflict(callback) {
    this.onSessionConflictCallback = callback;
  }

  /**
   * 세션 종료 (로그아웃 시 호출)
   */
  async endSession(userId) {
    try {
      console.log('[Session] Ending session:', this.currentSessionId);

      // 플래그 먼저 설정하여 추가 이벤트 무시
      this.isActiveSession = false;

      // 실시간 구독 정리
      if (this.sessionUnsubscribe) {
        try {
          this.sessionUnsubscribe();
        } catch (err) {
          console.error('[Session] Error unsubscribing:', err);
        }
        this.sessionUnsubscribe = null;
      }

      // Firestore 세션 삭제 (현재 세션이 활성 상태였을 때만)
      if (this.currentSessionId && !this.isHandlingConflict) {
        try {
          const sessionRef = doc(db, 'users', userId, 'session', 'active');
          await deleteDoc(sessionRef);
          console.log('[Session] Firestore session deleted');
        } catch (error) {
          // permission-denied는 이미 다른 세션으로 대체된 경우이므로 무시
          if (error.code !== 'permission-denied') {
            console.warn('[Session] Failed to delete session from Firestore:', error);
          }
        }
      }
      
      this.currentSessionId = null;
      this.isHandlingConflict = false;

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
      // permission-denied는 세션이 만료되었다는 의미
      if (error.code === 'permission-denied') {
        console.warn('[Session] Session expired during updateLastActive');
        this.handleSessionConflict();
      } else {
        console.error('[Session] Update last active error:', error);
      }
    }
  }
}

export default new SessionManager();