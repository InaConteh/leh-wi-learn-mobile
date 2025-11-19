import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Appbar } from 'react-native-paper';
import { useAppStore } from '@store/appStore';
import { syncService } from '@services/sync';
import { OfflineIndicator } from '@components/OfflineIndicator';
import { ErrorBanner } from '@components/ErrorBanner';

export const LessonsListScreen = ({ navigation }: any) => {
  const user = useAppStore((s) => s.user);
  const isSyncing = useAppStore((s) => s.isSyncing);
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await syncService.getCourses();
      setCourses(data as any);
    } catch (err: any) {
      setError('Failed to load courses');
      setShowError(true);
    }
  };

  const handleSync = async () => {
    if (!user) return;
    try {
      await syncService.syncCourses(user.accessToken);
      await loadCourses();
    } catch (err: any) {
      setError('Sync failed');
      setShowError(true);
    }
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const renderCourseItem = ({ item }: any) => (
    <View
      style={styles.courseCard}
      accessible={true}
      accessibilityLabel={`Course: ${item.title}`}
    >
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Lesson', { lessonId: item.id })}
      >
        View Lessons →
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Lessons" />
        <Appbar.Action
          icon="sync"
          onPress={handleSync}
          disabled={isSyncing}
          accessibilityLabel="Sync button"
        />
        <Appbar.Action
          icon="account"
          onPress={handleProfilePress}
          accessibilityLabel="Profile button"
        />
      </Appbar.Header>

      <View style={styles.content}>
        <OfflineIndicator />

        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={isSyncing} onRefresh={handleSync} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No courses available. Pull to sync.</Text>
          }
        />
      </View>

      <ErrorBanner
        message={error}
        visible={showError}
        onDismiss={() => setShowError(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  courseCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    minHeight: 60,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  link: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '500',
  },
  empty: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
  },
});
