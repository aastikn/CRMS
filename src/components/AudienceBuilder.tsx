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
    <div className="space-y-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-4">
        <span className="text-lg font-semibold text-gray-700">Combine rule groups with:</span>
        <div className="flex rounded-lg bg-gray-200 p-1">
          <button 
            onClick={() => handleMasterConjunctionChange('AND')} 
            className={`px-4 py-2 text-sm font-bold rounded-md ${audience.conjunction === 'AND' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700'}`}>
            AND
          </button>
          <button 
            onClick={() => handleMasterConjunctionChange('OR')} 
            className={`px-4 py-2 text-sm font-bold rounded-md ${audience.conjunction === 'OR' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700'}`}>
            OR
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {audience.groups.map((group, index) => {
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
            <div key={group.id} className="relative">
                {index > 0 && (
                    <div className="flex justify-center my-4">
                        <span className="text-sm font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{audience.conjunction}</span>
                    </div>
                )}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <RuleGroup
                        group={group}
                        onAddRule={handleAddRule}
                        onUpdateRule={handleUpdateRule}
                        onRemoveRule={handleRemoveRule}
                        onConjunctionChange={handleConjunctionChange}
                    />
                    {audience.groups.length > 1 && (
                        <button onClick={() => handleRemoveGroup(group.id)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-lg hover:bg-red-600 transition-transform transform hover:scale-110">&times;</button>
                    )}
                </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleAddGroup}
        className="w-full px-6 py-3 bg-indigo-100 text-indigo-800 font-bold rounded-lg hover:bg-indigo-200 transition-all"
      >
        + Add Rule Group
      </button>
    </div>
  );
}
