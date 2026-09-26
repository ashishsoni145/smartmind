import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TabIconProps {
  name: 'home' | 'tutor' | 'study' | 'focus' | 'progress';
  color: string;
  focused: boolean;
}

export function TabIcon({ name, color, focused }: TabIconProps) {
  const strokeWidth = focused ? 2.2 : 1.6;

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
            <View style={[styles.targetInner, { backgroundColor: color }]} />
          </View>
        </View>
      );
    case 'progress':
      return (
        <View style={[styles.container, styles.chartRow]}>
          <View style={[styles.chartBar, { height: 7, backgroundColor: color }]} />
          <View style={[styles.chartBar, { height: 13, backgroundColor: color }]} />
          <View style={[styles.chartBar, { height: 18, backgroundColor: color }]} />
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  roof: {
    width: 12,
    height: 12,
    transform: [{ rotate: '-45deg' }],
    marginBottom: -5,
  },
  houseBody: {
    width: 14,
    height: 10,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  speechBubble: {
    width: 20,
    height: 15,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 2,
  },
  speechTail: {
    width: 4,
    height: 4,
    alignSelf: 'flex-start',
    marginLeft: 6,
    marginTop: -2,
    transform: [{ rotate: '45deg' }],
  },
  dot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.5,
  },
  bookHalf: {
    width: 8,
    height: 15,
    borderRadius: 2,
  },
  targetOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chartBar: {
    width: 4,
    borderRadius: 2,
  },
});
