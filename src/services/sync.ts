import { database } from '@db/index';
import { supabase } from './supabase';
import { useAppStore } from '@store/appStore';
import { Course, Lesson } from '../types';

const EDGE_URL = process.env.EXPO_PUBLIC_EDGE_URL || '';

export const syncService = {
  async syncCourses(accessToken: string): Promise<void> {
    useAppStore.setState({ isSyncing: true });
    try {
      // Fetch from Edge Function
      const response = await fetch(`${EDGE_URL}/getCourses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error(`Sync failed: ${response.statusText}`);

      const { courses } = await response.json();

      // Begin WatermelonDB transaction
      await database.write(async () => {
        // Clear existing data
        const existingCourses = await database.collections.get('courses').query().fetch();
        for (const course of existingCourses) {
          await course.destroyPermanently();
        }

        // Create new courses
        for (const courseData of courses) {
          const course = await database.collections.get('courses').create((c: any) => {
            c.title = courseData.title;
            c.slug = courseData.slug;
            c.meta = courseData.meta || {};
          });

          // Create modules for this course
          for (const module of courseData.modules || []) {
            await database.collections.get('modules').create((m: any) => {
              m.courseId = course.id;
              m.title = module.title;
              m.order = module.order || 0;
            });

            // Create lessons for this module
            for (const lesson of module.lessons || []) {
              await database.collections.get('lessons').create((l: any) => {
                l.moduleId = module.id;
                l.title = lesson.title;
                l.content = lesson.content;
                l.order = lesson.order || 0;
              });
            }
          }
        }
      });

      useAppStore.setState({ lastSyncedAt: Date.now() });
    } catch (error) {
      console.error('Sync error:', error);
      throw error;
    } finally {
      useAppStore.setState({ isSyncing: false });
    }
  },

  async getCourses(): Promise<Course[]> {
    const courses = await database.collections
      .get('courses')
      .query()
      .fetch();

    return courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      meta: c.meta,
      createdAt: c.createdAt.toISOString(),
    }));
  },

  async getModulesForCourse(courseId: string) {
    const { Q } = require('@watermelondb/query');
    const modules = await database.collections
      .get('modules')
      .query(Q.where('course_id', Q.eq(courseId)))
      .fetch();

    return modules.map((m: any) => ({
      id: m.id,
      courseId: m.courseId,
      title: m.title,
      order: m.order,
    }));
  },

  async getLessonsForModule(moduleId: string): Promise<Lesson[]> {
    const { Q } = require('@watermelondb/query');
    const lessons = await database.collections
      .get('lessons')
      .query(Q.where('module_id', Q.eq(moduleId)))
      .fetch();

    return lessons.map((l: any) => ({
      id: l.id,
      moduleId: l.moduleId,
      title: l.title,
      content: l.content,
      order: l.order,
      createdAt: l.createdAt.toISOString(),
    }));
  },
};
