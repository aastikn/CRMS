'use client';

import { Audience, Rule, RuleGroup as RuleGroupType } from '../lib/types';
import { RuleGroup } from './RuleGroup';

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

type AudienceBuilderProps = {
  audience: Audience;
  setAudience: (audience: Audience) => void;
};

export function AudienceBuilder({ audience, setAudience }: AudienceBuilderProps) {

  const handleAddGroup = () => {
    const newGroup: RuleGroupType = {
      id: generateId(),
      conjunctions: [],
      rules: [{ id: generateId(), field: 'total_spending', operator: 'gt', value: 0 }]
    };
    setAudience({ ...audience, groups: [...audience.groups, newGroup] });
  };

  const handleRemoveGroup = (groupId: string) => {
    setAudience({ ...audience, groups: audience.groups.filter(g => g.id !== groupId) });
  };

  const handleUpdateGroup = (updatedGroup: RuleGroupType) => {
    setAudience({ 
      ...audience, 
      groups: audience.groups.map(g => g.id === updatedGroup.id ? updatedGroup : g)
    });
  };

  const handleMasterConjunctionChange = (conjunction: 'AND' | 'OR') => {
    setAudience({ ...audience, conjunction });
  };

  return (
    <div className="space-y-6 p-4 border border-dashed border-gray-300 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className="text-lg font-semibold">Combine rule groups with:</span>
        <div className="flex rounded-md bg-gray-200 p-1">
          <button 
            onClick={() => handleMasterConjunctionChange('AND')} 
            className={`px-4 py-1 text-sm font-bold rounded-md ${audience.conjunction === 'AND' ? 'bg-green-600 text-white' : 'text-gray-700'}`}>
            AND
          </button>
          <button 
            onClick={() => handleMasterConjunctionChange('OR')} 
            className={`px-4 py-1 text-sm font-bold rounded-md ${audience.conjunction === 'OR' ? 'bg-green-600 text-white' : 'text-gray-700'}`}>
            OR
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {audience.groups.map((group) => {
          const handleAddRule = () => {
            const newRule: Rule = { id: generateId(), field: 'total_spending', operator: 'gt', value: 0 };
            const newConjunctions = [...group.conjunctions];
            if (group.rules.length > 0) {
                newConjunctions.push('AND');
            }
            handleUpdateGroup({ ...group, rules: [...group.rules, newRule], conjunctions: newConjunctions });
          };

          const handleUpdateRule = (ruleId: string, newRuleData: Partial<Rule>) => {
            const updatedRules = group.rules.map(rule => 
              rule.id === ruleId ? { ...rule, ...newRuleData } : rule
            );
            handleUpdateGroup({ ...group, rules: updatedRules });
          };

          const handleRemoveRule = (ruleId: string) => {
            const ruleIndex = group.rules.findIndex(r => r.id === ruleId);
            const updatedRules = group.rules.filter(rule => rule.id !== ruleId);
            const updatedConjunctions = [...group.conjunctions];
            if (ruleIndex > 0) {
                updatedConjunctions.splice(ruleIndex - 1, 1);
            } else if (updatedConjunctions.length > 0) {
                updatedConjunctions.shift();
            }
            handleUpdateGroup({ ...group, rules: updatedRules, conjunctions: updatedConjunctions });
          };

          const handleConjunctionChange = (index: number, conjunction: 'AND' | 'OR') => {
            const newConjunctions = [...group.conjunctions];
            newConjunctions[index] = conjunction;
            handleUpdateGroup({ ...group, conjunctions: newConjunctions });
          };

          return (
            <div key={group.id} className="relative pl-4">
                <RuleGroup
                    group={group}
                    onAddRule={handleAddRule}
                    onUpdateRule={handleUpdateRule}
                    onRemoveRule={handleRemoveRule}
                    onConjunctionChange={handleConjunctionChange}
                />
                {audience.groups.length > 1 && (
                    <button onClick={() => handleRemoveGroup(group.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">&times;</button>
                )}
            </div>
          )
        })}
      </div>

      <button
        onClick={handleAddGroup}
        className="px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-md hover:bg-blue-200"
      >
        + Add Rule Group
      </button>
    </div>
  );
}
