export type Rule = {
  id: string;
  field: 'total_spending' | 'visit_count' | 'last_visit_days_ago';
  operator: 'gt' | 'lt' | 'eq' | 'within_last_days';
  value: number;
};

export type RuleGroup = {
  id: string;
  conjunctions: ('AND' | 'OR')[];
  rules: Rule[];
};

export type Audience = {
  conjunction: 'AND' | 'OR';
  groups: RuleGroup[];
};

export type Campaign = {
  audience: Audience;
  name: string;
  message: string;
};

export type CampaignHistoryItem = {
  id: string;
  name: string;
  message: string;
  audienceSize: number;
  sentCount: number;
  failedCount: number;
  createdAt: string; // ISO date string
};

export type MessageSuggestion = {
  message: string;
  imageSuggestion: string;
};

export type Order = {
  id: number;
  customerId: number;
  orderAmount: number;
  orderDate: string; // ISO date string
  status: string;
  description: string;
  createdAt: string; // ISO date string
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalSpending: number;
  visitCount: number;
  lastVisit: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type PaginatedResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page number
  size: number;
};