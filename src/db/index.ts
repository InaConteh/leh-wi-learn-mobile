import SQLiteAdapter from '@watermelondb/sqlite/adapter';
import { Database } from '@watermelondb/core';
import { CourseModel, ModuleModel, LessonModel, SubmissionModel, SkillMintModel } from './models';

const adapter = new SQLiteAdapter({
  dbName: 'lehwilearn',
  schema: {
    version: 1,
    tables: [
      {
        name: 'courses',
        columns: [
          { name: 'id', type: 'string', isIndexed: true },
          { name: 'title', type: 'string' },
          { name: 'slug', type: 'string', isIndexed: true },
          { name: 'meta', type: 'string' },
          { name: 'created_at', type: 'number' },
        ],
      },
      {
        name: 'modules',
        columns: [
          { name: 'id', type: 'string', isIndexed: true },
          { name: 'course_id', type: 'string', isIndexed: true },
          { name: 'title', type: 'string' },
          { name: 'order', type: 'number' },
        ],
      },
      {
        name: 'lessons',
        columns: [
          { name: 'id', type: 'string', isIndexed: true },
          { name: 'module_id', type: 'string', isIndexed: true },
          { name: 'title', type: 'string' },
          { name: 'content', type: 'string' },
          { name: 'order', type: 'number' },
          { name: 'created_at', type: 'number' },
        ],
      },
      {
        name: 'submissions',
        columns: [
          { name: 'id', type: 'string', isIndexed: true },
          { name: 'user_id', type: 'string', isIndexed: true },
          { name: 'lesson_id', type: 'string', isIndexed: true },
          { name: 'image_url', type: 'string' },
          { name: 'result', type: 'string' },
          { name: 'created_at', type: 'number' },
        ],
      },
      {
        name: 'skill_mints',
        columns: [
          { name: 'id', type: 'string', isIndexed: true },
          { name: 'user_id', type: 'string', isIndexed: true },
          { name: 'lesson_id', type: 'string', isIndexed: true },
          { name: 'tx_hash', type: 'string', isIndexed: true },
          { name: 'token_id', type: 'string' },
          { name: 'metadata', type: 'string' },
          { name: 'issued_at', type: 'number' },
        ],
      },
    ],
  },
});

export const database = new Database({
  adapter,
  modelClasses: [CourseModel, ModuleModel, LessonModel, SubmissionModel, SkillMintModel],
  actionsEnabled: true,
});
