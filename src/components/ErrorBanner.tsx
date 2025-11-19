import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';

interface ErrorBannerProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export const ErrorBanner = ({ message, visible, onDismiss, duration = 3000 }: ErrorBannerProps) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      style={styles.snackbar}
      action={{ label: 'Dismiss', onPress: onDismiss }}
    >
      <Text style={styles.text}>{message}</Text>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: '#ff6b6b',
    margin: 16,
  },
  text: {
    color: '#fff',
  },
});
