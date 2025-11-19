import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAppStore } from '@store/appStore';
import { authService } from '@services/auth';
import { ErrorBanner } from '@components/ErrorBanner';
import { PrimaryButton } from '@components/Button';

export const SignInScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleSignInOtp = async () => {
    if (!email) {
      setError('Please enter your email');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      await authService.signInWithOtp(email);
      navigation.navigate('OtpVerification', { email });
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInPassword = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const user = await authService.signInWithPassword(email, password);
      const profile = await authService.getProfile(user.id);
      useAppStore.setState({ profile });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Lessons' }],
      });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpPassword = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      await authService.signUpWithEmail(email, password);
      navigation.navigate('OtpVerification', { email, isSignUp: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Leh Wi Learn</Text>
        <Text style={styles.subtitle}>Learn practical skills offline</Text>

        {/* <Tabs value={activeTab} onValueChange={setActiveTab}>
          <Tabs.Tab label="Magic Link" icon="mail" />
          <Tabs.Tab label="Email/Password" icon="lock" />
        </Tabs> */}

        <View style={styles.tabContent}>
          {activeTab === 0 ? (
            <>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                accessibilityLabel="Email input"
              />
              <PrimaryButton
                label="Send Magic Link"
                onPress={handleSignInOtp}
                loading={loading}
                disabled={loading} children={undefined}              />
              <Text style={styles.hint}>We'll send you a link to sign in.</Text>
            </>
          ) : (
            <>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                accessibilityLabel="Email input"
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                accessibilityLabel="Password input"
              />
              <PrimaryButton
                label="Sign In"
                onPress={handleSignInPassword}
                loading={loading}
                disabled={loading}
                 children={undefined}   
              />
              <PrimaryButton
                label="Create Account"
                onPress={handleSignUpPassword}
                loading={loading}
                disabled={loading}
                 children={undefined}   
              />
            </>
          )}
        </View>
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
    fontSize: 32,
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
  tabContent: {
    marginTop: 24,
  },
  input: {
    marginBottom: 16,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});
