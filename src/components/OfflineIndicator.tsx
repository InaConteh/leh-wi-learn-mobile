import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppStore } from '@store/appStore';

export const OfflineIndicator = () => {
  const isOnline = useAppStore((s) => s.isOnline);

  if (isOnline) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Offline</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
