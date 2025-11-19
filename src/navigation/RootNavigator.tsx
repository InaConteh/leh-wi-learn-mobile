import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Screens
import { SplashScreen } from '@screens/SplashScreen';
import { OnboardingScreen } from '@screens/OnboardingScreen';
import { SignInScreen } from '@screens/SignInScreen';
import { OtpVerificationScreen } from '@screens/OtpVerificationScreen';
import { LessonsListScreen } from '@screens/LessonsListScreen';
import { LessonDetailScreen } from '@screens/LessonDetailScreen';
import { AssessmentFlowScreen } from '@screens/AssessmentFlowScreen';
import { ProfileScreen } from '@screens/ProfileScreen';

// Store
import { useAppStore } from '@store/appStore';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#fff' },
    }}
  >
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#fff' },
    }}
  >
    <Stack.Screen name="Lessons" component={LessonsListScreen} />
    <Stack.Screen name="Lesson" component={LessonDetailScreen} />
    <Stack.Screen name="Assessment" component={AssessmentFlowScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const authLoading = useAppStore((s) => s.authLoading);

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {authLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : isAuthenticated ? (
          <Stack.Screen
            name="App"
            component={AppStack}
            options={{ animation: 'none' }}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ animation: 'none' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
