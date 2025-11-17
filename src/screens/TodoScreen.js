import React, { useState, useMemo, useEffect, useRef } from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { SafeAreaView, View, TouchableOpacity, StyleSheet, FlatList, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform, Keyboard, BackHandler, Switch, TouchableWithoutFeedback } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Calendar } from 'react-native-calendars';

import CustomTimePicker from '../components/CustomTimePicker';
import AlarmPicker from '../components/AlarmPicker';
import RepeatPicker from '../components/RepeatPicker';

const DATA = [
  {id: '1', title: '할 일 1', date: '2025.11.11', completed: false, important: false, remind: { time: '09', cycle: '분', set: '전' }, repeated: { days: ['월', '수'], endDate: null }, tag: '운동', subSteps: [{ id: 's1', title: '준비 운동', completed: true }]},
  {id: '2', title: '할 일 2', date: '2025.11.10', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '3', title: '할 일 3', date: '2025.11.12', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '4', title: '할 일 4', date: '2025.11.08', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '5', title: '할 일 5', date: '2025.11.22', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '6', title: '할 일 6', date: '2025.12.08', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '7', title: '할 일 7', date: '2025.10.09', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '8', title: '할 일 8', date: '2025.12.03', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '9', title: '할 일 9', date: '2025.10.15', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '10', title: '할 일 10', date: '2025.12.11', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '11', title: '할 일 11', date: '2025.12.11', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '12', title: '할 일 12', date: '2025.10.09', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '13', title: '할 일 13', date: '2025.10.09', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '14', title: '할 일 14', date: '2025.08.12', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
  {id: '15', title: '할 일 15', date: '2025.09.08', completed: false, important: false, remind: null, repeated: null, tag: null, subSteps: []},
];

const TAGS_DATA = [
  { id: 't1', name: '운동', selected: false, subTags: [ {id: 's1', name: '헬스', selected: false} ] },
  { id: 't2', name: '공부', selected: false, subTags: [] },
  { id: 't3', name: '청소', selected: false, subTags: [] },
  { id: 't4', name: '빨래', selected: false, subTags: [] },
  { id: 't5', name: '서점', selected: false, subTags: [] },
  { id: 't6', name: '알바', selected: false, subTags: [] },
];

// 개별 할 일
function TodoItem({item, isDelete, selectedIds, onComplete, onImportant, onPress, onLongPress, onToggleSubStep, onSelect, onLongPressSubStep}){
  const isMainSelected = selectedIds.has(item.id);
  
  // 삭제 모드일 때는 선택 박스, 일반 모드일 때는 완료 체크 박스 표시
  const checkboxIcon = isDelete ? (isMainSelected ? 'checkbox':'square-outline')
    : (item.completed? 'checkmark-circle':'radio-button-off');
  const checkboxColor = isDelete ? (isMainSelected ? '#E50000':'gray')
    : (item.completed ? 'gray':'#3A9CFF');
  
  const completedColor = item.completed ? 'gray' : '#3A9CFF';
  const starColor = item.completed ? 'gray' : (item.important ? '#3A9CFF' : 'gray');

  // 날짜 표시(오늘 날짜는 '오늘'로 표시)
  const getDisplayDate = () => {
    if (!item.date) return '';

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}.${month}.${day}`;

    if (item.date === todayString) {
      return '오늘';
    }
    return item.date; 
  };

  return(
   <View>
      <TouchableOpacity 
        style={styles.itemRow} 
        onPress={onPress} 
        onLongPress={onLongPress}
      >
        <TouchableOpacity onPress={isDelete ? () => onSelect(item.id, null) : onComplete} style={{justifyContent: 'center', height: 24, marginRight: 3}}>
          <Ionicons name={checkboxIcon} size={25} color={checkboxColor}/>
        </TouchableOpacity>

        <View style={styles.itemTextContainer}>
          <View style={styles.itemTitleRow}>
            <NoScaleText style={[styles.itemTitle, item.completed&&styles.itemTitleCompleted, {marginRight: 7}]}>{item.title}</NoScaleText>
            {item.remind !== null && (
              <MaterialCommunityIcons name="bell" size={10} color={completedColor} style={{marginRight: 5}}/>
            )}
            {item.repeated !== null && (
              <MaterialCommunityIcons name="repeat" size={10} color={completedColor} style={{marginRight: 5}} />
            )}
          </View>
          <NoScaleText style={[styles.itemTitle, item.completed&&styles.itemTitleCompleted, { fontSize: 13, marginTop: 2 }]}>
            {getDisplayDate()}
          </NoScaleText>
        </View>

        {!isDelete && (
          <TouchableOpacity onPress={onImportant} style={styles.itemIcon}>
            <Ionicons
              name={item.important ? 'star':'star-outline'}
              size={24}
              color={starColor}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {item.subSteps && item.subSteps.length > 0 && item.subSteps.map((step) => {
        const subKey = `${item.id}-${step.id}`;
        const isSubSelected = selectedIds.has(subKey);

        const subCheckboxIcon = isDelete ? (isSubSelected ? 'checkbox' : 'square-outline') 
          : (step.completed ? "checkmark-circle" : "radio-button-off");
        const subCheckboxColor = isDelete ? (isSubSelected ? '#E50000' : 'gray') 
          : (step.completed ? "gray" : "#3A9CFF");

        return (
          <TouchableOpacity 
            key={step.id} 
            style={styles.subStepItemRow} 
            onPress={() => isDelete ? onSelect(item.id, step.id) : onToggleSubStep(item.id, step.id)}
            onLongPress={() => onLongPressSubStep(item.id, step.id)}
          >
             <Ionicons 
                name={subCheckboxIcon} 
                size={20} 
                color={subCheckboxColor} 
             />
             <NoScaleText style={[
                 styles.subStepItemText, 
                 step.completed && { textDecorationLine: 'line-through', color: 'gray' }
             ]}>
               {step.title}
             </NoScaleText>
          </TouchableOpacity>
        );
      })}
    </View>
  )
}

// 헤더 컴포넌트
function TodoHeader({
  isDelete, selectCount, onCancelDelete, onDeleteSelected, remainderCount,
  filterVisible, setFilterVisible, activeFilter,
  sortVisible, setSortVisible, onSelectSort, sortOrder,
  currentMonth, onPrevMonth, onNextMonth
}){
  // 삭제 모드일 때
  if(isDelete){
    return(
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onCancelDelete}>
          <NoScaleText style={styles.headerButton}>취소</NoScaleText>
        </TouchableOpacity>
        <NoScaleText style={styles.headerTitle}>{selectCount}개 선택됨</NoScaleText>
        <TouchableOpacity onPress={onDeleteSelected}>
          <NoScaleText style={[styles.headerButton, {color: 'red'}]}>삭제</NoScaleText>
        </TouchableOpacity>
      </View>
    );
  }

  const year = currentMonth.getFullYear();
  const month = String(currentMonth.getMonth()+1).padStart(2, '0');
  const monthString = `${year}.${month}`;

  // 일반 모드일 때
  return(
    <View>
      <View style={styles.monthRow}>
        <TouchableOpacity onPress={onPrevMonth}>
          <Ionicons name="chevron-back" size={24} color="black" style={{marginRight: 20}} />
        </TouchableOpacity>
        <NoScaleText style={styles.monthText}>{monthString}</NoScaleText>
        <TouchableOpacity onPress={onNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="black" style={{marginLeft: 20}} />
        </TouchableOpacity>
      </View>

      <View style={styles.statusBox}>
        <NoScaleText style={styles.statusTitle}>남은 할 일</NoScaleText>
        <NoScaleText style={styles.statusCount}>{remainderCount}개</NoScaleText>
        <NoScaleText style={styles.statusSubText}>잘 하고 있어요!</NoScaleText>
      </View>

      <View style={styles.separator} />

      <View style={[styles.controlsRow, { zIndex: 2000 }]}>
        {/* 필터 */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            onPress={() => setFilterVisible(!filterVisible)}
            activeOpacity={0.8}
            style={[
              styles.filterButton, 
              (activeFilter || filterVisible) ? { backgroundColor: '#3A9CFF' } : { backgroundColor: '#E0E0E0' }
            ]}
          >
            <Ionicons name="filter" size={20} color={(activeFilter || filterVisible) ? "white" : "#555"}/>
          </TouchableOpacity>
        </View>

        {/* 정렬 */}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[styles.sortButton]} 
            onPress={() => setSortVisible(!sortVisible)}
            activeOpacity={1}
          >
            <NoScaleText style={styles.sortText}>{sortOrder}</NoScaleText>
            <Ionicons name={sortVisible ? "chevron-up" : "chevron-down"} size={12} color="#555" style={{marginLeft: 4}}/>
          </TouchableOpacity>

          {sortVisible && (
            <View style={styles.dropdownFull}>
              <TouchableOpacity 
                style={styles.dropdownHeader} 
                onPress={() => setSortVisible(false)}
              >
                <NoScaleText style={styles.sortText}>{sortOrder}</NoScaleText>
                <Ionicons name="chevron-up" size={12} color="#555" style={{marginLeft: 4}}/>
              </TouchableOpacity>

              <View>
                <TouchableOpacity 
                  style={[styles.dropdownItem, sortOrder === '최신등록순' && styles.selectedItem]} 
                  onPress={() => onSelectSort('최신등록순')}
                >
                  <NoScaleText style={[styles.sortText, sortOrder === '최신등록순']}>
                    최신등록순
                  </NoScaleText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.dropdownItem, sortOrder === '기한순' && styles.selectedItem]} 
                  onPress={() => onSelectSort('기한순')}
                >
                  <NoScaleText style={[styles.sortText, sortOrder === '기한순']}>
                    기한순
                  </NoScaleText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

// 메인 화면 컴포넌트, 할 일 목록과 상태 관리
export default function TodoScreen(){
  // 데이터 및 기본 UI 상태
  const [todo, setTodo] = useState(DATA);
  const [isAddSubStep, setIsAddSubStep] = useState(false);
  const [subStepText, setSubStepText] = useState('');

  // 삭제, 필터, 정렬 상태
  const [isDelete, setIsDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState('최신등록순');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 상세 보기
  const [isDetailMenuVisible, setDetailMenuVisible] = useState(false);
  const [isDetailVisible, setDetailVisible] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [isMainDetailChecked, setIsMainDetailChecked] = useState(false);
  const [isDetailDeleteMode, setIsDetailDeleteMode] = useState(false);
  const [selectedDetailSubIds, setSelectedDetailSubIds] = useState(new Set());

  // 에디터(작성/수정) 및 설정 모달
  const [isEditDetail, setIsEditDetail] = useState(false);
  const [isEditorVisible, setEditorVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [originalDate, setOriginalDate] = useState(null);

  const [isAlarmOn, setIsAlarmOn] = useState(false);
  const [tempAlarm, setTempAlarm] = useState(null);
  const [isAlarmPickerVisible, setAlarmPickerVisible] = useState(false);

  const [isRepeatPickerVisible, setRepeatPickerVisible] = useState(false);
  const [repeatStep, setRepeatStep] = useState(1); // 1: 요일선택, 2: 종료일설정
  const [repeatDays, setRepeatDays] = useState([]);
  const [repeatEndDateMode, setRepeatEndDateMode] = useState('none');
  const [repeatEndDate, setRepeatEndDate] = useState(null);

  // 태그 관리
  const [tags, setTags] = useState(TAGS_DATA);
  const [isTagVisible, setTagVisible] = useState(false);
  const [addTagMode, setAddTagMode] = useState({ type: null, parentId: null });
  const [newTagText, setNewTagText] = useState('');
  const [backupTags, setBackupTags] = useState(null); // 태그 목록 백업
  const [backupEditTag, setBackupEditTag] = useState(null);

  // 할 일 완료 처리
  const todoComplete = (id) => {
    setTodo(prevTodo =>
      prevTodo.map(todo => {
        if (todo.id === id) {
            const newCompleted = !todo.completed;
            let updatedSubSteps = todo.subSteps;

            // 메인이 완료되면 하위도 모두 완료 처리
            if (newCompleted) {
                if (todo.subSteps) {
                    updatedSubSteps = todo.subSteps.map(step => ({...step, completed: true}));
                }
            } else {
                if (todo.subSteps) {
                    updatedSubSteps = todo.subSteps.map(step => ({...step, completed: false}));
                }
            }
            return { 
                ...todo, 
                completed: newCompleted,
                subSteps: updatedSubSteps 
            };
        }
        return todo;
      })
    );

    // 상세 보기 중인 아이템도 동기화
    if (detailItem && detailItem.id === id) {
      setDetailItem(prev => {
         const newCompleted = !prev.completed;
         let updatedSubSteps = prev.subSteps;
         if (newCompleted && prev.subSteps) {
             updatedSubSteps = prev.subSteps.map(step => ({...step, completed: true}));
         } else if (!newCompleted && prev.subSteps) {
             updatedSubSteps = prev.subSteps.map(step => ({...step, completed: false}));
         }
         return { ...prev, completed: newCompleted, subSteps: updatedSubSteps };
      });
    }
  };

  // 중요 표시 토글
  const todoImportant = (id) => {
    setTodo(prevTodo =>
      prevTodo.map(todo =>
        todo.id === id ? {...todo, important: !todo.important} : todo
      )
    );
    if (detailItem && detailItem.id === id) {
      setDetailItem(prev => ({ ...prev, important: !prev.important }));
    }
  };

  // 삭제 모드에서 아이템 선택/해제
  const todoSelect = (parentId, subId = null) => {
    const newSelected = new Set(selectedIds);
    
    if (subId === null) {
        if (newSelected.has(parentId)) {
            newSelected.delete(parentId);
            const targetTodo = todo.find(r => r.id === parentId);
            if (targetTodo && targetTodo.subSteps) {
                targetTodo.subSteps.forEach(step => {
                    newSelected.delete(`${parentId}-${step.id}`);
                });
            }
        } else {
            newSelected.add(parentId);
            const targetTodo = todo.find(r => r.id === parentId);
            if (targetTodo && targetTodo.subSteps) {
                targetTodo.subSteps.forEach(step => {
                    newSelected.add(`${parentId}-${step.id}`);
                });
            }
        }
    } else {
      if (newSelected.has(parentId)) {
          return; 
      }
      const key = `${parentId}-${subId}`;
      if (newSelected.has(key)) {
          newSelected.delete(key);
      } else {
          newSelected.add(key);
      }
    }
    setSelectedIds(newSelected);
  };

  const itemLongPressSubStep = (parentId, subId) => {
    if (!isDelete) {
        setIsDelete(true);
        todoSelect(parentId, subId);
    }
  };

  // 각 항목 LongPress (삭제 모드 표시)
  const itemLongPress = (id) => {
    setIsDelete(true);
    todoSelect(id, null);
  };

  // 각 항목 클릭 (상세 보기 / 삭제 모드 시 선택)
  const itemPress = (item) => {
    if(isDelete){
      todoSelect(item.id, null);
    }
    else {
      setDetailItem(item);
      setDetailVisible(true);
      setIsDetailDeleteMode(false);
      setSelectedDetailSubIds(new Set());
    }
  };

  const handleCloseDetail = () => {
    setDetailVisible(false);
    setDetailItem(null);
  };

  const cancelDelete = () => {
    setIsDelete(false);
    setSelectedIds(new Set());
  };

  // 선택된 항목 삭제
  const deleteSelected = () => {
    Alert.alert(
      "삭제",
      '선택한 항목을 삭제하시겠습니까?',
      [
        {text: "닫기", style: "cancel"},
        {text: "삭제", style: "destructive",
          onPress: () => {
            setTodo(prevTodo => {
              return prevTodo.filter(r => {
                if (selectedIds.has(r.id)) return false; // 메인 삭제
                return true;
              }).map(r => {
                if (r.subSteps) {
                  const newSubSteps = r.subSteps.filter(step => !selectedIds.has(`${r.id}-${step.id}`));
                  return { ...r, subSteps: newSubSteps };
                }
                return r;
              });
            });
            cancelDelete();
          }
        }
      ]
    );
  };

  // 상세 화면 삭제 모드 세부 단계 선택/해제 처리
  const handleDetailSubStepSelect = (subStepId) => {
    if (isMainDetailChecked) {
      return;
    }
    const newSelected = new Set(selectedDetailSubIds);
    if (newSelected.has(subStepId)) {
      newSelected.delete(subStepId);
    }
    else {
      newSelected.add(subStepId);
    }
    setSelectedDetailSubIds(newSelected);
  };

  // 상세 화면 삭제 모드의 삭제 버튼
  const confirmDetailDelete = () => {
    if (isMainDetailChecked) {
      Alert.alert("삭제", "이 할 일 전체를 삭제하시겠습니까?", [
        { text: "취소", style: "cancel" },
        { text: "삭제", style: "destructive", onPress: () => {
          setTodo(prev => prev.filter(r => r.id !== detailItem.id));
          setDetailVisible(false);
          setDetailMenuVisible(false);
          setDetailItem(null);
          cancelDetailDeleteMode();
        }}
      ]);
        return;
      }

      // 세부 단계만 일부 선택된 경우
      if (selectedDetailSubIds.size > 0) {
        Alert.alert("삭제", "선택한 세부 단계를 삭제하시겠습니까?", [
          { text: "취소", style: "cancel" },
          { text: "삭제", style: "destructive", onPress: () => {
            // 선택되지 않은 항목만 남김
            const newSubSteps = detailItem.subSteps.filter(step => !selectedDetailSubIds.has(step.id));
            
            setDetailItem(prev => ({ ...prev, subSteps: newSubSteps }));
            setTodo(prev => prev.map(r => r.id === detailItem.id ? { ...r, subSteps: newSubSteps } : r));
            
            cancelDetailDeleteMode();
          }}
        ]);
        return;
      }

      // 아무것도 선택하지 않고 삭제를 누른 경우
      cancelDetailDeleteMode();
  };
  
  // 상세 화면 삭제 모드 취소
  const cancelDetailDeleteMode = () => {
    setIsDetailDeleteMode(false);
    setSelectedDetailSubIds(new Set());
    setIsMainDetailChecked(false);
  };

  // 상세 화면 내부에서 세부 단계 완료
  const handleToggleSubStep = (subStepId) => {
    if (!detailItem) return;

    // 이미 완료된 할 일은 세부 단계 수정 불가
    if (detailItem.completed) {
      return;
    }

    const newSubSteps = (detailItem.subSteps || []).map(step => 
      step.id === subStepId ? { ...step, completed: !step.completed } : step
    );

    setDetailItem(prev => ({ ...prev, subSteps: newSubSteps }));
    
    setTodo(prev => prev.map(r => 
      r.id === detailItem.id ? { ...r, subSteps: newSubSteps } : r
    ));
  };

  // 메인 리스트 화면에서 세부 단계 완료
  const handleToggleSubStepList = (parentId, subStepId) => {
    setTodo(prevTodo => prevTodo.map(todo => {
      if (todo.id === parentId) {
        if (todo.completed) {
          return todo;
        }
        
        const newSubSteps = (todo.subSteps || []).map(step => 
          step.id === subStepId ? { ...step, completed: !step.completed } : step
        );
        return { ...todo, subSteps: newSubSteps };
      }
      return todo;
    }));
  };

  // 세부 단계 추가 및 저장
  const handleSaveSubStep = () => {
    if (subStepText.trim() === '') {
      setIsAddSubStep(false);
      return;
    }

    const newStep = {
      id: String(Date.now()),
      title: subStepText,
      completed: false
    };

    const newSubSteps = [...(detailItem.subSteps || []), newStep];

    setDetailItem(prev => ({ ...prev, subSteps: newSubSteps }));

    setTodo(prev => prev.map(r => 
      r.id === detailItem.id ? { ...r, subSteps: newSubSteps } : r
    ));

    setSubStepText('');
    setIsAddSubStep(false);
  };

  // 필터 스크롤 위치 조정
  const scrollViewRef = useRef(null);
  const scrollPositions = useRef({});

  useEffect(() => {
    if (filterVisible && activeFilter) {
      let key = activeFilter.type;
      if (key === 'tag') key = activeFilter.value;

      const y = scrollPositions.current[key];

      if (y !== undefined && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current.scrollTo({ y: y, animated: false });
        }, 100); 
      }
    }
  }, [filterVisible]);

  // 필터링 및 정렬
  const {filterSortedTodo, remainderCount} = useMemo(() => {
    const parsedDate = (dateString) => {
      if(!dateString) return new Date(0);
      const reDate = dateString.replace(/\./gi, '-');
      return new Date(reDate);
    }

    // 월별 필터링
    let filtered = todo.filter(item => {
      if(!item.date) return false;
      const itemDate = parsedDate(item.date);
      return itemDate.getFullYear() === currentMonth.getFullYear() && itemDate.getMonth() === currentMonth.getMonth();
    });

    const filterMonth = todo.filter(item => {
      const itemDate = parsedDate(item.date);
      return itemDate.getFullYear() === currentMonth.getFullYear() && itemDate.getMonth() === currentMonth.getMonth();
    });

    // 활성 필터(중요, 오늘, 태그) 적용
    if (activeFilter) {
      if (activeFilter.type === 'important') {
        filtered = filtered.filter(item => item.important);
      } 
      else if (activeFilter.type === 'today') {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayString = `${year}.${month}.${day}`;
        
        filtered = filtered.filter(item => item.date === todayString);
      } 
      else if (activeFilter.type === 'tag') {
        const parentTag = tags.find(t => t.name === activeFilter.value);
        const targetTags = [activeFilter.value];

        if (parentTag && parentTag.subTags) {
          parentTag.subTags.forEach(sub => targetTags.push(sub.name));
        }
        
        filtered = filtered.filter(item => targetTags.includes(item.tag));
      }
    }

    // 완료/미완료 구분 및 정렬(최신순/기한순)
    const uncompleted = filtered.filter(item => !item.completed);
    const completed = filtered.filter(item => item.completed);

    if(sortOrder === '기한순') {
      const dateSort = (a, b) => parsedDate(a.date) - parsedDate(b.date);
      uncompleted.sort(dateSort);
      completed.sort(dateSort);
    }
    else if(sortOrder === '최신등록순'){
      const idSort = (a, b) => Number(b.id) - Number(a.id);
      uncompleted.sort(idSort);
      completed.sort(idSort);
    }

    const count = uncompleted.length;

    return{
      filterSortedTodo: [...uncompleted, ...completed],  // 미완료 우선 표시
      remainderCount: count
    };
  }, [todo, sortOrder, currentMonth, activeFilter]);

  const itemSort = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setSortVisible(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }
  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 뒤로가기 버튼 (모달 닫기 등)
  useEffect(() => {
    const backAction = () => {
      if (isAddSubStep) {
        setIsAddSubStep(false);
        setSubStepText('');
        return true;
      }

      if (isEditorVisible){
        handleWriteCancel();
        return true;
      }

      if (isDetailDeleteMode) {
        cancelDetailDeleteMode();
        return true;
      }

      if (isDelete) {
        cancelDelete();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [isEditorVisible, editItem, isAddSubStep, isDelete, isDetailDeleteMode]);

  // 에디터 열기 (새 할 일 작성)
  const handleShowEditor = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');

    setIsEditDetail(false);

    const newTodo = {
      id: String(Date.now()), 
      title: '',
      date: null,
      completed: false, important: false,
      
      remind: null, 
      repeated: null,
      tag: null,
      subSteps: []
    };
    setTags(prev => prev.map(t => ({
      ...t, selected: false, subTags: t.subTags.map(s => ({
        ...s, selected: false
      }))
    })));

    setEditItem(newTodo);
    setEditorVisible(true);
  };

  // 에디터 닫기
  const handleCloseEditor = () => {
    setEditorVisible(false);

    if (isEditDetail) {
      setTimeout(() => {
        setDetailVisible(true);
        setIsEditDetail(false);
      }
      , 100);
    } else {
      setEditorVisible(false);
      setEditItem(null);
      setTempAlarm(null);
      setRepeatDays([]);
    }
  }

  // 상세 화면에서 삭제 선택 시
  const handleDeleteDetail = () => {
    if (detailItem.subSteps && detailItem.subSteps.length > 0) {
      setIsDetailDeleteMode(true);
      setDetailMenuVisible(false);
    }
    // 세부 단계가 없으면 바로 삭제 여부 묻기
    else{
      Alert.alert("삭제", "이 할 일을 삭제하시겠습니까?", [
        { text: "취소", style: "cancel", onPress: () => setDetailMenuVisible(false) },
        { 
          text: "삭제", 
          style: "destructive", 
          onPress: () => {
            if (detailItem) {
              setTodo(prev => prev.filter(r => r.id !== detailItem.id));
              setDetailVisible(false);
              setDetailMenuVisible(false);
              setDetailItem(null);
            }
          }
        }
      ]);
    }
    
  };

  // 상세 메뉴에서 수정 선택 시 에디터 열기
  const handleEditMenu = () => {
    setDetailMenuVisible(false);
    handleMoveToEdit('full');
  };

  // 에디터 작성 취소 (변경사항 확인)
  const handleWriteCancel = () => {
    let hasChanges = false;

    // 수정 모드일 때 변경 사항 비교
    if(isEditDetail && detailItem){
      const isTitleChanged = editItem.title !== detailItem.title;
      const isDateChanged = editItem.date !== detailItem.date;
      const isTagChanged = (editItem.tag || null) !== (detailItem.tag || null);
      
      const isAlarmChanged = JSON.stringify(editItem.remind) !== JSON.stringify(detailItem.remind);
      const isRepeatChanged = JSON.stringify(editItem.repeated) !== JSON.stringify(detailItem.repeated);

      if (isTitleChanged || isDateChanged || isTagChanged || isAlarmChanged || isRepeatChanged) {
        hasChanges = true;
      }
    }
    // 새 글 작성일 때 내용 확인
    else{
      if(editItem && (editItem.title.trim() !== '' || editItem.tag !== null || editItem.remind !== null || editItem.repeated !== null)){
        hasChanges = true;      
      }

      if(hasChanges){
        Alert.alert(
          "작성 중인 내용이 있습니다.",
          "나가시겠습니까?",
          [
            { text: "취소", style: 'cancel' },
            { text: "나가기", style: 'destructive', onPress: handleCloseEditor }
          ]
        );
      }
      else{
        handleCloseEditor();
      }
    }
  };

  // 할 일 저장 (새 항목 추가 / 수정)
  const handleSaveTodo = () => {
    if (editItem && editItem.title.trim() !== '' && editItem.date) { 
      setTodo(prev => {
      const exists = prev.find(r => r.id === editItem.id);
        if (exists) {
          return prev.map(r => r.id === editItem.id ? editItem : r);
        }
        else {
          return [editItem, ...prev];  // 신규
        }
      });

      if (isEditDetail) {
        setDetailItem(editItem);
        setEditorVisible(false);
        setTimeout(() => setDetailVisible(true), 100);
        setIsEditDetail(false);
      } else {
        handleCloseEditor();
      }
    } else { 
        Alert.alert("알림", "제목과 날짜를 입력해주세요."); 
    }
  }

  // 상세 화면 데이터를 에디터로 복사 및 에디터 표시
  const handleMoveToEdit = (target) => {
    if (!detailItem) return;

    setIsEditDetail(true);

    // 기존 상세 데이터를 editItem으로 복사
    setEditItem({
      ...detailItem,
      tag: detailItem.tag || null,
      remind: detailItem.remind || null,
      repeated: detailItem.repeated || null,
      subSteps: detailItem.subSteps || [],
    });

    // 태그 선택 상태 초기화 및 현재 태그 반영
    const currentTagName = detailItem.tag;
    const getInitializedTags = (list) => {
      const resetTags = list.map(t => ({
        ...t,
        selected: false,
        subTags: t.subTags.map(s => ({ ...s, selected: false }))
      }));

      if (!currentTagName || currentTagName === '태그'){
        return resetTags;
      }

      const parentIndex = resetTags.findIndex(t => t.name === currentTagName);
      if (parentIndex !== -1) {
        resetTags[parentIndex].selected = true;
        return resetTags;
      }
      return resetTags.map(t => ({
        ...t,
        subTags: t.subTags.map(s => s.name === currentTagName ? { ...s, selected: true } : s)
      }));
    };

    const newTags = getInitializedTags(tags);
    setTags(newTags);
    
    // 취소 시 복구를 위한 백업
    setBackupTags(JSON.parse(JSON.stringify(newTags)));
    setBackupEditTag(detailItem.tag || null);

    if (target === 'tag') {
        setTimeout(() => {
            setTagVisible(true);
        }, 100);
    } else if (target === 'full') {
        setTimeout(() => {
            setEditorVisible(true);
        }, 100);
    }
  };

  const handleDateSelect = (day) => {
    if (editItem) {
      setEditItem(prev => ({
        ...prev,
        date: day.dateString.replace(/-/g, '.')
      }));
      setCalendarVisible(false);
    }
    setTimePickerVisible(true);
  }

  // 날짜/시간/알림/반복/태그 관련 핸들러들
  // 각각의 모달을 열고, 값을 선택하고, 임시 상태에 저장했다가 확인 시 editItem에 반영
  const handleOpenCalendar = () => {
    Keyboard.dismiss();

    if (editItem) {
      setOriginalDate(editItem.date);
    }

    setTimeout(() => {
      setCalendarVisible(true);
    }, 100);
  }

  const handleTimeChange = (time) => {
    const timeString = `${time.ampm} ${time.hour}:${time.minute}`
    if(editItem){
      setEditItem(prev => ({
        ...prev,
        time: timeString
      }));
    }
  };

  const handleCancelTimePicker = () => {
    if (editItem) {
      setEditItem(prev => ({
        ...prev,
        date: originalDate
      }));
    }
    setTimePickerVisible(false);
  }

  const handleOpenAlarm = () => {
    Keyboard.dismiss();
    
    setIsAlarmOn(true);

    if (editItem?.remind) {
        setTempAlarm(editItem.remind);
    } else {
        setTempAlarm({ time: '01', cycle: '분', set: '전' });
    }
    
    setTimeout(() => {
      setAlarmPickerVisible(true)
    }, 100);;
  }

  const handleAlarmChange = (time) => {
    setTempAlarm(time);
  }

  const handleConfirmAlarm = () => {
    if(isAlarmOn && tempAlarm){
      setEditItem(prev => ({ ...prev, remind: tempAlarm }));
    }
    else {
      setEditItem(prev => ({ ...prev, remind: null }));
    }

    setAlarmPickerVisible(false)
  }

  const handleCancelAlarm = (time) => {
    setAlarmPickerVisible(false)
  }

  const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

  const getAlarmLabel = (remind) => {
    if (!remind) return '알림';
    return `${remind.time}${remind.cycle} ${remind.set}`;
  };

  const getRepeatLabel = (repeated) => {
    if (!repeated || !repeated.days || repeated.days.length === 0) return '반복';
    
    const sortDays = [...repeated.days].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
    if (sortDays.length > 2) {
      return `${sortDays[0]}, ${sortDays[1]} ..`;
    }
    return sortDays.join(', ');
  };

  const getTagLabel = (tag) => {
    return tag ? tag : '태그';
  };

  const handleOpenRepeat = () => {
    if (editItem?.repeated) {
        setRepeatDays(editItem.repeated.days || []);
        const hasEndDate = !!editItem.repeated.endDate;
        setRepeatEndDateMode(hasEndDate ? 'date' : 'none');
        setRepeatEndDate(editItem.repeated.endDate || null);
        setRepeatStep(1);
    } else {
        setRepeatStep(1);
        setRepeatDays([]);
        setRepeatEndDateMode('none');
        setRepeatEndDate(null);
    }
    setTimeout(() => {
      setRepeatPickerVisible(true);
    }, 100);
  }

  const handleToggleDay = (day) => {
    if (repeatDays.includes(day)) {
      setRepeatDays(prev => prev.filter(d => d !== day));
    } else {
      setRepeatDays(prev => [...prev, day]);
    }
  };

  const handleRepeatNext = () => {
    if (repeatStep === 1) {
      if (repeatDays.length > 0) {
        setRepeatStep(3);
      } else {
        handleConfirmRepeat();
      }
    } else if (repeatStep === 3) {
       handleConfirmRepeat();
    }
  };

  const handleConfirmRepeat = () => {
    if (editItem) { 
      const newRepeatData = {
          days: repeatDays,
          endDateMode: repeatEndDateMode,
          endDate: repeatEndDateMode === 'date' ? repeatEndDate : null
      };

      setEditItem(prev => ({
        ...prev,
        repeated: repeatDays.length > 0 ? newRepeatData : null
      }));
    } 
    setRepeatPickerVisible(false);
  };

  const handleRepeatChange = (date) => {
      const dateString = `${date.year}.${date.month}.${date.day}`;
      setRepeatEndDate(dateString);
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (addTagMode.type !== null && newTagText.trim() === '') {
            setAddTagMode({ type: null, parentId: null });
            setNewTagText('');
        }
        if (isAddSubStep && subStepText.trim() === '') {
            setIsAddSubStep(false);
            setSubStepText('');
        }
      }
    );
    return () => {
      keyboardDidHideListener.remove();
    };
  }, [addTagMode, newTagText, isAddSubStep, subStepText]);

  const handleOpenTag = () => {
    Keyboard.dismiss();

    setBackupTags(JSON.parse(JSON.stringify(tags))); 
    if (editItem) {
      setBackupEditTag(editItem.tag);
    }
    
    setAddTagMode({ type: null, parentId: null }); // 초기화
    setNewTagText('');
    setTimeout(() => {
      setTagVisible(true);
    }, 100);
  };

  const handleCancelTag = () => {
    if (backupTags) {
        setTags(backupTags);
    }
    if (editItem) {
        setEditItem(prev => ({ ...prev, tag: backupEditTag }));
    }
    setTagVisible(false);
    if (isEditDetail) {
        setTimeout(() => setDetailVisible(true), 100);
        setIsEditDetail(false);
    }
  };

  const handleConfirmTag = () => {
    if (isEditDetail && editItem) {
        setTodo(prev => prev.map(r => 
          r.id === editItem.id ? { ...r, tag: editItem.tag } : r
      ));
      setDetailItem(prev => ({ ...prev, tag: editItem.tag }));
        
        setTagVisible(false);
        setTimeout(() => setDetailVisible(true), 100);
        setIsEditDetail(false);
    } else {
        setTagVisible(false);
    }
  };

  const handleToggleTag = (tagId) => {
    let selectedTag = '태그';

    setTags(prevTags => {
        const resetTags = prevTags.map(t => ({
            ...t,
            selected: false,
            subTags: t.subTags.map(s => ({ ...s, selected: false }))
        }));

        const parentIndex = resetTags.findIndex(t => t.id === tagId);
        if (parentIndex !== -1) {
            resetTags[parentIndex].selected = true;
            selectedTag = resetTags[parentIndex].name;
            return resetTags;
        }

        const newTags = resetTags.map(t => {
          const subIndex = t.subTags.findIndex(s => s.id === tagId);
          if(subIndex !== -1){
            selectedTag = t.subTags[subIndex].name;
            return { ...t, subTags: t.subTags.map(s => s.id === tagId ? { ...s, selected: true } : s) };
          }
          return t;
        });
        return newTags;
    });
    if(editItem){
      setEditItem(prev => ({
        ...prev, tag: selectedTag !== '태그' ? selectedTag : null
      }));
    }
  };

  const startAddTag = (type, parentId = null) => {
    setAddTagMode({ type, parentId });
    setNewTagText('');
  };

  const saveNewTag = () => {
    const tagNameToCheck = newTagText.trim();

    if (tagNameToCheck === ''){
      setAddTagMode({ type: null, parentId: null });
      setNewTagText('');
      return;
    }
    
    // 중복 이름 체크
    const isDuplicate = tags.some(tag => {
      if (tag.name === tagNameToCheck) return true;
      
      if (tag.subTags && tag.subTags.some(sub => sub.name === tagNameToCheck)) {
        return true;
      }
      
      return false;
    });

    if (isDuplicate) {
      Alert.alert("알림", "이미 존재하는 태그 이름입니다.");
      return; // 중복이면 함수 종료
    }
    
    const newId = String(Date.now());
    let newTagName = tagNameToCheck;
    
    setTags(prevTags => {
      const resetTags = prevTags.map(t => ({
        ...t,
        selected: false,
        subTags: t.subTags.map(s => ({ ...s, selected: false }))
      }));

      if (addTagMode.type === 'parent') {
        return [...resetTags, { id: newId, name: newTagName, selected: true, subTags: [] }];
      } 
      else if (addTagMode.type === 'child') {
        return resetTags.map(t => {
          if (t.id === addTagMode.parentId) {
            return {
              ...t,
              subTags: [...t.subTags, { id: newId, name: newTagName, selected: true }]
            };
          }
          return t;
        });
      }
      return resetTags;
    });

    if(editItem){
      setEditItem(prev => ({
        ...prev, tag: newTagName
      }));
    }
    
    // 입력 모드 종료
    setAddTagMode({ type: null, parentId: null });
    setNewTagText('');
  };

  return(
    <SafeAreaView  style={styles.screen}>
      <View style={styles.container}>

        {/* 필터/정렬 드롭다운 배경(터치 시 닫기)*/ }
        {(filterVisible || sortVisible) && (
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.backdrop} 
            onPress={() => {
              setFilterVisible(false);
              setSortVisible(false);
            }} 
          />
        )}
        
        <View style={{ zIndex: 3000, backgroundColor: '#f9f9f9' }}> 
          <TodoHeader 
            isDelete={isDelete}
            selectCount={selectedIds.size}
            onCancelDelete={cancelDelete}
            onDeleteSelected={deleteSelected}
            remainderCount={remainderCount}

            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            tags={tags}
            
            sortVisible={sortVisible}
            setSortVisible={setSortVisible}
            onSelectSort={itemSort}
            sortOrder={sortOrder}
            currentMonth={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            isFilterActive={activeFilter !== null}
          />
        </View>

        <FlatList
          data={filterSortedTodo}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 50 }}
          ListHeaderComponentStyle={{ zIndex: 2 }}

          renderItem={({item}) => (
            <TodoItem
              item={item}
              isDelete={isDelete}
              selectedIds={selectedIds}
              onComplete={()=>todoComplete(item.id)}
              onImportant={()=>todoImportant(item.id)}
              onPress={() => itemPress(item)}
              onLongPress={() => itemLongPress(item.id)}
              onToggleSubStep={handleToggleSubStepList}
              onSelect={todoSelect}
              onLongPressSubStep={itemLongPressSubStep}
            />
          )}

          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <NoScaleText style={styles.emptyText}>
                아직 할 일이 없습니다.{'\n'}
                아래 +버튼을 눌러 추가해보세요!</NoScaleText>
            </View>
          }
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
        statusBarTranslucent
      >
        <TouchableOpacity 
          style={styles.filterBackdrop} 
          activeOpacity={1} 
          onPress={() => setFilterVisible(false)}
        >
          <View style={styles.filterModalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.filterContent}>
                <NoScaleText style={styles.filterTitle}>필터</NoScaleText>
                <View style={styles.filterDivider} />
                
                <ScrollView
                  ref={scrollViewRef}
                  style={{ maxHeight: 250 }}
                  contentContainerStyle={{ paddingVertical: 10 }}
                  showsVerticalScrollIndicator={true}
                >

                  {/* 중요 필터 */}
                  <TouchableOpacity
                    onLayout={(event) => {
                      scrollPositions.current['important'] = event.nativeEvent.layout.y;
                    }}
                    style={[
                      styles.filterOption, 
                      activeFilter?.type === 'important' && { backgroundColor: '#F0F0F0' }
                    ]} 
                    onPress={() => {
                      if(activeFilter?.type === 'important') setActiveFilter(null);
                      else setActiveFilter({ type: 'important' });
                      setFilterVisible(false);
                    }}
                  >
                    <Ionicons name="star" size={18} color="#3A9CFF" style={{marginRight: 10}} />
                    <NoScaleText style={styles.filterText}>중요한 일</NoScaleText>
                  </TouchableOpacity>

                  {/* 오늘 필터 */}
                  <TouchableOpacity
                    onLayout={(event) => {
                      scrollPositions.current['today'] = event.nativeEvent.layout.y;
                    }}
                    style={[
                      styles.filterOption, 
                      activeFilter?.type === 'today' && { backgroundColor: '#F0F0F0' }
                    ]}
                    onPress={() => {
                      if(activeFilter?.type === 'today') setActiveFilter(null);
                      else setActiveFilter({ type: 'today' });
                      setFilterVisible(false);
                    }}
                  >
                    <Ionicons name="ellipse-outline" size={18} color="#3A9CFF" style={{marginRight: 10}} />
                    <NoScaleText style={styles.filterText}>오늘 할 일</NoScaleText>
                  </TouchableOpacity>

                  {/* 태그 라벨 */}
                  <View style={[styles.filterOption, { marginTop: 5, paddingVertical: 5 }]}>
                    <MaterialCommunityIcons name="label-outline" size={18} color="gray" style={{marginRight: 10}} />
                    <NoScaleText style={styles.filterText}>태그 :</NoScaleText>
                  </View>
                  
                  {/* 태그 목록 */}
                  {tags.map(tag => (
                    <TouchableOpacity 
                      key={tag.id}
                      onLayout={(event) => {
                        scrollPositions.current[tag.name] = event.nativeEvent.layout.y;
                      }}
                      style={[
                        styles.filterSubOption,
                        (activeFilter?.type === 'tag' && activeFilter?.value === tag.name) && { backgroundColor: '#F0F0F0' }
                      ]}
                      onPress={() => {
                        if(activeFilter?.type === 'tag' && activeFilter?.value === tag.name) setActiveFilter(null);
                        else setActiveFilter({ type: 'tag', value: tag.name });
                        setFilterVisible(false);
                      }}
                    >
                      <NoScaleText style={styles.filterSubText}>{tag.name}</NoScaleText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isDetailVisible}
        onRequestClose={() => {
          if (isDetailMenuVisible) {
            setDetailMenuVisible(false);
          } else if (isDetailDeleteMode) {
            cancelDetailDeleteMode();
          } else {
            handleCloseDetail();
          }
        }}
        statusBarTranslucent
      >

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableOpacity 
            style={[styles.baseBackdrop, { justifyContent: 'flex-end' }]} 
            activeOpacity={1} 
            onPress={() => {
              if (isDetailMenuVisible) {
                setDetailMenuVisible(false);
              }
              else if (isDetailDeleteMode) {
              cancelDetailDeleteMode();
              }
              else {
                  handleCloseDetail();
              }
            }
            }
          >
            <TouchableOpacity 
              activeOpacity={1} 
              style={styles.bottomSheetContainer} 
              onPress={() => setDetailMenuVisible(false)}
            >
              <View style={styles.dragHandleContainer}>
                <View style={styles.dragHandle} />
              </View>

              {detailItem && (
                <>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, zIndex: 10}}>
                      
                    <TouchableOpacity 
                      style={styles.sheetTagContainer} 
                      onPress={() => handleMoveToEdit('tag')}
                    >
                      <View style={[
                          styles.sheetTag, 
                          { backgroundColor: detailItem.tag ? '#3A9CFF' : '#E0E0E0' }
                      ]}>
                        {detailItem.tag ? (
                            <MaterialCommunityIcons name="label-outline" size={14} color="white" style={{marginRight:4}} />
                          ) : (
                            <MaterialCommunityIcons name="label-outline" size={14} color="#888" style={{marginRight:4}} />
                        )}
                        <NoScaleText style={{
                            color: detailItem.tag ? 'white' : '#888', 
                            fontSize: 12
                          }}>
                            {getTagLabel(detailItem.tag)}
                        </NoScaleText>
                      </View>
                    </TouchableOpacity>

                    {isDetailDeleteMode ? (
                      <TouchableOpacity onPress={confirmDetailDelete}>
                          <NoScaleText style={{color: 'red', fontSize: 16}}>삭제</NoScaleText>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={(e) => {
                          e.stopPropagation();
                          setDetailMenuVisible(!isDetailMenuVisible);
                      }} style={{padding: 5}}>
                          <Ionicons name="ellipsis-vertical" size={20} color="#555" />
                      </TouchableOpacity>
                    )}

                    {isDetailMenuVisible && !isDetailDeleteMode && (
                      <View style={styles.menuPopup}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleEditMenu}>
                          <NoScaleText style={styles.menuText}>수정</NoScaleText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={handleDeleteDetail}>
                          <NoScaleText style={[styles.menuText, {color: 'red'}]}>삭제</NoScaleText>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {isDetailDeleteMode ? (
                    <TouchableOpacity 
                      style={[styles.sheetTitleRow, {justifyContent: 'flex-start'}]} 
                      onPress={() => {
                        const newMainChecked = !isMainDetailChecked;
                        setIsMainDetailChecked(newMainChecked);
                        
                        if (newMainChecked) {
                            const allSubIds = new Set();
                            (detailItem.subSteps || []).forEach(step => allSubIds.add(step.id));
                            setSelectedDetailSubIds(allSubIds);
                        } else {
                            setSelectedDetailSubIds(new Set());
                        }
                      }}
                    >
                      <Ionicons 
                        name={isMainDetailChecked ? "checkbox" : "square-outline"} 
                        size={28} 
                        color={isMainDetailChecked ? "#E50000" : "gray"} 
                        style={{marginRight: 10}}
                      />
                      <NoScaleText style={[styles.sheetTitleText, {marginLeft: 0}]}>
                        {detailItem.title}
                      </NoScaleText>
                    </TouchableOpacity>
                  ) : (
                      <View style={styles.sheetTitleRow}>
                        <TouchableOpacity onPress={() => todoComplete(detailItem.id)}>
                          <Ionicons 
                            name={detailItem.completed ? "checkmark-circle" : "radio-button-off"} 
                            size={28} 
                            color={detailItem.completed ? "gray" : "#333"} 
                          />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={{flex: 1}} onPress={() => todoComplete(detailItem.id)}>
                          <NoScaleText style={[
                            styles.sheetTitleText, 
                            detailItem.completed && { textDecorationLine: 'line-through', color: 'gray' }
                          ]}>
                            {detailItem.title}
                          </NoScaleText>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => todoImportant(detailItem.id)}>
                          <Ionicons 
                            name={detailItem.important ? "star" : "star-outline"} 
                            size={28} 
                            color={detailItem.important ? "#3A9CFF" : "gray"} 
                          />
                        </TouchableOpacity>
                      </View>
                  )}

                  <View style={{ marginBottom: 15 }}>
                    <ScrollView 
                      style={{ maxHeight: 220 }} 
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                      >
                      {(detailItem.subSteps || []).map((step) => (
                        <View key={step.id} style={styles.subStepRow}>
                          <TouchableOpacity 
                            style={{flexDirection: 'row', alignItems: 'center', flex: 1}}
                            onPress={() => {
                              if (isDetailDeleteMode) {
                                handleDetailSubStepSelect(step.id);
                              } else {
                                handleToggleSubStep(step.id);
                              }
                            }}
                          >
                            <Ionicons 
                              name={isDetailDeleteMode 
                                ? (selectedDetailSubIds.has(step.id) ? "checkbox" : "square-outline")
                                : (step.completed ? "checkmark-circle" : "radio-button-off")
                              } 
                              size={20} 
                              color={isDetailDeleteMode 
                                ? (selectedDetailSubIds.has(step.id) ? "#E50000" : "gray")
                                : (step.completed ? "gray" : "#333")
                              } 
                              style={{marginRight: 8}}
                            />
                              <NoScaleText style={[
                                styles.subStepText, 
                                !isDetailDeleteMode && step.completed && { textDecorationLine: 'line-through', color: 'gray' }
                              ]}>
                                {step.title}
                              </NoScaleText>
                          </TouchableOpacity>
                        </View>
                      ))}
                      </ScrollView>

                      {!isDetailDeleteMode && (
                        isAddSubStep ? (
                          <View style={styles.subStepInputContainer}>
                            <NoScaleTextInput
                              style={styles.subStepInput}
                              placeholder="세부 단계 입력"
                              value={subStepText}
                              onChangeText={setSubStepText}
                              autoFocus={true}
                              onSubmitEditing={handleSaveSubStep}
                            />
                            <TouchableOpacity onPress={handleSaveSubStep} style={{padding: 5}}>
                              <Ionicons name="checkmark-circle" size={28} color="#3A9CFF" />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity 
                            style={styles.addSubStepBtn} 
                            onPress={() => {
                              setIsAddSubStep(true);
                              setSubStepText('');
                            }}
                          >
                            <Ionicons name="add" size={20} color="#3A9CFF" />
                            <NoScaleText style={{color: '#3A9CFF', fontSize: 14, marginLeft: 5}}>
                              세부 단계 추가
                            </NoScaleText>
                          </TouchableOpacity>
                        )
                      )}
                  </View>

                  <View style={styles.sheetDivider} />

                  <View style={styles.metaInfoContainer}>
                    <View style={styles.metaRow}>
                      <Ionicons name="calendar-outline" size={20} color="#555" style={{width: 30}} />
                      <NoScaleText style={styles.metaText}>
                          {detailItem.date ? detailItem.date : '날짜 없음'}
                      </NoScaleText>
                    </View>

                    <View style={styles.metaRow}>
                      <Ionicons name="notifications-outline" size={20} color="#555" style={{width: 30}} />
                      <NoScaleText style={styles.metaText}>
                          {detailItem.remind ? getAlarmLabel(detailItem.remind) : '없음'}
                      </NoScaleText>
                    </View>
                    
                    <View style={[styles.metaRow, {marginBottom: 30}]}>
                      <Ionicons name="repeat-outline" size={20} color="#555" style={{width: 30}} />
                      <NoScaleText style={styles.metaText}>
                        {(detailItem.repeated && detailItem.repeated.days) 
                          ? detailItem.repeated.days.join(', ') 
                          : '없음'
                        }
                        {detailItem.repeated?.endDate ? `, ${detailItem.repeated.endDate} 까지` : ''}
                      </NoScaleText>
                    </View>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        statusBarTranslucent
        transparent={true}
        visible={isCalendarVisible}
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)} >

        <TouchableOpacity 
          style={[styles.baseBackdrop, { justifyContent: 'center', alignItems: 'center' }]} 
          activeOpacity={1}
          onPress={() => setCalendarVisible(false)} // 배경 누르면 닫기
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.calendarModalContent}
            onPress={() => {}}
          >
            <Calendar
              onDayPress={handleDateSelect}
              current={
                editItem?.date 
                  ? editItem.date.split(' ')[0].replace(/\./g, '-') 
                  : `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-01`
              } />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        statusBarTranslucent
        transparent={true}
        visible={isTimePickerVisible}
        animationType="fade"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <TouchableOpacity 
          style={[styles.baseBackdrop, { justifyContent: 'center', alignItems: 'center' }]} 
          activeOpacity={1}
        >
          <View style={[styles.modalContent, { width: '80%' }]}>
            <NoScaleText style={{color: '#000000', fontSize: 20, alignItems: 'left'}}>시간</NoScaleText>
            <CustomTimePicker
              itemHeight={40}
              onTimeChange={handleTimeChange}
            />
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
              <TouchableOpacity 
                style={[styles.modalButton,{marginRight: 15}]}
                onPress={handleCancelTimePicker}
              >
                <NoScaleText style={{color: '#595959', fontSize: 16}}>취소</NoScaleText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton,{marginRight: 15}]}
                onPress={() => setTimePickerVisible(false)}
              >
                <NoScaleText style={{color: '#3A9CFF', fontSize: 16}}>확인</NoScaleText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        statusBarTranslucent
        transparent={true}
        visible={isAlarmPickerVisible}
        animationType="fade"
        onRequestClose={() => setAlarmPickerVisible(false)}
      >
        <TouchableOpacity 
          style={[styles.baseBackdrop, { justifyContent: 'center', alignItems: 'center' }]} 
          activeOpacity={1}
        >
          <View style={[styles.modalContent, { width: '80%' }]}>
            <View style={{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
            }}>
              <NoScaleText style={{color: '#000000', fontSize: 20, alignItems: 'left'}}>
                  알림 설정
              </NoScaleText>

              <Switch
                trackColor={{ false: "#767577", true: "#3A9CFF" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => setIsAlarmOn(value)}
                value={isAlarmOn}
              />
            </View>
            
            <View 
              style={{
                marginTop: 10,
                opacity: isAlarmOn ? 1 : 0.3 // 꺼지면 흐리게
              }}
              pointerEvents={isAlarmOn ? 'auto' : 'none'} // 꺼지면 터치 불가
            >
              <AlarmPicker
                key={isAlarmPickerVisible ? "open" : "closed"}
                itemHeight={40}
                onTimeChange={handleAlarmChange}
                initValue={tempAlarm || editItem?.alarmData || { time: '01', cycle: '분', set: '전' }}
              />
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
              <TouchableOpacity 
                style={[styles.modalButton,{marginRight: 15}]}
                onPress={handleCancelAlarm}
              >
                <NoScaleText style={{color: '#595959', fontSize: 16}}>취소</NoScaleText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton,{marginRight: 15}]}
                onPress={handleConfirmAlarm}
              >
                <NoScaleText style={{color: '#3A9CFF', fontSize: 16}}>확인</NoScaleText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        statusBarTranslucent
        transparent={true}
        visible={isRepeatPickerVisible}
        animationType="fade"
        onRequestClose={() => setRepeatPickerVisible(false)}
      >
        <TouchableOpacity style={[styles.baseBackdrop, { justifyContent: 'center', alignItems: 'center' }]} activeOpacity={1}>
          <View style={[styles.modalContent, { width: '80%' }]}>
            <View style={{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 20
            }}>
              <NoScaleText style={{color: '#000000', fontSize: 20, fontWeight: 'bold'}}>
                {repeatStep === 1 ? "반복 설정" : "반복 종료 설정"}
              </NoScaleText>

              {repeatStep === 3 && (
                <Switch
                  trackColor={{ false: "#767577", true: "#3A9CFF" }}
                  thumbColor={"#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => {
                    if (value) {
                      setRepeatEndDateMode('date');
                      if (!repeatEndDate) {
                        const today = new Date();
                        const todayString = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
                        setRepeatEndDate(todayString);
                      }
                    } else {
                        setRepeatEndDateMode('none');
                    }
                  }}
                  value={repeatEndDateMode === 'date'}
                />
              )}
            </View>

            {repeatStep === 1 && (
              <>
                <TouchableOpacity style={styles.repeatOptionRow} onPress={() => setRepeatDays([])}>
                  <NoScaleText style={{fontSize: 16, color: repeatDays.length === 0 ? '#3A9CFF' : '#000000'}}>안함</NoScaleText>
                  {repeatDays.length === 0 && <Ionicons name="checkmark" size={20} color="#3A9CFF" />}
                </TouchableOpacity>
                
                {DAYS.map((day) => {
                  const isSelected = repeatDays.includes(day);

                  return(
                    <TouchableOpacity key={day} style={styles.repeatOptionRow} onPress={() => handleToggleDay(day)}>
                      <NoScaleText style={{fontSize: 16, color: isSelected ? '#3A9CFF' : '#000000'}}>{day}</NoScaleText>
                      {repeatDays.includes(day) && <Ionicons name="checkmark" size={20} color="#3A9CFF" />}
                    </TouchableOpacity>
                  );
                })}
              </>
            )}

            {repeatStep === 2 && (
              <>
                <TouchableOpacity style={styles.repeatOptionRow} onPress={() => setRepeatEndDateMode('none')}>
                  <NoScaleText style={{fontSize: 16, color: repeatEndDateMode === 'none' ? '#3A9CFF' : '#000000'}}>안함</NoScaleText>
                  {repeatEndDateMode === 'none' && <Ionicons name="checkmark" size={20} color="#3A9CFF" />}
                </TouchableOpacity>

                <TouchableOpacity style={styles.repeatOptionRow} onPress={() => setRepeatEndDateMode('date')}>
                  <NoScaleText style={{fontSize: 16, color: repeatEndDateMode === 'date' ? '#3A9CFF' : '#000000'}}>날짜</NoScaleText>
                  {repeatEndDateMode === 'date' && <Ionicons name="checkmark" size={20} color="#3A9CFF" />}
                </TouchableOpacity>
              </>
            )}

            {repeatStep === 3 && (
              <>
                <View 
                  style={{
                    marginTop: 10,
                    opacity: repeatEndDateMode === 'date' ? 1 : 0.3
                  }}
                  pointerEvents={repeatEndDateMode === 'date' ? 'auto' : 'none'}
                >
                  <RepeatPicker 
                    itemHeight={40}
                    onTimeChange={handleRepeatChange}
                    initValue={
                      (repeatEndDate && repeatEndDate.includes('.')) ? {
                        year: repeatEndDate.split('.')[0],
                        month: repeatEndDate.split('.')[1],
                        day: repeatEndDate.split('.')[2]
                      } : undefined
                    }
                  />
                </View>
              </>
            )}

            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20}}>
              <TouchableOpacity style={{marginRight: 20}} onPress={() => setRepeatPickerVisible(false)}>
                <NoScaleText style={{color: 'gray', fontSize: 16}}>취소</NoScaleText>
              </TouchableOpacity>
              
              {repeatStep === 3 ? (
                 <TouchableOpacity onPress={handleConfirmRepeat}>
                    <NoScaleText style={{color: '#3A9CFF', fontSize: 16}}>완료</NoScaleText>
                 </TouchableOpacity>
              ) : (
                 <TouchableOpacity onPress={handleRepeatNext}>
                    <NoScaleText style={{color: '#3A9CFF', fontSize: 16}}>
                       {
                         (repeatStep === 1 && repeatDays.length === 0) || 
                         (repeatStep === 2 && repeatEndDateMode === 'none') 
                         ? "완료" : "다음"
                       }
                    </NoScaleText>
                 </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal transparent={true} animationType="fade" visible={isTagVisible} onRequestClose={() => setTagVisible(false)} statusBarTranslucent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.baseBackdrop, { justifyContent: 'center', alignItems: 'center' }]}>
           <TouchableOpacity style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}} activeOpacity={1} onPress={() => setTagVisible(false)} />

           <View style={[styles.modalContent, { width: '80%', maxHeight: '70%'}]}>
              <NoScaleText style={{color: '#000000', fontSize: 20, alignItems: 'left', marginBottom: 15}}>태그</NoScaleText>
              
              <ScrollView>
                {tags.map((tag) => (
                   <View key={tag.id} style={{marginBottom: 15}}>
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                         <TouchableOpacity onPress={() => handleToggleTag(tag.id)} style={{flexDirection: 'row', alignItems: 'center'}}>
                            <MaterialIcons name={tag.selected ? "label" : "label-outline"} size={20} color={tag.selected ? "#3A9CFF" : "gray"} />
                            <NoScaleText style={{marginLeft: 10, fontSize: 16, color: tag.selected ? "#3A9CFF" : "#000"}}>{tag.name}</NoScaleText>
                         </TouchableOpacity>
                      </View>

                      {tag.subTags.map(sub => (
                         <View key={sub.id} style={{flexDirection: 'row', alignItems: 'center', marginLeft: 30, marginTop: 8}}>
                            <TouchableOpacity onPress={() => handleToggleTag(sub.id, true, tag.id)} style={{flexDirection: 'row', alignItems: 'center'}}>
                               <MaterialIcons name={sub.selected ? "label" : "label-outline"} size={18} color={sub.selected ? "#3A9CFF" : "gray"} />
                               <NoScaleText style={{marginLeft: 10, fontSize: 14, color: sub.selected ? "#3A9CFF" : "#555"}}>{sub.name}</NoScaleText>
                            </TouchableOpacity>
                         </View>
                      ))}

                      <View style={{marginLeft: 30, marginTop: 8}}>
                        {addTagMode.type === 'child' && addTagMode.parentId === tag.id ? (
                           <View style={{flexDirection: 'row', alignItems: 'center'}}>
                              <NoScaleTextInput 
                                 style={styles.tagInput} 
                                 placeholder="하위 태그 이름" 
                                 autoFocus 
                                 value={newTagText}
                                 onChangeText={setNewTagText}
                                 onSubmitEditing={saveNewTag}
                              />
                              <TouchableOpacity onPress={saveNewTag}>
                                 <Ionicons name="checkmark-circle" size={24} color="#3A9CFF" style={{marginLeft: 5}} />
                              </TouchableOpacity>
                           </View>
                        ) : (
                           <TouchableOpacity onPress={() => startAddTag('child', tag.id)}>
                              <NoScaleText style={{color: '#3A9CFF', fontSize: 12}}>+ 하위 태그 추가</NoScaleText>
                           </TouchableOpacity>
                        )}
                      </View>
                   </View>
                ))}
              </ScrollView>

              <View style={{marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee'}}>
                  {addTagMode.type === 'parent' ? (
                     <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <NoScaleTextInput 
                           style={styles.tagInput} 
                           placeholder="새 태그 이름" 
                           autoFocus 
                           value={newTagText}
                           onChangeText={setNewTagText}
                           onSubmitEditing={saveNewTag}
                        />
                        <TouchableOpacity onPress={saveNewTag}>
                           <Ionicons name="checkmark-circle" size={24} color="#3A9CFF" style={{marginLeft: 5}} />
                        </TouchableOpacity>
                     </View>
                  ) : (
                     <TouchableOpacity onPress={() => startAddTag('parent')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="add" size={20} color="#3A9CFF" />
                        <NoScaleText style={{color: '#3A9CFF', fontSize: 16, marginLeft: 5}}>태그 추가</NoScaleText>
                     </TouchableOpacity>
                  )}
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
              <TouchableOpacity 
                style={[styles.modalButton,{marginRight: 15}]}
                onPress={handleCancelTag}
              >
                <NoScaleText style={{color: '#595959', fontSize: 16}}>취소</NoScaleText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton,{marginRight: 15}]}
                onPress={handleConfirmTag}
              >
                <NoScaleText style={{color: '#3A9CFF', fontSize: 16}}>확인</NoScaleText>
              </TouchableOpacity>
            </View>
           </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal transparent={true} animationType='fade' visible={isEditorVisible} onRequestClose={handleWriteCancel}
        statusBarTranslucent>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >

          <TouchableOpacity 
            style={[styles.baseBackdrop, { justifyContent: 'center', alignItems: 'center' }]} 
            activeOpacity={1} 
            onPress={handleWriteCancel}>
          
            <View style={styles.editorContent}>
              {editItem && (
                <>
                  <NoScaleTextInput
                    value={editItem.title}
                    onChangeText={(text) => setEditItem(prev => ({...prev, title: text}))}
                    placeholder="새 할 일"
                    style={styles.editorInput}
                    autoFocus={true}
                  />
                  
                  <View style={styles.editorButtonRow}>
                    <TouchableOpacity onPress={handleOpenTag} style={[styles.editorBtn, editItem.tag && {backgroundColor: '#3A9CFF'}]}>
                      <MaterialIcons name="label-outline" size={15} color={editItem.tag ? "white" : "gray"}/>
                      <NoScaleText style={[styles.editorText, editItem.tag && {color: 'white'}]}>
                        {getTagLabel(editItem.tag)}
                      </NoScaleText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleOpenCalendar} style={[styles.editorBtn, editItem.date && {backgroundColor: '#3A9CFF'}]}>
                      <Ionicons name="calendar-clear-outline" size={15} color={editItem.date ? "white" : "gray"}/>
                      <NoScaleText style={[styles.editorText, editItem.date && {color: 'white'}]}>
                          {editItem.date ? editItem.date.substring(2) : '날짜'}
                      </NoScaleText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleOpenAlarm} style={[styles.editorBtn, editItem.remind && {backgroundColor: '#3A9CFF'}]}>
                      <Ionicons name="notifications-outline" size={15} color={editItem.remind ? "white" : "gray"}/>
                      <NoScaleText style={[styles.editorText, editItem.remind && {color: 'white'}]}>
                        {getAlarmLabel(editItem.remind)}
                      </NoScaleText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleOpenRepeat} style={[styles.editorBtn, editItem.repeated && {backgroundColor: '#3A9CFF'}]}>
                      <Ionicons name="repeat-outline" size={15} color={editItem.repeated ? "white" : "gray"}/>
                      <NoScaleText style={[styles.editorText, editItem.repeated && {color: 'white'}]}>
                        {getRepeatLabel(editItem.repeated)}
                      </NoScaleText>
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity onPress={handleSaveTodo} style={{alignItems: 'center', marginTop:5}}>
                      <NoScaleText style={{fontSize: 15, width: '90%', backgroundColor: '#3A9CFF', borderRadius: 30, textAlign: 'center', padding: 5, color: '#ffffff',}}>
                        완료
                      </NoScaleText>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {!isDelete && (
        <TouchableOpacity onPress={handleShowEditor} style={styles.fab}>
          <Ionicons name="add" size={40} color="white"/>
        </TouchableOpacity>
      )}

      </SafeAreaView>
  )
}

// 스타일
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 8,

    //iOS 그림자 속성
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    //Android 그림자 속성
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButton: {
    fontSize: 16,
    color: '#3A9CFF',
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 10,
  },
  statusBox: {
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 5,
  },
  statusTitle: { fontSize: 18, color: 'black' },
  statusCount: { fontSize: 28, fontWeight: 'bold', color: '#3A9CFF', marginVertical: 4 },
  statusSubText: { fontSize: 12, color: 'gray' },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    zIndex: 2000,
  },
  filterContainer: {
    position: 'relative',
    zIndex: 2000, 
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: 14,
    color: '#888',
    marginLeft: 15,
    marginBottom: 5,
  },
  filterDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  filterSubOption: {
    paddingVertical: 8,
    paddingLeft: 48,
    paddingRight: 20,
  },
  filterText: {
    fontSize: 15,
    color: '#333',
  },
  filterSubText: {
    fontSize: 14,
    color: '#555',
  },
  filterBackdrop: {
    flex: 1,
    paddingTop: 190, 
    paddingLeft: 20,
  },
  filterModalContainer: {
    position: 'absolute',
    top: 345, 
    left: 36,
  },
  filterContent: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
    paddingTop: 15,
  },
  sortContainer: {
    position: 'relative',
    minWidth: 90,
    zIndex: 1000,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EBEBEB', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  dropdownFull: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EBEBEB',
    borderRadius: 15,
    overflow: 'hidden',

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EBEBEB',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  selectedItem: {
    backgroundColor: 'white',
  },
  sortText: {
    fontSize: 12,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  itemIcon: {
    padding: 4, 
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
  },
  itemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#AAAAAA',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A9CFF',
    borderRadius: 30,
    elevation: 8,
  },
  modalButton: {
    paddingVertical: 12,
  },
  emptyContainer: {
    padding: 32,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  editorContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
  },
  editorInput: {
    fontSize: 15,
    padding: 10,
    backgroundColor: '#E7E7E7',
    borderRadius: 30,
  },
  editorButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    alignItems: 'center',
  },
  editorBtn: {
    backgroundColor: '#E7E7E7',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 30,
    padding: 10,
    marginLeft: 2,
    marginRight: 2,
    alignItems: 'center',
  },
  editorText: {
    marginLeft: 5,
    textAlign: 'center',
    fontSize: 13
  },
  calendarModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  repeatOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  tagInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#3A9CFF',
    paddingVertical: 4,
    fontSize: 14,
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: 400, // 최소 높이 설정
    width: '100%',
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  baseBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetTagContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 5,
  },
  sheetTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sheetTitleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
    color: '#333',
  },
  sheetDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
  },
  metaInfoContainer: {
    gap: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  metaText: {
    fontSize: 15,
    color: '#555',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
    color: '#333',
  },
  filterDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 5,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterSubOption: {
    paddingVertical: 8,
    paddingLeft: 48,
    paddingRight: 20,
  },
  filterText: {
    fontSize: 15,
    color: '#333',
  },
  filterSubText: {
    fontSize: 14,
    color: '#555',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  menuPopup: {
    position: 'absolute',
    top: 30,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 15,
    color: '#333',
  },
  subStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingLeft: 16,
  },
  subStepText: {
    fontSize: 15,
    marginLeft: 8,
    color: '#333',
  },
  subStepInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#3A9CFF',
    paddingBottom: 2,
  },
  subStepInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
    paddingLeft: 4,
  },
  addSubStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 5,
    paddingLeft: 2,
  },
  subStepItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 45,
    marginBottom: 5
  },
  subStepItemText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
});