import { Audience, CampaignHistoryItem, Order, Customer, PaginatedResponse } from './types';

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

// Function to fetch past orders
export async function fetchOrders(): Promise<Order[]> {
    // Fetch recent orders, sorted by creation date
    const response = await fetch(`${API_BASE_URL}/orders?sort=createdAt,desc&size=5`, { headers: getAuthHeaders() });

    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }

    const result = await response.json();
    // The backend returns a pageable object, the data is in result.data.content
    return result.data.content;
}

// Function to fetch paginated customers
export async function fetchCustomers(page: number, size: number): Promise<PaginatedResponse<Customer>> {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: 'createdAt,desc'
  }).toString();
  
  const response = await fetch(`${API_BASE_URL}/customers?${query}`, { headers: getAuthHeaders() });

  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }

  const result = await response.json();
  return result.data;
}

// Function to search for customers
export async function searchCustomers(params: { [key: string]: any }): Promise<Customer[]> {
  const query = new URLSearchParams(params).toString();
  
  const response = await fetch(`${API_BASE_URL}/customers/search?${query}`, { headers: getAuthHeaders() });

  if (!response.ok) {
    throw new Error('Failed to search customers');
  }

  const result = await response.json();
  return result.data;
}