import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TabIconProps {
  name: 'home' | 'tutor' | 'study' | 'focus' | 'progress';
  color: string;
  focused: boolean;
}

export function TabIcon({ name, color, focused }: TabIconProps) {
  const strokeWidth = focused ? 2.4 : 1.8;

  switch (name) {
    case 'home':
      return (
        <View style={styles.container}>
          <View style={[styles.roof, { borderColor: color, borderTopWidth: strokeWidth, borderRightWidth: strokeWidth }]} />
          <View style={[styles.houseBody, { borderColor: color, borderWidth: strokeWidth, borderTopWidth: 0 }]} />
        </View>
      );
    case 'tutor':
      return (
        <View style={styles.container}>
          <View style={[styles.speechBubble, { borderColor: color, borderWidth: strokeWidth }]}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <View style={[styles.dot, { backgroundColor: color }]} />
            <View style={[styles.dot, { backgroundColor: color }]} />
          </View>
          <View style={[styles.speechTail, { backgroundColor: color }]} />
        </View>
      );
    case 'study':
      return (
        <View style={[styles.container, styles.row]}>
          <View style={[styles.bookHalf, { borderColor: color, borderWidth: strokeWidth, borderRightWidth: strokeWidth / 2 }]} />
          <View style={[styles.bookHalf, { borderColor: color, borderWidth: strokeWidth, borderLeftWidth: strokeWidth / 2 }]} />
        </View>
      );
    case 'focus':
      return (
        <View style={styles.container}>
          <View style={[styles.targetOuter, { borderColor: color, borderWidth: strokeWidth }]}>
            <View style={[styles.targetMiddle, { borderColor: color, borderWidth: strokeWidth / 2 }]}>
              <View style={[styles.targetInner, { backgroundColor: color }]} />
            </View>
          </View>
        </View>
      );
    case 'progress':
      return (
        <View style={[styles.container, styles.chartRow]}>
          <View style={[styles.chartBar, { height: 8, backgroundColor: color }]} />
          <View style={[styles.chartBar, { height: 14, backgroundColor: color }]} />
          <View style={[styles.chartBar, { height: 20, backgroundColor: color }]} />
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: 22,
  },
  roof: {
    width: 14,
    height: 14,
    transform: [{ rotate: '-45deg' }],
    marginBottom: -6,
  },
  houseBody: {
    width: 16,
    height: 12,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  speechBubble: {
    width: 22,
    height: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 3,
  },
  speechTail: {
    width: 5,
    height: 5,
    alignSelf: 'flex-start',
    marginLeft: 7,
    marginTop: -3,
    transform: [{ rotate: '45deg' }],
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  bookHalf: {
    width: 9,
    height: 16,
    borderRadius: 3,
  },
  targetOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetMiddle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chartBar: {
    width: 5,
    borderRadius: 2.5,
  },
});
