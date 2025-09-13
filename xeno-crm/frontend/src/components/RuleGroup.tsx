'use client';

import { Rule as RuleType, RuleGroup as RuleGroupType } from '../lib/types';
import { Rule } from './Rule';

type RuleGroupProps = {
  group: RuleGroupType;
  onUpdateRule: (ruleId: string, newRule: Partial<RuleType>) => void;
  onRemoveRule: (ruleId: string) => void;
  onAddRule: () => void;
  onConjunctionChange: (index: number, conjunction: 'AND' | 'OR') => void;
};

export function RuleGroup({ group, onUpdateRule, onRemoveRule, onAddRule, onConjunctionChange }: RuleGroupProps) {
  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
      <div className="space-y-3">
        {group.rules.map((rule, index) => (
          <div key={rule.id}>
            <Rule
              rule={rule}
              onUpdate={onUpdateRule}
              onRemove={onRemoveRule}
            />
            {index < group.rules.length - 1 && (
              <div className="flex justify-center my-2">
                  <div className="flex rounded-md bg-gray-100 p-1">
                      <button 
                          onClick={() => onConjunctionChange(index, 'AND')} 
                          className={`px-3 py-1 text-sm font-semibold rounded-md ${group.conjunctions[index] === 'AND' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}>
                          AND
                      </button>
                      <button 
                          onClick={() => onConjunctionChange(index, 'OR')} 
                          className={`px-3 py-1 text-sm font-semibold rounded-md ${group.conjunctions[index] === 'OR' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}>
                          OR
                      </button>
                  </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onAddRule}
        className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 mt-4"
      >
        + Add Rule
      </button>
    </div>
  );
}
