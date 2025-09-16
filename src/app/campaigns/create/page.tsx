'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Audience, MessageSuggestion } from '../../../lib/types';
import { getAudienceSize, launchCampaign, generateMessagesFromObjective } from '../../../lib/api';
import { GeminiQueryGenerator } from '../../../components/GeminiQueryGenerator';
import { AudienceBuilder } from '../../../components/AudienceBuilder';

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const initialAudience: Audience = {
  conjunction: 'AND',
  groups: [
    {
      id: generateId(),
      conjunctions: [],
      rules: [
        { id: generateId(), field: 'total_spending', operator: 'gt', value: 100 },
      ]
    }
  ]
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [campaignObjective, setCampaignObjective] = useState('');
  const [messageSuggestions, setMessageSuggestions] = useState<MessageSuggestion[]>([]);
  const [editorMode, setEditorMode] = useState<'visual' | 'text'>('visual');
  const [rawQuery, setRawQuery] = useState('(total_spending > 100) AND (visit_count < 5)');
  const [error, setError] = useState<string | null>(null);

  const handlePreview = async () => {
    setIsLoading(true);
    setAudienceSize(null);
    setError(null);
    try {
        const payload = editorMode === 'visual' ? { audience } : { rawQuery };
        const data = await getAudienceSize(payload);
        setAudienceSize(data.count);
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('An unexpected error occurred.');
        }
    }
    setIsLoading(false);
  };

  const handleLaunch = async () => {
    if (!campaignName) {
      if (typeof window !== 'undefined') {
        alert('Please enter a campaign name.');
      }
      return;
    }
    if (!campaignMessage) {
      alert('Please enter a campaign message.');
      return;
    }
    
    const payload = editorMode === 'visual' 
      ? { name: campaignName, message: campaignMessage, audience }
      : { name: campaignName, message: campaignMessage, rawQuery };

    if (editorMode === 'visual' && audience.groups.some(g => g.rules.length === 0)) {
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

  const handleGenerateMessages = async () => {
    if (!campaignObjective) {
      alert('Please enter a campaign objective.');
      return;
    }
    setIsLoading(true);
    try {
      const suggestions = await generateMessagesFromObjective(campaignObjective);
      setMessageSuggestions(suggestions);
    } catch (error) {
      console.error(error);
      alert('Failed to generate messages.');
    }
    setIsLoading(false);
  };

  const handleQueryGenerated = (query: string) => {
    setRawQuery(query);
    setEditorMode('text');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">Create New Campaign</h1>

        <div className="space-y-12">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">1. Campaign Details</h2>
            <div className="space-y-6">
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
                
                <div className="p-6 border border-dashed border-teal-400 rounded-lg bg-teal-50">
                    <h3 className="text-xl font-semibold text-teal-800 mb-4">Generate Messages with AI</h3>
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={campaignObjective}
                            onChange={(e) => setCampaignObjective(e.target.value)}
                            placeholder="e.g., bring back inactive users for a special offer"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                        />
                        <button
                            onClick={handleGenerateMessages}
                            disabled={isLoading}
                            className="px-6 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 disabled:bg-gray-400 transition-all transform hover:scale-105"
                        >
                            {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                    {messageSuggestions.length > 0 && (
                        <div className="mt-6 space-y-4">
                            {messageSuggestions.map((suggestion, index) => (
                                <div key={index} className="p-4 bg-white rounded-lg border-2 border-transparent cursor-pointer hover:border-indigo-500 transition-all" onClick={() => setCampaignMessage(suggestion.message)}>
                                    <p className="font-semibold text-gray-800">{suggestion.message}</p>
                                    {suggestion.imageSuggestion && (
                                        <div className="flex items-center mt-2 text-sm text-gray-600">
                                            <Image src={`https://placehold.co/40x40?text=${encodeURIComponent(suggestion.imageSuggestion)}`} alt="Image suggestion" width={40} height={40} className="rounded-md mr-3" />
                                            <span className="font-medium">Image Idea: {suggestion.imageSuggestion}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <textarea
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                  placeholder="Enter your campaign message here, or select a generated one above."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  rows={5}
                />
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">2. Define Your Audience</h2>
            
            <GeminiQueryGenerator onQueryGenerated={handleQueryGenerated} />

            <div className="flex justify-between items-center mt-6 mb-4">
                <h3 className="text-xl font-semibold">Audience Editor</h3>
                <div className="flex rounded-lg bg-gray-200 p-1">
                    <button onClick={() => setEditorMode('visual')} className={`px-4 py-2 text-sm font-bold rounded-md ${editorMode === 'visual' ? 'bg-white shadow-md' : 'text-gray-600'}`}>Visual Builder</button>
                    <button onClick={() => setEditorMode('text')} className={`px-4 py-2 text-sm font-bold rounded-md ${editorMode === 'text' ? 'bg-white shadow-md' : 'text-gray-600'}`}>Raw Query</button>
                </div>
            </div>

            {editorMode === 'visual' ? (
              <AudienceBuilder audience={audience} setAudience={setAudience} />
            ) : (
              <textarea
                value={rawQuery}
                onChange={(e) => setRawQuery(e.target.value)}
                placeholder="e.g. (total_spending > 100) AND (visit_count < 3)"
                className="w-full h-48 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">3. Preview & Launch</h2>
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={handlePreview}
                disabled={isLoading}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 transition-all transform hover:scale-105"
              >
                {isLoading ? 'Calculating...' : 'Calculate Audience'}
              </button>
              {audienceSize !== null && (
                <p className="text-xl">
                  This campaign will be sent to <span className="font-bold text-indigo-600">{audienceSize.toLocaleString()}</span> people.
                </p>
              )}
            </div>
            {error && (
                <p className="text-red-600 bg-red-100 p-3 rounded-lg text-sm mt-4">{error}</p>
            )}
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleLaunch}
              disabled={isLoading || audienceSize === null}
              className="px-10 py-4 bg-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400 transition-all transform hover:scale-105"
            >
              {isLoading ? 'Launching...' : 'Save & Launch Campaign'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}