import React, { useState, useMemo } from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DATA = [
  {id: '1', title: '루틴 1', date: '2025.11.11', completed: false, important: false, remind: true, repeated: true},
  {id: '2', title: '루틴 2', date: '2025.11.10', completed: false, important: false, remind: false, repeated: true},
  {id: '3', title: '루틴 3', date: '2025.11.12', completed: false, important: false, remind: true, repeated: false},
  {id: '4', title: '루틴 4', date: '2025.11.08', completed: false, important: false, remind: false, repeated: false},
  {id: '5', title: '루틴 5', date: '2025.11.22', completed: false, important: false, remind: true, repeated: false},
  {id: '6', title: '루틴 6', date: '2025.12.08', completed: false, important: false, remind: false, repeated: false},
  {id: '7', title: '루틴 7', date: '2025.10.09', completed: false, important: false, remind: false, repeated: false},
  {id: '8', title: '루틴 8', date: '2025.12.03', completed: false, important: false, remind: false, repeated: false},
  {id: '9', title: '루틴 9', date: '2025.10.15', completed: false, important: false, remind: true, repeated: false},
  {id: '10', title: '루틴 10', date: '2025.12.11', completed: false, important: false, remind: false, repeated: false},
  {id: '11', title: '루틴 11', date: '2025.12.11', completed: false, important: false, remind: false, repeated: false},
  {id: '12', title: '루틴 12', date: '2025.10.09', completed: false, important: false, remind: false, repeated: false},
  {id: '13', title: '루틴 13', date: '2025.10.09', completed: false, important: false, remind: false, repeated: false},
  {id: '14', title: '루틴 14', date: '2025.08.12', completed: false, important: false, remind: true, repeated: false},
  {id: '15', title: '루틴 15', date: '2025.09.08', completed: false, important: false, remind: false, repeated: false},
  ] 

function RoutineItem({item, isDelete, isSelected, onComplete, onImportant, onPress, onLongPress}){
  const checkboxIcon = isDelete ? (isSelected ? 'checkbox':'square-outline')
    : (item.completed? 'checkmark-circle':'radio-button-off');
  const checkboxColor = isDelete ? (isSelected ? '#E50000':'gray')
    : (item.completed ? 'gray':'#3A9CFF');
  
  const completedColor = item.completed ? 'gray' : '#3A9CFF';
  const starColor = item.completed ? 'gray' : (item.important ? '#3A9CFF' : 'gray');

  return(
    <TouchableOpacity style={styles.itemRow} onPress={onPress} onLongPress={onLongPress}>
      <TouchableOpacity onPress={isDelete ? onPress : onComplete}>
        <Ionicons name={checkboxIcon} size={24} color={checkboxColor}/>
      </TouchableOpacity>

      <View style={styles.itemTextContainer}>
        <View style={styles.itemTitleRow}>
          <NoScaleText style={[styles.itemTitle, item.completed&&styles.itemTitleCompleted, {marginRight: 7}]}>{item.title}</NoScaleText>
          {item.remind && (
            <MaterialCommunityIcons name="bell" size={10} color={completedColor} style={{marginRight: 5}}/>
          )}
          {item.repeated && (
            <MaterialCommunityIcons name="repeat" size={10} color={completedColor} style={{marginRight: 5}} />
          )}
        </View>
        <NoScaleText style={[styles.itemTitle, item.completed&&styles.itemTitleCompleted]}>{item.date}</NoScaleText>
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
  )
}

function RoutineHeader({
  isDelete, selectCount, onCancelDelete, onDeleteSelected, remainderCount, onShowFilter, onShowSort, sortOrderText, currentMonth, onPrevMonth, onNextMonth}){
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
          <NoScaleText style={styles.statusTitle}>남은 루틴</NoScaleText>
          <NoScaleText style={styles.statusCount}>{remainderCount}개</NoScaleText>
          <NoScaleText style={styles.statusSubText}>잘 하고 있어요!</NoScaleText>
        </View>

        <View style={styles.separator} />

        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={onShowFilter} style={styles.filterButton}>
            <Ionicons name="filter" size={18} color="gray"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={onShowSort} style={styles.sortButton}>
            <NoScaleText style={styles.sortText}>{sortOrderText}</NoScaleText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

export default function RoutineScreen(){
  const [routine, setRoutine] = useState(DATA);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(new Set());
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState('최신등록순');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isEditorVisible, setEditorVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const routineComplete = (id) => {
    setRoutine(prevRoutine =>
      prevRoutine.map(routine =>
        routine.id === id ? {...routine, completed: !routine.completed} : routine
      )
    );
  };

  const routineImportant = (id) => {
    setRoutine(prevRoutine =>
      prevRoutine.map(routine =>
        routine.id === id ? {...routine, important: !routine.important} : routine
      )
    );
  };

  const routineSelect = (id) => {
    const newSelectedId = new Set(selectedId);
    if(newSelectedId.has(id)){
      newSelectedId.delete(id);
    }
    else{
      newSelectedId.add(id);
    }
    setSelectedId(newSelectedId);
  };

  const itemLongPress = (id) => {
    setIsDelete(true);
    routineSelect(id);
  };

  const itemPress = (item) => {
    if(isDelete){
      routineSelect(item.id);
    }
    else{
      Alert.alert(
        `'${item.title}'`,
        '상세보기/수정 기능 구현 중'
      );
    }
  };

  const cancleDelete = () => {
    setIsDelete(false);
    setSelectedId(new Set());
  };

  const deleteSelected = () => {
    Alert.alert(
      "삭제",
      '삭제 하시겠습니까?',
      [
        {text: "닫기", style: "cancel"},
        {text: "삭제", style: "destructive",
          onPress: () => {
            setRoutine(prevRoutine => prevRoutine.filter(routine => !selectedId.has(routine.id)));
            cancleDelete();
          }
        }
      ]
    );
  };

  const {filterSortedRoutine, remainderCount} = useMemo(() => {
    const parsedDate = (dateString) => {
      const reDate = dateString.replace(/\./gi, '-');
      return new Date(reDate);
    }

    const filterMonth = routine.filter(item => {
      const itemDate = parsedDate(item.date);
      return itemDate.getFullYear() === currentMonth.getFullYear() && itemDate.getMonth() === currentMonth.getMonth();
    });

    const uncompleted = filterMonth.filter(item => !item.completed);
    const completed = filterMonth.filter(item => item.completed);

    if(sortOrder === '기한순') {
      uncompleted.sort((a, b) => parsedDate(a.date) - parsedDate(b.date));
    }
    else if(sortOrder === '최신등록순'){
      uncompleted.sort((a, b) => Number(b.id) - Number(a.id));
    }

    const count = uncompleted.length;

    return{
      filterSortedRoutine: [...uncompleted, ...completed],
      remainderCount: count
    };
  }, [routine, sortOrder, currentMonth]);

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

  const handleCloseEditor = () => {
    setEditorVisible(false);
    setEditItem(null);
  }

  const handleSaveRoutine = () => {
    handleCloseEditor();
  }

  const handleDateSelect = (day) => {
    if (editItem) {
      setEditItem(prev => ({
        ...prev,
        date: day.dateString.replace(/-/g, '.')
      }));
    }
    setCalendarVisible(false);
    setTimePickerVisible(true);
  }

  const handleCheckTime = (selectedTime) => {
    const hour = String(selectedTime.getHours()).padStart(2, '0');
    const minute = String(selectedTime.getMinutes()).padStart(2, '0');
    const timeString = `${hour}:${minute}`;

    if(editItem){
      setEditItem(prev => ({
        ...prev,
        date: prev.date.split(' ')[0] + `${timeString}`
      }));
    }
    setTimePickerVisible(false);
  }

  const handleCancelTimePicker = () => {
    setTimePickerVisible(false);
  }

  const handleShowEditor = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    const today_date = `${year}.${month}.${date}`;

    const newRoutine = {
      id: String(Date.now()), 
      title: '',
      date: today_date,
      completed: false, important: false, remind: false, repeated: false
    };
    setEditItem(newRoutine);
    setEditorVisible(true);
  };

  return(
    <SafeAreaView  style={styles.screen}>
      <View style={styles.container}>

        <FlatList
          data={filterSortedRoutine}
          keyExtractor={item => item.id}

          ListHeaderComponent={
            <RoutineHeader 
              isDelete={isDelete}
              selectCount={selectedId.size}
              onCancelDelete={cancleDelete}
              onDeleteSelected={deleteSelected}
              remainderCount={remainderCount}
              onShowFilter={()=>setFilterVisible(true)}
              onShowSort={()=>setSortVisible(true)}
              sortOrderText={sortOrder}
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          }

          renderItem={({item}) => (
            <RoutineItem
              item={item}
              isDelete={isDelete}
              isSelected={selectedId.has(item.id)}
              onComplete={()=>routineComplete(item.id)}
              onImportant={()=>routineImportant(item.id)}
              onPress={() => itemPress(item)}
              onLongPress={() => itemLongPress(item.id)}
            />
          )}

          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <NoScaleText style={styles.emptyText}>
                아직 루틴이 없습니다.{'\n'}
                아래 +버튼을 눌러 추가해보세요!</NoScaleText>
            </View>
          }
        />
      </View>

      <Modal transparent={true} visible={sortVisible} onRequestClose={() => setSortVisible(false)}>
        <TouchableOpacity activeOpacity={1} onPressOut={() => setSortVisible(false)} style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <NoScaleText style={styles.modalTitle}>정렬</NoScaleText>
            <TouchableOpacity onPress={() => itemSort('최신등록순')} style={styles.modalButton}>
              <NoScaleText>최신등록순</NoScaleText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => itemSort('기한순')} style={styles.modalButton}>
              <NoScaleText>기한순</NoScaleText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        statusBarTranslucent
        transparent={true}
        visible={isCalendarVisible}
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)} >

        <View style={styles.modalBackdrop}>
          <View style={styles.calendarModalContent}>
            <Calendar
              onDayPress={handleDateSelect}
              current={editItem?.date.split(' ')[0].replace(/\./g, '-')} />
          </View>
        </View>
      </Modal>

      <Modal 
          transparent={true} 
          visible={isTimePickerVisible} 
          animationType="fade"
          onRequestClose={() => setTimePickerVisible(false)}
        >
            <View style={styles.modalContent}>
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode='time'
                is24Hour={true}
                onConfirm={handleCheckTime}
                onCancel={handleCancelTimePicker}
              />
            </View>
        </Modal>

      <Modal transparent={true} animationType='fade' visible={isEditorVisible} onRequestClose={handleCloseEditor}
        statusBarTranslucent>
          <KeyboardAvoidingView
            style={styles.editorBackdrop} >

          <TouchableOpacity 
            style={{flex: 1}} 
            activeOpacity={1} 
            onPress={handleCloseEditor} 
          />
          
            <View style={styles.editorContent}>
              {editItem && (
                <>
                  <NoScaleTextInput
                    value={editItem.title}
                    onChangeText={(text) => setEditItem(prev => ({...prev, title: text}))}
                    placeholder="새 루틴"
                    style={styles.editorInput}
                    autoFocus={true}
                  />
                  
                  <View style={styles.editorButtonRow}>
                    <TouchableOpacity onPress={() => alert('태그')} style={styles.editorBtn}>
                      <MaterialIcons name="label-outline" size={15} color="gray"/>
                      <NoScaleText style={styles.editorText}>태그</NoScaleText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCalendarVisible(true)} style={styles.editorBtn}>
                      <Ionicons name="calendar-clear-outline" size={15} color="gray"/>
                      <NoScaleText style={styles.editorText}>날짜</NoScaleText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert('알림')} style={styles.editorBtn}>
                      <Ionicons name="notifications-outline" size={15} color="gray"/>
                      <NoScaleText style={styles.editorText}>알림</NoScaleText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert('반복')} style={styles.editorBtn}>
                      <Ionicons name="repeat-outline" size={15} color="gray"/>
                      <NoScaleText style={styles.editorText}>반복</NoScaleText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSaveRoutine}>
                      <Ionicons name="checkmark-circle" size={35} color="#CDCDCD"/>
                    </TouchableOpacity>
                  </View>
                </>
              )}
          </View>
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
  headerContainer: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
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
    paddingHorizontal: 16,
    marginTop: 10,
  },
  filterButton: {
    padding: 6,
    backgroundColor: 'lightgray',
    borderRadius: 20,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sortText: {
    marginHorizontal: 4,
    fontSize: 14,
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
  itemDate: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    minWidth: 200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
  editorBackdrop: {
    flex: 1,
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },
  editorContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  }
});