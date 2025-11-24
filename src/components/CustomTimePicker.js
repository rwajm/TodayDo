import { View, Text, StyleSheet } from 'react-native';
import WheelPicker from './WheelPicker';
import React, { useRef } from 'react';

const CustomTimePicker = ({ onTimeChange, itemHeight, initValue }) => {
  const ampmItems = ['AM', 'PM'];
  const hourItems = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minuteItems = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const { ampm, hour, minute } = initValue || {};
  
  // useRef를 사용하여 각 휠의 현재 값을 저장
  const selectedAMPM = useRef(ampm || 'AM');
  const selectedHour = useRef(hour || '01');
  const selectedMinute = useRef(minute || '00');

  const handleIndexChange = (category, item) => {
    switch (category) {
      case 'ampm':
        selectedAMPM.current = item;
        break;
      case 'hour':
        selectedHour.current = item;
        break;
      case 'minute':
        selectedMinute.current = item;
        break;
      default:
        throw new Error('Invalid time category');
    }
    // 값이 변경될 때마다 부모 컴포넌트로 전달
    onTimeChange({
      ampm: selectedAMPM.current,
      hour: selectedHour.current,
      minute: selectedMinute.current,
    });
  };

  return (
    <View style={[styles.container, { height: itemHeight * 2 }]}>
      <WheelPicker
        items={ampmItems}
        onItemChange={(item) => handleIndexChange('ampm', item)}
        itemHeight={itemHeight}
        initValue={ampm}
        containerStyle={{ width: 80, marginHorizontal: 10 }}
      />
      <WheelPicker
        items={hourItems}
        onItemChange={(item) => handleIndexChange('hour', item)}
        itemHeight={itemHeight}
        initValue={hour}
        containerStyle={{ width: 80, marginHorizontal: 10 }}
      />
      <View style={[styles.colonContainer, { height: itemHeight * 3 }]}>
        <Text style={styles.colon}>:</Text>
      </View>
      <WheelPicker
        items={minuteItems}
        onItemChange={(item) => handleIndexChange('minute', item)}
        itemHeight={itemHeight}
        initValue={minute}
        containerStyle={{ width: 80, marginHorizontal: 10 }}
      />
      
      <View style={[styles.highlight, { height: itemHeight, top: itemHeight }]} />
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