import { assessmentService } from '@services/assessment';

// Mock fetch
global.fetch = jest.fn();

// Mock Supabase
jest.mock('@services/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(async () => ({
          data: { path: 'submissions/user1/123_image.jpg' },
        })),
        getPublicUrl: jest.fn(() => ({
          data: { publicUrl: 'https://example.com/submissions/user1/123_image.jpg' },
        })),
      })),
    },
  },
}));

describe('assessmentService.callAssessAndMint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call Edge Function and return assessment result', async () => {
    const mockResponse = {
      passed: true,
      score: 85,
      reason: 'Work quality meets standards',
      feedback: 'Great job!',
      minted: true,
      tokenId: 'token-123',
      txHash: '0xabc',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await assessmentService.callAssessAndMint(
      {
        imageUrl: 'https://example.com/image.jpg',
        userId: 'user-1',
        lessonId: 'lesson-1',
      },
      'access-token'
    );

    expect(result.passed).toBe(true);
    expect(result.score).toBe(85);
    expect(result.minted).toBe(true);
  });

  it('should throw error on 401 unauthorized', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    try {
      await assessmentService.callAssessAndMint(
        {
          imageUrl: 'https://example.com/image.jpg',
          userId: 'user-1',
          lessonId: 'lesson-1',
        },
        'invalid-token'
      );
      fail('Should have thrown');
    } catch (err: any) {
      expect(err.message).toContain('Unauthorized');
    }
  });
});

describe('assessmentService.generateNFTMetadata', () => {
  it('should generate correct NFT metadata', () => {
    const metadata = assessmentService.generateNFTMetadata(
      'Hand Sewing',
      87,
      '2024-11-17T10:00:00Z',
      'https://example.com/badge.png'
    );

    expect(metadata.name).toBe('Skill — Hand Sewing');
    expect(metadata.attributes[1].value).toBe(87);
    expect(metadata.attributes[0].trait_type).toBe('skill');
  });
});
