import { Audience, CampaignHistoryItem, Order, Customer, PaginatedResponse, MessageSuggestion, AnalyticsDataPoint } from './types';

const API_BASE_URL = '/api/v1';

function getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    }
}

// CAMPAIGN API
export async function getAudienceSize(payload: { audience?: Audience, rawQuery?: string }): Promise<{ count: number }> {
  const response = await fetch(`${API_BASE_URL}/audiences/preview`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch audience size' }));
    throw new Error(errorData.message || 'Failed to fetch audience size');
  }
  const result = await response.json();
  return { count: result.data };
}

export async function launchCampaign(campaign: { name: string, message: string, audience?: Audience, rawQuery?: string }): Promise<{ success: boolean; campaignId: string }> {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(campaign),
    });
    if (!response.ok) throw new Error('Failed to launch campaign');
    const result = await response.json();
    return { success: true, campaignId: result.data.id };
}

export async function fetchCampaigns(): Promise<CampaignHistoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/campaigns`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    const result = await response.json();
    return result.data;
}


// ORDER API
export async function fetchRecentOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders?sort=createdAt,desc&size=5`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch recent orders');
    const result = await response.json();
    return result.data.content;
}

export async function fetchOrders(page: number, size: number): Promise<PaginatedResponse<Order>> {
  const query = new URLSearchParams({ page: String(page), size: String(size), sort: 'orderDate,desc' }).toString();
  const response = await fetch(`${API_BASE_URL}/orders?${query}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch orders');
  const result = await response.json();
  return result.data;
}

export async function fetchOrdersByCustomer(customerId: number): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/customers/${customerId}/orders`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch orders for customer');
  const result = await response.json();
  return result.data;
}

export async function createOrder(order: { customerId: number; orderAmount: number; orderDate: string; }): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create order' }));
    throw new Error(errorData.message);
  }
  return response.json();
}


// CUSTOMER API
export async function fetchCustomers(page: number, size: number): Promise<PaginatedResponse<Customer>> {
  const query = new URLSearchParams({ page: String(page), size: String(size), sort: 'createdAt,desc' }).toString();
  const response = await fetch(`${API_BASE_URL}/customers?${query}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch customers');
  const result = await response.json();
  return result.data;
}

export async function fetchCustomerById(id: number): Promise<Customer> {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch customer');
  const result = await response.json();
  return result.data;
}

export async function searchCustomers(params: { [key: string]: string }): Promise<Customer[]> {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/customers/search?${query}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to search customers');
  const result = await response.json();
  return result.data;
}

export async function createCustomer(customer: Partial<Customer>): Promise<Customer> {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create customer' }));
    throw new Error(errorData.message);
  }
  return response.json();
}

export async function createCustomersBulk(customers: Partial<Customer>[]): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/customers/bulk`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(customers),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to import customers' }));
    throw new Error(errorData.message);
  }
  return response.json();
}

// AI API
export async function generateQueryFromPrompt(prompt: string): Promise<{ query: string }> {
  const response = await fetch(`${API_BASE_URL}/ai/generate-query`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to generate query from AI' }));
    throw new Error(errorData.message);
  }
  const result = await response.json();
  return result.data;
}

export async function generateMessagesFromObjective(objective: string): Promise<MessageSuggestion[]> {
  const response = await fetch(`${API_BASE_URL}/ai/generate-messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ objective }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to generate messages from AI' }));
    throw new Error(errorData.message);
  }
  const result = await response.json();
  return result.data.messages;
}

// DASHBOARD API
export async function fetchOrdersByDay(days = 30): Promise<AnalyticsDataPoint[]> {
  const response = await fetch(`${API_BASE_URL}/dashboard/orders-by-day?days=${days}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch orders by day');
  const result = await response.json();
  return result.data;
}

export async function fetchUsersByDay(days = 30): Promise<AnalyticsDataPoint[]> {
  const response = await fetch(`${API_BASE_URL}/dashboard/users-by-day?days=${days}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch users by day');
  const result = await response.json();
  return result.data;
}
