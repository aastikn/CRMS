'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Audience, Rule, RuleGroup as RuleGroupType } from '../../../lib/types';
import { getAudienceSize, launchCampaign } from '../../../lib/api';
import { GeminiQueryGenerator } from '../../../components/GeminiQueryGenerator';
import { AudienceBuilder } from '../../../components/AudienceBuilder';

const generateId = () =>
  `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const initialAudience: Audience = {
  conjunction: 'AND',
  groups: [
    {
      id: generateId(),
      conjunctions: [],
      rules: [
        {
          id: generateId(),
          field: 'total_spending',
          operator: 'gt',
          value: 100,
        },
      ],
    },
  ],
};

export default function CreateCampaignPage() {
  const router = useRouter();
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [editorMode, setEditorMode] = useState<'visual' | 'text'>('visual');
  const [rawQuery, setRawQuery] = useState(
    '(total_spending > 100) AND (visit_count < 5)'
  );

  const handlePreview = async () => {
    setIsLoading(true);
    setAudienceSize(null);
    const payload = editorMode === 'visual' ? { audience } : { rawQuery };
    const data = await getAudienceSize(payload);
    setAudienceSize(data.count);
    setIsLoading(false);
  };

  const handleLaunch = async () => {
    if (!campaignName) {
      alert('Please enter a campaign name.');
      return;
    }
    if (!campaignMessage) {
      alert('Please enter a campaign message.');
      return;
    }

    const payload =
      editorMode === 'visual'
        ? { name: campaignName, message: campaignMessage, audience }
        : { name: campaignName, message: campaignMessage, rawQuery };

    if (
      editorMode === 'visual' &&
      audience.groups.some((g) => g.rules.length === 0)
    ) {
      alert('All rule groups must contain at least one rule.');
      return;
    }
    if (editorMode === 'text' && !rawQuery) {
      alert('Query cannot be empty.');
      return;
    }

    setIsLoading(true);
    const result = await launchCampaign(payload);
    if (result.success) {
      router.push('/campaigns');
    } else {
      alert('Failed to launch campaign.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Campaign
        </h1>

        <div className="space-y-10">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                placeholder="Enter campaign message for your audience..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Audience Rules</h2>
              <div className="flex rounded-md bg-gray-100 p-1">
                <button
                  onClick={() => setEditorMode('visual')}
                  className={`px-3 py-1 text-sm font-semibold rounded-md ${
                    editorMode === 'visual'
                      ? 'bg-white shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Visual
                </button>
                <button
                  onClick={() => setEditorMode('text')}
                  className={`px-3 py-1 text-sm font-semibold rounded-md ${
                    editorMode === 'text'
                      ? 'bg-white shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Text
                </button>
              </div>
            </div>

            {editorMode === 'visual' ? (
              <AudienceBuilder audience={audience} setAudience={setAudience} />
            ) : (
              <div>
                <textarea
                  value={rawQuery}
                  onChange={(e) => setRawQuery(e.target.value)}
                  placeholder="e.g. (total_spending > 100) AND (visit_count < 3)"
                  className="w-full h-48 p-2 font-mono text-sm bg-gray-900 text-green-400 rounded-md focus:outline-none
                    focus:ring-2 focus:ring-blue-500"
                />
                <GeminiQueryGenerator onQueryGenerated={setRawQuery} />
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Audience Preview</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePreview}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Calculating...' : 'Calculate Audience'}
              </button>
              {audienceSize !== null && (
                <p className="text-lg">
                  This campaign will be sent to{' '}
                  <span className="font-bold">{audienceSize}</span> people.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleLaunch}
              disabled={isLoading || audienceSize === null}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Launching...' : 'Save & Launch Campaign'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
