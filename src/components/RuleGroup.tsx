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
    <div className="space-y-4">
      <div className="space-y-4">
        {group.rules.map((rule, index) => (
          <div key={rule.id}>
            <Rule
              rule={rule}
              onUpdate={onUpdateRule}
              onRemove={onRemoveRule}
            />
            {index < group.rules.length - 1 && (
              <div className="flex justify-center my-4">
                  <div className="flex rounded-lg bg-gray-200 p-1">
                      <button 
                          onClick={() => onConjunctionChange(index, 'AND')} 
                          className={`px-3 py-1 text-sm font-bold rounded-md ${group.conjunctions[index] === 'AND' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600'}`}>
                          AND
                      </button>
                      <button 
                          onClick={() => onConjunctionChange(index, 'OR')} 
                          className={`px-3 py-1 text-sm font-bold rounded-md ${group.conjunctions[index] === 'OR' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600'}`}>
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
        className="w-full px-4 py-2 bg-indigo-100 text-indigo-800 font-semibold rounded-lg hover:bg-indigo-200 transition-all"
      >
        + Add Rule
      </button>
    </div>
  );
}
