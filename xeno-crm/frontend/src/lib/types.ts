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
  message: string;
  audienceSize: number;
  sentCount: number;
  failedCount: number;
  createdAt: string; // ISO date string
};
