import { Audience, CampaignHistoryItem } from './types';

const API_BASE_URL = '/api/v1';

function getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    }
}

// Function to get audience size
export async function getAudienceSize(payload: { audience?: Audience, rawQuery?: string }): Promise<{ count: number }> {
  const response = await fetch(`${API_BASE_URL}/audiences/preview`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch audience size');
  }

  const result = await response.json();
  return { count: result.data };
}

// Function to launch a campaign
export async function launchCampaign(campaign: { name: string, message: string, audience?: Audience, rawQuery?: string }): Promise<{ success: boolean; campaignId: string }> {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(campaign),
    });

    if (!response.ok) {
        throw new Error('Failed to launch campaign');
    }
    
    const result = await response.json();
    return { success: true, campaignId: result.data.id };
}

// Function to fetch past campaigns
export async function fetchCampaigns(): Promise<CampaignHistoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/campaigns`, { headers: getAuthHeaders() });

    if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
    }

    const result = await response.json();
    return result.data;
}