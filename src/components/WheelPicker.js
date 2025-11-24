import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const WheelPicker = ({ items, onItemChange, itemHeight, initValue }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const initValueIndex = initValue ? items.indexOf(initValue) : 0; // 기본값: 0
  const [selectedIndex, setSelectedIndex] = useState(
    initValueIndex >= 0 ? items[initValueIndex] : items[0]
  );
  const flatListRef = useRef(null);

  const onPressItem = (index) => {
    if(index > 0 && index < modifiedItems.length - 1){
      setSelectedIndex(items[index - 1]);
      flatListRef.current?.scrollToOffset({
        offset: (index - 1) * itemHeight,
        animated: true,
      });
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 2) * itemHeight,
      (index - 1) * itemHeight,
      index * itemHeight,
    ];
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    return (
      <TouchableOpacity onPress={() => onPressItem(index)} activeOpacity={0.7}>
        <Animated.View
          style={[
            styles.itemWrapper,
            { height: itemHeight, transform: [{ scale }] },
          ]}
        >
          <Text
            style={[
              styles.itemText,
              { color: selectedIndex === item ? '#000000' : '#888888' },
            ]}
          >
            {item}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // 앞뒤에 빈 아이템을 추가하여 무한 스크롤처럼 보이게 함
  const modifiedItems = ['', ...items, ''];

  const momentumScrollEnd = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    
    // index가 유효한 범위 내에 있는지 확인
    if (index >= 0 && index < items.length) {
      setSelectedIndex(items[index]);
    }
    else if(index === 0){
      setSelectedIndex(items[0]);
    }
    else if(index >= modifiedItems.length - 1){
      setSlectedIndex(items[items.length-1]);
    }
  };

  useEffect(() => {
    onItemChange(selectedIndex);
  }, [selectedIndex]);

  return (
    <View style={[{ height: itemHeight * 3 }, styles.container]}>
      <Animated.FlatList
        ref={flatListRef}
        data={modifiedItems}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight} // 항목 높이만큼 스냅
        onMomentumScrollEnd={momentumScrollEnd}
        scrollEventThrottle={20}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        // 초기 스크롤 위치 설정
        initialScrollIndex={initValueIndex >= 0 ? initValueIndex : 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    margin: 10
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 21,
    fontWeight: 'bold',
  },
});

export default WheelPicker;