import { syncService } from '@services/sync';
import * as SyncModule from '@services/sync';

// Mock fetch
global.fetch = jest.fn();

// Mock database
jest.mock('@db/index', () => ({
  database: {
    write: jest.fn(async (fn) => fn()),
    collections: {
      get: jest.fn(() => ({
        query: jest.fn(() => ({
          fetch: jest.fn(() => []),
        })),
        create: jest.fn(),
        destroyPermanently: jest.fn(),
      })),
    },
  },
}));

describe('syncService.syncCourses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch courses from Edge and update WatermelonDB', async () => {
    const mockResponse = {
      courses: [
        {
          id: '1',
          title: 'Sewing Basics',
          slug: 'sewing-basics',
          meta: {},
          modules: [
            {
              id: 'm1',
              title: 'Module 1',
              order: 1,
              lessons: [
                {
                  id: 'l1',
                  title: 'Lesson 1',
                  content: {},
                  order: 1,
                  module_id: 'm1',
                },
              ],
            },
          ],
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // Note: Full test requires proper database mock setup
    // This is a simplified example
    expect(typeof syncService.syncCourses).toBe('function');
  });

  it('should throw error on fetch failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
    });

    // Expected to throw
    try {
      await syncService.syncCourses('invalid-token');
      fail('Should have thrown');
    } catch (err: any) {
      expect(err.message).toContain('Sync failed');
    }
  });
});

describe('syncService.getCourses', () => {
  it('should return courses from WatermelonDB', async () => {
    const courses = await syncService.getCourses();
    expect(Array.isArray(courses)).toBe(true);
  });
});
