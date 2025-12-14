import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../firebase/authService';
import sessionManager from '../firebase/sessionManager';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 인증 상태 변경 리스너
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          nickname: firebaseUser.displayName
        });
        
        // 세션 시작 (단일 기기만 허용)
        try {
          await sessionManager.startSession(firebaseUser.uid);
        } catch (error) {
          console.error('Session start failed:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, nickname) => {
    try {
      const userData = await authService.signUp(email, password, nickname);
      setUser(userData);
      
      // 세션 시작
      await sessionManager.startSession(userData.uid);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

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

  const logOut = async () => {
    try {
      // 세션 종료
      if (user) {
        await sessionManager.endSession(user.uid);
      }
      
      await authService.logOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      const userData = await authService.updateUserProfile(updates);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logOut,
    resetPassword,
    updateProfile,
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