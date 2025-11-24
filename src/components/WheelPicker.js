import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const WheelPicker = ({ items, onItemChange, itemHeight, initValue }) => {
  const initValueIndex = initValue ? items.indexOf(initValue) : 0; // 기본값: 0
  const scrollY = useRef(new Animated.Value(initValueIndex * itemHeight)).current;
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
      extrapolate: 'clamp',
    });
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3], 
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={() => onPressItem(index)} activeOpacity={0.7}>
        <Animated.View
          style={[
            styles.itemWrapper,
            { height: itemHeight, transform: [{ scale }], opacity: opacity },
          ]}
        >
          <Text
            style={styles.itemText}
          >
            {item}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

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
      setSelectedIndex(items[items.length-1]);
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
        scrollEventThrottle={16}
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