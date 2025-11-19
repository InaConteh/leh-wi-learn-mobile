import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppStore } from '@store/appStore';
import { authService } from '@services/auth';

export const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const user = await authService.restoreSession();
        if (user) {
          const profile = await authService.getProfile(user.id);
          useAppStore.setState({ profile });
          navigation.reset({
            index: 0,
            routes: [{ name: 'Lessons' }],
          });
        } else {
          const showOnboarding = useAppStore.getState().showOnboarding;
          navigation.reset({
            index: 0,
            routes: [{ name: showOnboarding ? 'Onboarding' : 'SignIn' }],
          });
        }
      } catch (error) {
        console.error('Bootstrap error:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      }
    };

    bootstrap();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6200ee" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
