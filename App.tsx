import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { database } from './src/db/index';
import { useAppStore } from './src/store/appStore';
import NetInfo from '@react-native-community/netinfo';

export default function App() {
  useEffect(() => {
    // Listen for network changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      useAppStore.setState({ isOnline: state.isConnected ?? true });
    });

    return unsubscribe;
  }, []);

  return (
    <PaperProvider>
      <DatabaseProvider database={database}>
        <RootNavigator />
      </DatabaseProvider>
    </PaperProvider>
  );
}
