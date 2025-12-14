import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NoScaleText } from './NoScaleText';

export default function RewardItem({ item, onPress }) {
  return (
    <View style={styles.card}>
      <View style={styles.textBox}>
        <NoScaleText style={styles.title}>
          {item.title}
        </NoScaleText>
        <NoScaleText style={styles.description}>
          {item.description}
        </NoScaleText>
      </View>

      <TouchableOpacity
        style={[
            styles.button,
            item.claimed && styles.claimedButton,
            !item.conditionMet && styles.disabledButton,
        ]}
        disabled={item.claimed || !item.conditionMet}
        onPress={onPress}
        >
        <NoScaleText style={styles.buttonText}>
            {item.claimed
            ? '획득 완료'
            : item.conditionMet
            ? '받기'
            : '받기'}
        </NoScaleText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#eee',
  },
  textBox: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A9CFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    paddingHorizontal: 30,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#3A9CFF',
  },
  disabledButton: {
  backgroundColor: '#ddd',
  },
  claimedButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
