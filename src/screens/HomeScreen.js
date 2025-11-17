import React, { useState } from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import ProgressBar from 'react-native-progress/Bar';

function HomeHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.profileArea}>
        <Image/>
        <Ionicons name="person" size={24} color='gray' style={styles.profileImage}/>
        <View style={styles.profileText}>
          <NoScaleText style={{fontSize: 10}}>처음 날개 단 병아리!</NoScaleText>
          <NoScaleText>User님 환영합니다!</NoScaleText>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ProgressBar progress={0.5} width={200} style={{marginRight: 5}} />
            <NoScaleText style={{fontSize: 9, color: "#8D8D8D"}}>150/300px</NoScaleText>
          </View>
        </View>
      </View>

      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={24} color="#3A9CFF"/>
      </TouchableOpacity>
    </View>
  );
}

function MonthCalendar({selectedDate, onDateSelect, today}){
  const marked = {};

  if(selectedDate){
    const isSelected = selectedDate === today;

    marked[selectedDate] = {
      customStyles: {
        container: { 
          backgroundColor: isSelected ? '#3A9CFF' : '#D9D9D9',
          borderRadius: 16,
          width: 32,
          height: 32,
          justifyContent: 'center',
          alignItems: 'center',
        },
        text: { 
          color: isSelected ? 'white' : 'black'
        }
      }
    }
  };
  
  return(
    <View style={styles.calCard}>
      <Calendar
        markingType={'custom'}
        markedDates={marked}
        onDayPress={(day => onDateSelect(day.dateString))}
        theme={{
          arrowColor: '#5D87FF',
          todayTextColor: '#5D87FF', 
        }}>

      </Calendar>
    </View>
  )
}

function StateList(){
  let [current, setCurrent] = useState(15);
  let [total, setTotal] = useState(30);
  let progress = total > 0 ? current / total : 0;
  let widthStatus = progress * 100 + '%';

  return(
    <View style={{marginBottom: 16}}>
      <View style={styles.statusArea}>
        <View style={[styles.statusBar, {width: widthStatus}]}>
          <View style={styles.circle}>
            <NoScaleText style={{color: "black", padding: 5, fontSize: 10}}>{current}/{total}</NoScaleText>
          </View>
        </View>
      </View>
      <View style={{alignItems: 'flex-end', marginHorizontal: 16}}>
        <TouchableOpacity style={{margin: 5, flexDirection: 'row', alignItems: 'center'}}>
          <NoScaleText style={{color: "#3A9CFF", fontSize: 12}}>통계 보러가기</NoScaleText>
          <Ionicons name="arrow-forward" size={10} color="#3A9CFF"/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function TodayList(){
  return(
    <View style={styles.card}>
      <View>
        <NoScaleText style={{fontWeight: "bold"}}>Today</NoScaleText>

      </View>
    </View>
  )
}

export default function HomeScreen(){
  const[selectedDate, setselectedDate] = useState('');

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');

  const today_date = `${year}-${month}-${date}`;

  const dateSelect = (dateString) => {
    if(dateString === selectedDate){
      Alert.alert(dateString, 'Todo', [
        {
          text: '취소',
          styles: 'cancel'
        },
        {
          text: '저장',
          style: 'destructive'
        }
      ]);
    }
    else{
      setselectedDate(dateString);
    }
  };

  return(
    <SafeAreaProvider>
      <SafeAreaView style={styles.allArea}>
        <ScrollView>
          <HomeHeader/>
          <MonthCalendar
            selectedDate={selectedDate} onDateSelect={dateSelect} today={today_date}/>
          <StateList/>
          <TodayList/>
      </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
    
  );
}

const styles = StyleSheet.create({
  allArea: {
    flex: 0,
    backgroundColor: "#FFFFFF"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    marginTop: 10
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImage: {
    padding: 10,
    marginRight: 10
  },
  profileText: {
    flexDirection: 'column',
    marginRight: 10
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    minHeight: 200,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    elevation: 3,
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  calCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    minHeight: 200,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    elevation: 3,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    overflow: 'hidden'
  },
  statusArea: {
    backgroundColor: '#F9F9F9',
    borderRadius: 60,
    padding: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    elevation: 3,
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  statusBar: {
    backgroundColor: '#3A9CFF',
    borderRadius: 50,
    padding: 5
  },
   circle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center'
  }
});