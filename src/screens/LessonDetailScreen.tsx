import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Appbar } from 'react-native-paper';
import { ContentRenderer } from '@components/ContentRenderer';
import { PrimaryButton } from '@components/Button';
import { database } from '@db/index';

export const LessonDetailScreen = ({ navigation, route }: any) => {
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const lessonModel = await database.collections.get('lessons').find(lessonId);
      setLesson({
        id: lessonModel.id,
        title: lessonModel.title,
        content: lessonModel.content,
      });
    } catch (err) {
      console.error('Failed to load lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAssessment = () => {
    navigation.navigate('Assessment', { lessonId, lessonTitle: lesson?.title });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Text>Lesson not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={lesson.title} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <ContentRenderer content={lesson.content} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Take Assessment"
          onPress={handleTakeAssessment}
          accessible={true}
          accessibilityLabel="Take assessment button">
          Take Assessment
        </PrimaryButton>
      </View>
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
    paddingVertical: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
