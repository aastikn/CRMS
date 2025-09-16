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
    <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_auto] gap-3 items-center">
      <select
        value={rule.field}
        onChange={(e) => onUpdate(rule.id, { field: e.target.value as RuleType['field'] })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
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
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
      >
        {availableOperators.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="flex items-center">
        <input
          type="number"
          value={rule.value}
          onChange={(e) => onUpdate(rule.id, { value: Number(e.target.value) })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          placeholder="Value"
        />
        {rule.field === 'last_visit_days_ago' && <span className="ml-2 text-gray-600 font-medium">days</span>}
      </div>

      <button
        onClick={() => onRemove(rule.id)}
        className="px-3 py-3 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors"
      >
        &times;
      </button>
    </div>
  );
}
