'use client';

import { Rule as RuleType } from '../lib/types';

type RuleProps = {
  rule: RuleType;
  onUpdate: (id: string, newRule: Partial<RuleType>) => void;
  onRemove: (id: string) => void;
};

const FIELD_OPTIONS = [
  { value: 'total_spending', label: 'Total Spending' },
  { value: 'visit_count', label: 'Visit Count' },
  { value: 'last_visit_days_ago', label: 'Last Visit (Days Ago)' },
];

const OPERATOR_OPTIONS: Record<RuleType['field'], {value: RuleType['operator'], label: string}[]> = {
  total_spending: [
    { value: 'gt', label: 'Greater than' },
    { value: 'lt', label: 'Less than' },
    { value: 'eq', label: 'Equal to' },
  ],
  visit_count: [
    { value: 'gt', label: 'Greater than' },
    { value: 'lt', label: 'Less than' },
    { value: 'eq', label: 'Equal to' },
  ],
  last_visit_days_ago: [
    { value: 'within_last_days', label: 'Is within the last' },
    { value: 'gt', label: 'Is more than' },
    { value: 'lt', label: 'Is less than' },
  ],
};

export function Rule({ rule, onUpdate, onRemove }: RuleProps) {
  const availableOperators = OPERATOR_OPTIONS[rule.field] || OPERATOR_OPTIONS['total_spending'];

  // When field changes, if the current operator isn't valid for the new field, default to the first valid one.
  if (availableOperators && !availableOperators.find(op => op.value === rule.operator)) {
    onUpdate(rule.id, { operator: availableOperators[0].value });
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md border">
      <select
        value={rule.field}
        onChange={(e) => onUpdate(rule.id, { field: e.target.value as RuleType['field'] })}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {FIELD_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={rule.operator}
        onChange={(e) => onUpdate(rule.id, { operator: e.target.value as RuleType['operator'] })}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableOperators.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="flex items-center flex-grow">
        <input
          type="number"
          value={rule.value}
          onChange={(e) => onUpdate(rule.id, { value: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Value"
        />
        {rule.field === 'last_visit_days_ago' && <span className="ml-2 text-gray-600">days</span>}
      </div>

      <button
        onClick={() => onRemove(rule.id)}
        className="px-3 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
      >
        Remove
      </button>
    </div>
  );
}