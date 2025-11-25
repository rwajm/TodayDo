import { View, Text, StyleSheet } from 'react-native';
import WheelPicker from './WheelPicker';
import React, { useState, useMemo, useRef, useEffect } from 'react';

const CustomTimePicker = ({ onTimeChange, itemHeight, initValue }) => {
  const cycleItems = ['분', '시간', '일']
  const setItems = ['전', '마다']

  const { time, cycle, set } = initValue || {};
  
  // useRef를 사용하여 각 휠의 현재 값을 저장
  const [selectedTime, setSelectedTime] = useState(time || '01');
  const [selectedCycle, setSelectedCycle] = useState(cycle || '분');
  const [selectedSet, setSelectedSet] = useState(set || '전');

  const timeItems = useMemo(() => {
    let max = 59;
    if(selectedCycle === '시간') max = 23;
    if(selectedCycle === '일') max = 31;

    return Array.from({ length: max }, (_, i) => (i + 1).toString().padStart(2, '0'));
  }, [selectedCycle]);

  const handleIndexChange = (category, item) => {
    let nextTime = selectedTime;
    let nextCycle = selectedCycle;
    let nextSet = selectedSet;

    switch (category) {
      case 'time':
        setSelectedTime(item);
        nextTime = item;
        break;
      case 'cycle':
        setSelectedCycle(item);
        nextCycle = item;

        setSelectedTime('01'); 
        nextTime = '01';
        break;
      case 'set':
        setSelectedSet(item);
        nextSet = item;
        break;
      default:
        throw new Error('Invalid time category');
    }
    // 값이 변경될 때마다 부모 컴포넌트로 전달
    onTimeChange({
      time: nextTime,
      cycle: nextCycle,
      set: nextSet,
    });
  };

  return (
    <View style={[styles.container, { height: itemHeight * 2 }]}>
      <WheelPicker
        key={`time-${selectedCycle}`}
        items={timeItems}
        onItemChange={(item) => handleIndexChange('time', item)}
        itemHeight={itemHeight}
        initValue={time || '01'}
        containerStyle={{ width: 80, marginHorizontal: 10 }}
      />
      <WheelPicker
        key="cycle-picker"
        items={cycleItems}
        onItemChange={(item) => handleIndexChange('cycle', item)}
        itemHeight={itemHeight}
        initValue={cycle || '분'}
        containerStyle={{ width: 80, marginHorizontal: 10 }}
      />
      <WheelPicker
        key="set-picker"
        items={setItems}
        onItemChange={(item) => handleIndexChange('set', item)}
        itemHeight={itemHeight}
        initValue={set || '전'}
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
    marginTop: 10,
    marginBottom: 20
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