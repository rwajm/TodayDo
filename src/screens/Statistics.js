import React, { useState } from 'react';
import { NoScaleText } from '../components/NoScaleText';
import {  View, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 임포트

export default function Statistics() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [filter, setFilter] = useState('월별');
  const [expanded, setExpanded] = useState(false); // 버튼 확장 여부

  // 임시 데이터 (월별)
  const monthdata = [
    { label: today.getMonth() - 5, todo: 5, routine: 4},
    { label: today.getMonth() - 4, todo: 2, routine: 3},
    { label: today.getMonth() - 3, todo: 4, routine: 2},
    { label: today.getMonth() - 2, todo: 3, routine: 4},
    { label: today.getMonth() - 1, todo: 1, routine: 2},
    { label: today.getMonth(), todo: 4, routine: 5},
    { label: today.getMonth() + 1, todo: 3, routine: 4},
  ];

  const yeardata = [
    { label: today.getFullYear() - 6, todo: 5, routine: 4},
    { label: today.getFullYear() - 5, todo: 2, routine: 3},
    { label: today.getFullYear() - 4, todo: 4, routine: 2},
    { label: today.getFullYear() - 3, todo: 3, routine: 4},
    { label: today.getFullYear() - 2, todo: 1, routine: 2},
    { label: today.getFullYear() - 1, todo: 4, routine: 5},
    { label: today.getFullYear(), todo: 3, routine: 4},
  ];

  const datedata = [
    { label: today.getDate() - 6, todo: 5, routine: 4},
    { label: today.getDate() - 5, todo: 2, routine: 3},
    { label: today.getDate() - 4, todo: 4, routine: 2},
    { label: today.getDate() - 3, todo: 3, routine: 4},
    { label: today.getDate() - 2, todo: 1, routine: 2},
    { label: today.getDate() - 1, todo: 4, routine: 5},
    { label: today.getDate(), todo: 3, routine: 4},
  ];

  const data = filter === '연도별' ? yeardata : filter === '월별' ? monthdata : filter === '일별' ? datedata : [];

  const maxTotal = Math.max(...data.map((d) => d.todo + d.routine));

  // 옵션 리스트
  const options = ['연도별', '월별', '일별'];

  // 연도 증감 함수
  const increaseYear = () => setYear((y) => y + 1);
  const decreaseYear = () => setYear((y) => y - 1);

  // 월 증감 함수
  const increaseMonth = () => setMonth((m) => (m === 12 ? 1 : m + 1));
  const decreaseMonth = () => setMonth((m) => (m === 1 ? 12 : m - 1));

  const getYearText = () => {
    if (filter === '연도별') return '연도';
    if (filter === '월별') return year.toString();
    if (filter === '일별') return `${month}월`;
    return '';
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setExpanded(false); // 바깥 터치하면 닫기
      }}
      accessible={false}
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>

          <View style={styles.graphContainer}>

            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#CDCDCD' }]} />
                <NoScaleText style={styles.legendText}>Routine</NoScaleText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#3A9CFF' }]} />
                <NoScaleText style={styles.legendText}>Todo</NoScaleText>
              </View>
            </View>

            <View style={styles.yearSelector}>
              {/* 왼쪽 증감 버튼 */}
              {(filter === '월별' || filter === '일별') && (
                <TouchableOpacity
                  onPress={filter === '월별' ? decreaseYear : decreaseMonth}
                  style={styles.arrowButton}
                >
                  <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
              )}

              {/* 중앙 텍스트 */}
              <NoScaleText
                style={[
                  styles.yearText,
                  filter === '연도별' && { marginTop: 15 },
                ]}
              >
                {getYearText()}
              </NoScaleText>

              {/* 오른쪽 증감 버튼 */}
              {(filter === '월별' || filter === '일별') && (
                <TouchableOpacity
                  onPress={filter === '월별' ? increaseYear : increaseMonth}
                  style={styles.arrowButton}
                >
                  <Ionicons name="chevron-forward" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>


            {/* 필터 버튼 (아이콘 포함) */}
            <View style={[styles.filterButtonContainer, expanded && styles.filterButtonExpanded]}>
              <TouchableOpacity
                style={styles.filterButton}
                activeOpacity={1}
                onPress={() => setExpanded((e) => !e)}
              >
                <NoScaleText style={styles.filterText}>{filter}</NoScaleText>
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color="#333"
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>

              {/* 옵션 펼침 */}
              {expanded && (
                <View style={styles.optionsContainer}>
                  {options.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.optionItem, filter === opt && styles.optionItemSelected]}
                      onPress={() => {
                        setFilter(opt);
                        setExpanded(false);
                      }}
                    >
                      <NoScaleText
                        style={[
                          styles.filterText,
                          filter === opt && { fontWeight: 'bold' },
                        ]}
                      >
                        {opt}
                      </NoScaleText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 그래프 막대 */}
            {data.map(({ label, todo, routine }) => {
              const totalHeight = 200;
              const todoHeight = (todo / maxTotal) * totalHeight;
              const routineHeight = (routine / maxTotal) * totalHeight;
              return (
                <View key={label} style={styles.graphBarContainer}>
                  <View style={{ height: routineHeight, backgroundColor: '#CDCDCD', width: '100%' }} />
                  <View style={{ height: todoHeight, backgroundColor: '#3A9CFF', width: '100%' }} />
                  <NoScaleText
                    style={[
                      styles.graphLabel,
                      filter === '연도별' && { width: 30 }
                    ]}
                  >
                    {label}
                  </NoScaleText>
                </View>
              );
            })}
          </View>

          <View style={styles.cumulativeContainer}>
            <NoScaleText style={styles.cumulativeTitle}>누적 통계</NoScaleText>

            <View style={styles.cumulativeTextRow}>
              <NoScaleText style={styles.cumulativeText}>Todo 누적 완료 횟수</NoScaleText>
              <NoScaleText style={styles.countText}>23회</NoScaleText>
            </View>

            <View style={styles.cumulativeTextRow}>
              <NoScaleText style={styles.cumulativeText}>Routine 누적 완료 횟수</NoScaleText>
              <NoScaleText style={styles.countText}>55회</NoScaleText>
            </View>

            <View style={styles.cumulativeTextRow}>
              <NoScaleText style={styles.cumulativeText}>Record 누적 완료 횟수</NoScaleText>
              <NoScaleText style={styles.countText}>14회</NoScaleText>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: 8,

    //iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    //Android 그림자
    elevation: 6,
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 350,
    marginBottom: 30,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
    position: 'relative',

    //iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    //Android 그림자
    elevation: 3,    
  },
  legendContainer: {
  position: 'absolute',
  top: 20,
  left: 20,
  zIndex: 1000,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6, // 아이템 간 간격
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    color: '#333',
  },
  yearSelector: {
  position: 'absolute',
  top: 10,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
},
  arrowButton: {
    padding: 10,
  },
  yearText: {
  fontSize: 18,
  fontWeight: 'bold',
  marginHorizontal: 8,
  textAlign: 'center',
  width: 60,
  
},
  filterButtonContainer: {
    position: 'absolute',
    top: 18,
    right: 10,
    backgroundColor: '#EBEBEB',
    borderRadius: 15,
    overflow: 'hidden',
    minWidth: 80,
    zIndex: 1000,
    
  },
  filterButtonExpanded: {
    backgroundColor: '#EBEBEB',
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterText: {
    fontSize: 12,
    color: '#333',
  },
  optionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#cdcdcdff',
  },
  optionItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionItemSelected: {
    backgroundColor: '#f7f7f7ff',
  },
  graphBarContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 25,
  },
  graphLabel: {
    marginTop: 6,
    marginBottom: 15,
    fontSize: 12,
    color: '#333',
  },
  cumulativeContainer: {
    paddingHorizontal: 20,
  },
  cumulativeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#c3c3c3',
    marginBottom: 20,
    paddingVertical: 12,
  },
  cumulativeTextRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 6,
  paddingHorizontal: 12,
  },
  cumulativeText: {
    fontSize: 14,
    color: '#747474',
  },
  countText: {
    fontSize: 14,
    color: '#747474',
  },
});
