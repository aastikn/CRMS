'use client';

import { useState, useCallback, useRef } from 'react';
import { generateQueryFromPrompt } from '../lib/api';

type Props = {
  onQueryGenerated: (query: string) => void;
};

export function GeminiQueryGenerator({ onQueryGenerated }: Props) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleGenerate = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (!prompt) {
        setError('Please enter a prompt.');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await generateQueryFromPrompt(prompt);
        onQueryGenerated(data.query);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce delay

  }, [prompt, onQueryGenerated]);

  return (
    <div className="p-4 border border-dashed border-blue-400 rounded-lg bg-blue-50 mt-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">Generate with AI</h3>
      <p className="text-sm text-gray-600 mb-4">
        Describe the audience you want to target in plain English, and AI will generate the query for you.
        For example: &quot;Customers who have spent more than $500 and visited in the last 30 days.&quot;
      </p>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
