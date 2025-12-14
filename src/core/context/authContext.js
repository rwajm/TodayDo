import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import authService from '../firebase/authService';
import sessionManager from '../firebase/sessionManager';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggingOut = useRef(false);

  useEffect(() => {
    // 인증 상태 변경 리스너
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      // 로그아웃 중이면 처리 스킵
      if (isLoggingOut.current) {
        return;
      }

      if (firebaseUser) {
        console.log('[Auth] User logged in:', firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          nickname: firebaseUser.displayName
        });
        
        // 세션 시작 (단일 기기만 허용)
        try {
          await sessionManager.startSession(firebaseUser.uid);
        } catch (error) {
          console.error('[Auth] Session start failed:', error);
          // 세션 시작 실패 시 로그아웃
          await authService.logOut();
          setUser(null);
        }
      } else {
        console.log('[Auth] User logged out');
        
        // 현재 사용자 정보가 있고, 로그아웃 중이 아닐 때만 세션 종료
        if (user && !isLoggingOut.current) {
          try {
            await sessionManager.endSession(user.uid);
          } catch (error) {
            console.error('[Auth] Session end failed:', error);
          }
        }
        
        setUser(null);
        isLoggingOut.current = false;
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * 1단계: 계정 생성 (이메일/비밀번호)
   */
  const createAccount = async (email, password) => {
    try {
      const accountData = await authService.createAccount(email, password);
      return accountData;
    } catch (error) {
      throw error;
    }
  };

  /**
   * 2단계: 이메일 인증 상태 확인
   */
  const checkEmailVerification = async () => {
    try {
      return await authService.checkEmailVerification();
    } catch (error) {
      throw error;
    }
  };

  /**
   * 인증 이메일 재발송
   */
  const resendVerificationEmail = async () => {
    try {
      await authService.resendVerificationEmail();
    } catch (error) {
      throw error;
    }
  };

  /**
   * 3단계: 닉네임 설정 및 회원가입 완료
   */
  const completeSignUp = async (nickname) => {
    try {
      return await authService.completeSignUp(nickname);
    } catch (error) {
      throw error;
    }
  };

  /**
   * 로그인
   */
  const signIn = async (email, password) => {
    try {
      const userData = await authService.signIn(email, password);
      setUser(userData);
      
      // 세션 시작 (기존 세션 강제 종료)
      await sessionManager.startSession(userData.uid);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  /**
   * 로그아웃
   */
  const logOut = async () => {
    try {
      isLoggingOut.current = true;
      
      // 세션 종료
      if (user) {
        await sessionManager.endSession(user.uid);
      }
      
      await authService.logOut();
      setUser(null);
    } catch (error) {
      isLoggingOut.current = false;
      throw error;
    }
  };

  /**
   * 비밀번호 재설정 이메일 전송
   */
  const resetPassword = async (email) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  /**
   * 닉네임 업데이트
   */
  const updateNickname = async (newNickname) => {
    try {
      const userData = await authService.updateNickname(newNickname);
      setUser(prevUser => ({
        ...prevUser,
        nickname: userData.nickname
      }));
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    createAccount,
    checkEmailVerification,
    resendVerificationEmail,
    completeSignUp,
    signIn,
    logOut,
    resetPassword,
    updateNickname,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};