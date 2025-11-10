import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Alert, Modal } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'

const DATA = [
  {id: '1', title: '할일 1', date: '2025.11.11', completed: false, important: false, remind: false, repeated: false},
  {id: '2', title: '할일 2', date: '2025.11.10', completed: false, important: false, remind: false, repeated: false},
  {id: '3', title: '할일 3', date: '2025.11.12', completed: false, important: false, remind: false, repeated: false},
  {id: '4', title: '할일 4', date: '2025.11.08', completed: false, important: false, remind: false, repeated: false},
  {id: '5', title: '할일 5', date: '2025.11.09', completed: false, important: false, remind: false, repeated: false}
]

function TodoItem({item, isDelete, isSelected, onComplete, onImportant, onPress, onLongPress}){
  const checkboxIcon = isDelete ? (isSelected ? 'check-box':'check-box-outline-blank')
    : (item.completed? 'checkmark-circle':'radio-button-off');
  const checkboxColor = isDelete ? (isSelected ? '#E50000':'gray')
    : (item.completed ? 'gray':'#3A9CFF');
  
  return(
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <TouchableOpacity onPress={isDelete ? onPress : onComplete}>
        <Ionicons name={checkboxIcon} size={24} color={checkboxColor}/>
      </TouchableOpacity>

      <View>
        <View>
          <Text>{item.title}</Text>
          {item.remind && !item.completed && (
            <MaterialCommunityIcons name="bell" size={10} color="#3A9CFF" />
          )}
          {item.repeated && !item.completed && (
            <MaterialCommunityIcons name="bell" size={10} color="#3A9CFF" />
          )}
        </View>
        <Text>{item.date}</Text>
      </View>

      {!isDelete && (
        <TouchableOpacity onPress={onImportant}>
          <Ionicons
            name={item.important ? 'star':'star-outline'}
            size={24}
            color={item.important ? '#3A9CFF':'gray'}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}

function TodoHeader({
  isDelete, selectCount, onCancelDelete, onDeleteSelected, remainderCount, onShowFilter, onShowSort, sortOrderText}){
    if(isDelete){
      return(
        <View>
          <TouchableOpacity onPress={onCancelDelete}>
            <Text>취소</Text>
          </TouchableOpacity>
          <Text>{selectCount}개 선택됨</Text>
          <TouchableOpacity onPress={onDeleteSelected}>
            <Text style={{color: 'red'}}>삭제</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return(
      <View>
        <View>
          <Text>남은 할 일</Text>
          <Text>{remainderCount}개</Text>
          <Text>잘 하고 있어요!</Text>
        </View>
        <View>
          <TouchableOpacity onPress={onShowFilter}>
            <Ionicons name="filter" size={18} color="gray"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={onShowSort}>
            <Text>{sortOrderText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

export default function TodoScreen(){
  const [todo, setTodo] = useState(DATA);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(new Set());
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState('최신등록순');

  const todoComplete = (id) => {
    setTodo(prevTodo =>
      prevTodo.map(todo =>
        todo.id === id ? {...todo, completed: !todo.completed} : todo
      )
    );
  };

  const todoImportant = (id) => {
    setTodo(prevTodo =>
      prevTodo.map(todo =>
        todo.id === id ? {...todo, important: !todo.important} : todo
      )
    );
  };

  const todoSelect = (id) => {
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
    todoSelect(id);
  };

  const itemPress = (item) => {
    if(isDelete){
      todoSelect(item.id);
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
            setTodo(prevTodo => prevTodo.filter(todo => !selectedId.has(todo.id)));
            cancleDelete();
          }
        }
      ]
    );
  };

  const sortTodo = useMemo(() => {
    const newSortList = [...todo];

    if(sortOrder === '기한순') {
      const parsedDate = (dateString) => {
        const reDate = dateString.replace(/\./gi, '-');
        return new Date(reDate);
      }
      newSortList.sort((a, b) => parsedDate(a.date) - parsedDate(b.date));
    }
    else if(sortOrder === '최신등록순'){
      newSortList.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return newSortList;
  }, [todo, sortOrder]);

  const itemSort = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setSortVisible(false);
  };

  const remainderCount = todo.filter(todo => !todo.completed).length;

  return(
    <SafeAreaView>
      <TodoHeader
        isDelete={isDelete}
        selectCount={selectedId.size}
        onCancelDelete={cancleDelete}
        onDeleteSelected={deleteSelected}
        remainderCount={remainderCount}
        onShowFilter={()=>setFilterVisible(true)}
        onShowSort={()=>setSortVisible(true)}
        sortOrderText={sortOrder}
      />

      <FlatList
        data={sortTodo}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TodoItem
            item={item}
            isDelete={isDelete}
            isSelected={selectedId.has(item.id)}
            onComplete={()=>todoComplete(item.id)}
            onImportant={()=>todoImportant(item.id)}
            onPress={() => itemPress(item)}
            onLongPress={() => itemLongPress(item.id)}
          />
        )}
      />

      <Modal transparent={true} visible={sortVisible} onRequestClose={() => setSortVisible(false)}>
        <TouchableOpacity activeOpacity={1} onPressOut={() => setSortVisible(false)}>
          <View>
            <Text>정렬</Text>
            <TouchableOpacity onPress={() => itemSort('최신등록순')}>
              <Text>최신등록순</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => itemSort('기한순')}>
              <Text>기한순</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {!isDelete && (
        <TouchableOpacity onPress={() => alert('새 Todo 추가')}>
          <Ionicons name="add-circle" size={32} color="#3A9CFF"/>
        </TouchableOpacity>
      )}

      
      </SafeAreaView>
  )
}