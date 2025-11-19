import { Model } from '@watermelondb/core';
import { field, relation, readonly, date } from '@watermelondb/decorators';

export class CourseModel extends Model {
  static table = 'courses';

  @field('title') title!: string;
  @field('slug') slug!: string;
  @field('meta') meta?: any;
  @readonly @date('created_at') createdAt!: Date;
}

export class ModuleModel extends Model {
  static table = 'modules';

  @relation('courses', 'course_id') course!: any;
  @field('course_id') courseId!: string;
  @field('title') title!: string;
  @field('order') order!: number;
}

export class LessonModel extends Model {
  static table = 'lessons';

  @relation('modules', 'module_id') module!: any;
  @field('module_id') moduleId!: string;
  @field('title') title!: string;
  @field('content') content!: any;
  @field('order') order!: number;
  @readonly @date('created_at') createdAt!: Date;
}

export class SubmissionModel extends Model {
  static table = 'submissions';

  @field('user_id') userId!: string;
  @field('lesson_id') lessonId!: string;
  @field('image_url') imageUrl!: string;
  @field('result') result?: any;
  @readonly @date('created_at') createdAt!: Date;
}

export class SkillMintModel extends Model {
  static table = 'skill_mints';

  @field('user_id') userId!: string;
  @field('lesson_id') lessonId!: string;
  @field('tx_hash') txHash!: string;
  @field('token_id') tokenId!: string;
  @field('metadata') metadata!: any;
  @readonly @date('issued_at') issuedAt!: Date;
}
