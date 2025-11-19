import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import { CourseModel, ModuleModel, LessonModel, SubmissionModel, SkillMintModel } from './models';

const adapter = new SQLiteAdapter({
  dbName: 'lehwilearn',
  schema: {
    version: 1,
    tables: {
      courses: {
        name: 'courses',
        columns: {
          id: { name: 'id', type: 'string', isIndexed: true },
          title: { name: 'title', type: 'string' },
          slug: { name: 'slug', type: 'string', isIndexed: true },
          meta: { name: 'meta', type: 'string' },
          created_at: { name: 'created_at', type: 'number' },
        },
        columnArray: [
          { name: 'id', type: 'string', isIndexed: true },
          { name: 'title', type: 'string' },
          { name: 'slug', type: 'string', isIndexed: true },
          { name: 'meta', type: 'string' },
          { name: 'created_at', type: 'number' },
        ],
      },
      modules: {
        name: 'modules',
        columns: {
          id: { name: 'id', type: 'string', isIndexed: true },
          course_id: { name: 'course_id', type: 'string', isIndexed: true },
          title: { name: 'title', type: 'string' },
          order: { name: 'order', type: 'number' },
        },
        columnArray: [
          { name: 'id', type: 'string', isIndexed: true },
          { name: 'course_id', type: 'string', isIndexed: true },
          { name: 'title', type: 'string' },
          { name: 'order', type: 'number' },
        ],
      },
      lessons: {
        name: 'lessons',
        columns: {
          id: { name: 'id', type: 'string', isIndexed: true },
          module_id: { name: 'module_id', type: 'string', isIndexed: true },
          title: { name: 'title', type: 'string' },
          content: { name: 'content', type: 'string' },
          order: { name: 'order', type: 'number' },
          created_at: { name: 'created_at', type: 'number' },
        },
        columnArray: [
          { name: 'id', type: 'string', isIndexed: true },
          { name: 'module_id', type: 'string', isIndexed: true },
          { name: 'title', type: 'string' },
          { name: 'content', type: 'string' },
          { name: 'order', type: 'number' },
          { name: 'created_at', type: 'number' },
        ],
      },
      submissions: {
        name: 'submissions',
        columns: {
          id: { name: 'id', type: 'string', isIndexed: true },
          user_id: { name: 'user_id', type: 'string', isIndexed: true },
          lesson_id: { name: 'lesson_id', type: 'string', isIndexed: true },
          image_url: { name: 'image_url', type: 'string' },
          result: { name: 'result', type: 'string' },
          created_at: { name: 'created_at', type: 'number' },
        },
        columnArray: [
          { name: 'id', type: 'string', isIndexed: true },
          { name: 'user_id', type: 'string', isIndexed: true },
          { name: 'lesson_id', type: 'string', isIndexed: true },
          { name: 'image_url', type: 'string' },
          { name: 'result', type: 'string' },
          { name: 'created_at', type: 'number' },
        ],
      },
      skill_mints: {
        name: 'skill_mints',
        columns: {
          id: { name: 'id', type: 'string', isIndexed: true },
          user_id: { name: 'user_id', type: 'string', isIndexed: true },
          lesson_id: { name: 'lesson_id', type: 'string', isIndexed: true },
          tx_hash: { name: 'tx_hash', type: 'string', isIndexed: true },
          token_id: { name: 'token_id', type: 'string' },
          metadata: { name: 'metadata', type: 'string' },
          issued_at: { name: 'issued_at', type: 'number' },
        },
        columnArray: [
          { name: 'id', type: 'string', isIndexed: true },
          { name: 'user_id', type: 'string', isIndexed: true },
          { name: 'lesson_id', type: 'string', isIndexed: true },
          { name: 'tx_hash', type: 'string', isIndexed: true },
          { name: 'token_id', type: 'string' },
          { name: 'metadata', type: 'string' },
          { name: 'issued_at', type: 'number' },
        ],
      },
    },
  },
});

export const database = new Database({
  adapter,
  modelClasses: [CourseModel, ModuleModel, LessonModel, SubmissionModel, SkillMintModel],
});
