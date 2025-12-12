import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { useAuth } from './authContext';
import todoStorage from '../storage/todoStorage';
import routineStorage from '../storage/routineStorage';
import recordStorage from '../storage/recordStorage';
import todoService from '../firebase/todoService';
import routineService from '../firebase/routineService';
import recordService from '../firebase/recordService';
import notificationService from '../storage/notificationService';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [todos, setTodos] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [records, setRecords] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // 동기화 상태 관리
  const [syncStatus, setSyncStatus] = useState({
    lastSyncTime: null,
    pendingCount: 0,
    failedItems: []
  });

  // 낙관적 업데이트 ID 저장 (중복 반영 방지)
  const optimisticUpdates = useRef(new Set());
  
  // 이미 존재하는 항목 추적 (중복 생성 방지)
  const existingItems = useRef(new Set());

  // 주기적 동기화 타이머
  const syncInterval = useRef(null);

  // 로컬 데이터 로드
  const loadLocalData = useCallback(async () => {
    try {
      const [todoList, routineList, recordList] = await Promise.all([
        todoStorage.getAll(),
        routineStorage.getAll(),
        recordStorage.getAll()
      ]);

      setTodos(todoList || []);
      setRoutines(routineList || []);
      setRecords(recordList || []);
      
      // 기존 항목 ID 추적
      existingItems.current.clear();
      [...(todoList || []), ...(routineList || []), ...(recordList || [])].forEach(item => {
        existingItems.current.add(item.id);
      });

      console.log('[Data] Local data loaded:', {
        todos: todoList?.length || 0,
        routines: routineList?.length || 0,
        records: recordList?.length || 0
      });
    } catch (error) {
      console.error('[Data] Load local data error:', error);
    }
  }, []);

  // 앱 시작 시 로컬 데이터 로드
  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  // Firebase에서 데이터를 가져와 로컬에 저장
  const pullFromFirebase = useCallback(async (userId) => {
    if (!userId) return;

    try {
      console.log('[Data] Pulling data from Firebase...');

      const [fbTodos, fbRoutines, fbRecords] = await Promise.all([
        todoService.getAllByUser(userId),
        routineService.getAllByUser(userId),
        recordService.getAllByUser(userId)
      ]);

      // Firebase ID를 낙관적 업데이트 세트에 추가 (중복 반영 방지)
      fbTodos.forEach(item => optimisticUpdates.current.add(item.id));
      fbRoutines.forEach(item => optimisticUpdates.current.add(item.id));
      fbRecords.forEach(item => optimisticUpdates.current.add(item.id));

      // clear()를 순차적으로 실행
      await todoStorage.clear();
      await routineStorage.clear();
      await recordStorage.clear();

      // add/save도 순차적으로 실행
      for (const todo of fbTodos) {
        await todoStorage.add(todo);
      }
      for (const routine of fbRoutines) {
        await routineStorage.add(routine);
      }
      for (const record of fbRecords) {
        await recordStorage.save(record);
      }

      console.log('[Data] Data pulled from Firebase:', {
        todos: fbTodos.length,
        routines: fbRoutines.length,
        records: fbRecords.length
      });

      // 동기화 시각 업데이트
      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime: new Date().toISOString(),
        pendingCount: 0
      }));

      await loadLocalData();
    } catch (error) {
      console.error('[Data] Pull from Firebase error:', error);
    }
  }, [loadLocalData]);

  // 로그인 시 Firebase 동기화
  useEffect(() => {
    if (!user || authLoading) return;

    const initializeSync = async () => {
      setSyncing(true);
      try {
        await pullFromFirebase(user.uid);
      } catch (error) {
        console.error('[Data] Initialize sync error:', error);
      } finally {
        setSyncing(false);
      }
    };

    initializeSync();
  }, [user, authLoading, pullFromFirebase]);

  // 주기적 동기화 (30초마다)
  useEffect(() => {
    if (!user) {
      if (syncInterval.current) {
        clearInterval(syncInterval.current);
        syncInterval.current = null;
      }
      return;
    }

    // 30초마다 동기화 실행
    syncInterval.current = setInterval(() => {
      console.log('[Data] Periodic sync triggered');
      pullFromFirebase(user.uid);
    }, 30000); // 30초

    return () => {
      if (syncInterval.current) {
        clearInterval(syncInterval.current);
        syncInterval.current = null;
      }
    };
  }, [user, pullFromFirebase]);

  // 앱 포그라운드 복귀 시 동기화
  useEffect(() => {
    if (!user) return;

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('[Data] App resumed, refreshing data...');
        pullFromFirebase(user.uid);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [user, pullFromFirebase]);

  // Firebase에 데이터 푸시 (백그라운드)
  const pushToFirebase = useCallback(async (type, data, isNew = false) => {
    if (!user) return;

    try {
      // 낙관적 업데이트 ID 추가
      optimisticUpdates.current.add(data.id);

      if (type === 'todo') {
        if (isNew) {
          await todoService.create(user.uid, data);
        } else {
          await todoService.update(user.uid, data);
        }
      } else if (type === 'routine') {
        if (isNew) {
          await routineService.create(user.uid, data);
        } else {
          await routineService.update(user.uid, data);
        }
      } else if (type === 'record') {
        if (isNew) {
          await recordService.create(user.uid, data);
        } else {
          await recordService.update(user.uid, data);
        }
      }

      console.log(`✅ ${type} ${isNew ? 'created' : 'updated'} in Firebase:`, data.id);

      // 동기화 성공 시 상태 업데이트
      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime: new Date().toISOString(),
        pendingCount: Math.max(0, prev.pendingCount - 1),
        failedItems: prev.failedItems.filter(item => item.id !== data.id)
      }));

      // 낙관적 업데이트 ID 제거 (일정 시간 후)
      setTimeout(() => {
        optimisticUpdates.current.delete(data.id);
      }, 5000);

    } catch (error) {
      console.error(`[Data] Push ${type} to Firebase error:`, error);

      // 실패한 항목 추가
      setSyncStatus(prev => ({
        ...prev,
        failedItems: [...prev.failedItems, { id: data.id, type, error: error.message }]
      }));
    }
  }, [user]);

  // 데이터 저장
  const saveData = useCallback(async (type, data) => {
    try {
      let savedData;
      const isNew = !existingItems.current.has(data.id);
      
      if (type === 'todo') {
        savedData = await todoStorage.add(data);
      } else if (type === 'routine') {
        savedData = await routineStorage.add(data);
      } else if (type === 'record') {
        savedData = await recordStorage.save(data);
      }

      if (savedData.remind) {
        await notificationService.scheduleTodoReminder(savedData);
      }

      // 새 항목이면 추적 세트에 추가
      if (isNew && savedData) {
        existingItems.current.add(savedData.id);
      }

      await loadLocalData();

      // 동기화 대기 상태 표시
      setSyncStatus(prev => ({
        ...prev,
        pendingCount: prev.pendingCount + 1
      }));

      console.log(`[Data] ${type} saved locally (${isNew ? 'new' : 'update'})`);

      // 백그라운드에서 Firebase 동기화
      if (user) {
        pushToFirebase(type, savedData, isNew);
      } else {
        console.log(`[Data] ${type} saved locally only (not logged in)`);
      }

    } catch (error) {
      console.error(`[data] Save ${type} error:`, error);
      throw error;
    }
  }, [user, loadLocalData, pushToFirebase]);

  // 데이터 삭제
  const deleteData = useCallback(async (type, id) => {
    try {
      if (type === 'todo') {
        await todoStorage.delete(id);
      } else if (type === 'routine') {
        await routineStorage.delete(id);
      } else if (type === 'record') {
        await recordStorage.delete(id);
      }
      
      // 추적 세트에서 제거
      existingItems.current.delete(id);

      await loadLocalData();

      console.log(`[Data] ${type} deleted locally (optimistic update)`);

      // 백그라운드에서 Firebase 동기화
      if (user) {
        optimisticUpdates.current.add(id);

        if (type === 'todo') {
          await todoService.delete(user.uid, id);
        } else if (type === 'routine') {
          await routineService.delete(user.uid, id);
        } else if (type === 'record') {
          await recordService.delete(user.uid, id);
        }

        console.log(`[Data] ${type} deleted from Firebase`);

        setTimeout(() => {
          optimisticUpdates.current.delete(id);
        }, 5000);
      }

    } catch (error) {
      console.error(`[Data] Delete ${type} error:`, error);
      throw error;
    }
  }, [user, loadLocalData]);

  // 데이터 업데이트
  const updateData = useCallback(async (type, id, updates) => {
    try {
      let updatedData;
      if (type === 'todo') {
        updatedData = await todoStorage.update(id, updates);
      } else if (type === 'routine') {
        updatedData = await routineStorage.update(id, updates);
      } else if (type === 'record') {
        updatedData = await recordStorage.save({ ...updates, id });
      }

      await loadLocalData();

      console.log(`[Data] ${type} updated locally (optimistic update)`);

      // 백그라운드에서 Firebase 동기화 (항상 update로 처리)
      if (user && updatedData) {
        pushToFirebase(type, updatedData, false);
      }

    } catch (error) {
      console.error(`[Data] Update ${type} error:`, error);
      throw error;
    }
  }, [user, loadLocalData, pushToFirebase]);

  // 수동 동기화
  const refreshData = useCallback(async () => {
    if (user) {
      setSyncing(true);
      await pullFromFirebase(user.uid);
      setSyncing(false);
    } else {
      await loadLocalData();
    }
  }, [user, pullFromFirebase, loadLocalData]);


  const value = {
    todos,
    routines,
    records,
    syncing,
    syncStatus,
    user,
    saveData,
    deleteData,
    updateData,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};