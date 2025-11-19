import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { useAppStore } from '@store/appStore';
import { authService } from '@services/auth';
import { ErrorBanner } from '@components/ErrorBanner';
import { PrimaryButton } from '@components/Button';

export const OtpVerificationScreen = ({ navigation, route }: any) => {
  const { email, isSignUp } = route.params;
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handleVerifyOtp = async () => {
    if (!token) {
      setError('Please enter the code');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const user = await authService.verifyOtp(email, token);
      const profile = await authService.getProfile(user.id);
      useAppStore.setState({ profile });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Lessons' }],
      });
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>Enter the code we sent to {email}</Text>

        <TextInput
          label="Verification Code"
          value={token}
          onChangeText={setToken}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          accessibilityLabel="Verification code input"
        />

        <PrimaryButton
          label="Verify & Continue"
          onPress={handleVerifyOtp}
          loading={loading}
          disabled={loading} children={undefined}        />
      </View>

      <ErrorBanner
        message={error}
        visible={showError}
        onDismiss={() => setShowError(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    marginBottom: 24,
  },
});
