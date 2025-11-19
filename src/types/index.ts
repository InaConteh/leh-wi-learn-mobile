export interface Course {
  id: string;
  title: string;
  slug: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: LessonContent;
  order: number;
  createdAt: string;
}

export interface LessonContent {
  blocks: ContentBlock[];
}

export interface ContentBlock {
  type: 'text' | 'image' | 'heading';
  data: {
    text?: string;
    level?: number;
    url?: string;
  };
}

export interface Submission {
  id: string;
  userId: string;
  lessonId: string;
  imageUrl: string;
  result?: AssessmentResult;
  createdAt: string;
}

export interface AssessmentResult {
  passed: boolean;
  score: number;
  reason: string;
  feedback?: string;
  status?: 'pending' | 'completed' | 'failed';
}

export interface SkillMint {
  id: string;
  userId: string;
  lessonId: string;
  txHash: string;
  tokenId: string;
  metadata: NFTMetadata;
  issuedAt: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface Profile {
  id: string;
  email: string;
  walletAddress: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
}
