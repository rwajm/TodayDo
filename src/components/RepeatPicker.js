import { View, Text, StyleSheet } from 'react-native';
import WheelPicker from './WheelPicker';
import React, { useState, useMemo, useRef, useEffect } from 'react';

const CustomTimePicker = ({ onTimeChange, itemHeight, initValue }) => {
  const today = new Date();
  const todayYear = today.getFullYear().toString();
  const todayMonth = (today.getMonth()+1).toString().padStart(2, '0');
  const todayDay = today.getDate().toString().padStart(2, '0');

  const currentYear = today.getFullYear();
  const yearItems = useMemo(() => {
    const startYear = currentYear - 10;
    return Array.from({length: 21}, (_, i) => (startYear + i).toString());
  }, [currentYear]);

  const monthItems = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  
  const { year, month, day } = initValue || {};
  
  const [selectedYear, setSelectedYear] = useState(year || todayYear);
  const [selectedMonth, setSelectedMonth] = useState(month || todayMonth);
  const [selectedDay, setSelectedDay] = useState(day || todayDay);

  const dayItems = useMemo(() => {
    const dayMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
    return Array.from({ length: dayMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
  }, [selectedYear, selectedMonth]);

  const handleIndexChange = (category, item) => {
    let currentYear = selectedYear;
    let currentMonth = selectedMonth;
    let currentDay = selectedDay;

    switch (category) {
      case 'year':
        currentYear = item;
        setSelectedYear(item);
        break;
      case 'month':
        currentMonth = item;
        setSelectedMonth(item);
        break;
      case 'day':
        currentDay = item;
        setSelectedDay(item);
        break;
      default:
        throw new Error('Invalid time category');
    }
    // 값이 변경될 때마다 부모 컴포넌트로 전달

    const maxDay = new Date(parseInt(currentYear), parseInt(currentMonth), 0).getDate();
    if(parseInt(currentDay) > maxDay){
      currentDay = maxDay.toString().padStart(2, '0');
      setSelectedDay(currentDay);
    }

    if(onTimeChange){
      onTimeChange({
      year: currentYear,
      month: currentMonth,
      day: currentDay,
    });
    }
  };

  return (
    <View style={[styles.container, { height: itemHeight * 2 }]}>
      <WheelPicker
        items={yearItems}
        onItemChange={(item) => handleIndexChange('year', item)}
        itemHeight={itemHeight}
        initValue={year || todayYear}
        containerStyle={{ width: 80, marginHorizontal: 10 }}
      />
      <WheelPicker
        items={monthItems}
        onItemChange={(item) => handleIndexChange('month', item)}
        itemHeight={itemHeight}
        initValue={month || todayMonth}
        containerStyle={{ width: 80, marginHorizontal: 10 }}
      />
      <WheelPicker
        items={dayItems}
        onItemChange={(item) => handleIndexChange('day', item)}
        itemHeight={itemHeight}
        initValue={selectedDay}
        containerStyle={{ width: 80, marginHorizontal: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  colonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  colon: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: '#EEEEEE',
    left: 0,
    right: 0,
    zIndex: -1,
    borderRadius: 10,
  },
});

export default CustomTimePicker;