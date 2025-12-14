import React, { createContext, useState, useContext, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './authContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    console.log('[User] Setting up real-time listener for user profile');

    // Firestore user 프로필 실시간 구독
    const unsubscribe = onSnapshot(
      doc(db, 'users', authUser.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfile({
            uid: authUser.uid,
            email: data.email,
            nickname: data.nickname,
            level: data.level,
            exp: data.exp,
            maxExp: data.maxExp,
            title: data.title,
            stats: data.stats,
            friends: data.friends || [],
            friendRequestsSent: data.friendRequestsSent || [],
            friendRequestsReceived: data.friendRequestsReceived || [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
          console.log('[User] Profile updated:', {
            level: data.level,
            exp: data.exp,
            nickname: data.nickname
          });
        } else {
          console.warn('[User] User profile not found');
          setUserProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('[User] Profile listener error:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('[User] Cleaning up user profile listener');
      unsubscribe();
    };
  }, [authUser]);

  const value = {
    userProfile,
    loading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};