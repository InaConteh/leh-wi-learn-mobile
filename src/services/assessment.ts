import { supabase } from './supabase';
import { AssessmentResult, NFTMetadata } from '../types';

const EDGE_URL = process.env.EXPO_PUBLIC_EDGE_URL || '';
const CONTRACT_ADDRESS = process.env.EXPO_PUBLIC_CONTRACT_ADDRESS || '';

export interface AssessmentRequest {
  imageUrl: string;
  userId: string;
  lessonId: string;
}

export interface AssessmentResponse {
  passed: boolean;
  score: number;
  reason: string;
  feedback?: string;
  minted?: boolean;
  tokenId?: string;
  txHash?: string;
}

export const assessmentService = {
  async uploadSubmissionImage(
    file: { uri: string; type: string; name: string },
    userId: string
  ): Promise<string> {
    const fileName = `submissions/${userId}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from('submissions')
      .upload(fileName, file as any);

    if (error) throw error;
    if (!data) throw new Error('No upload data returned');

    const { data: publicUrl } = supabase.storage
      .from('submissions')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  },

  async callAssessAndMint(
    request: AssessmentRequest,
    accessToken: string
  ): Promise<AssessmentResponse> {
    const response = await fetch(`${EDGE_URL}/assess-and-mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('Unauthorized');
      throw new Error(`Assessment failed: ${response.statusText}`);
    }

    const data: AssessmentResponse = await response.json();
    return data;
  },

  generateNFTMetadata(
    lessonTitle: string,
    score: number,
    issuedAt: string,
    badgeUrl: string
  ): NFTMetadata {
    return {
      name: `Skill — ${lessonTitle}`,
      description: `Certified by Leh Wi Learn. Score: ${score}. Issued: ${issuedAt}`,
      image: badgeUrl,
      attributes: [
        { trait_type: 'skill', value: lessonTitle },
        { trait_type: 'score', value: score },
        { trait_type: 'issued_at', value: issuedAt },
      ],
    };
  },
};
