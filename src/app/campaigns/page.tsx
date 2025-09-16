'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCampaigns } from "../../lib/api";
import { CampaignHistoryItem } from "../../lib/types";
import { CampaignCard } from "../../components/CampaignCard";

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<CampaignHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCampaigns() {
            try {
                setIsLoading(true);
                const data = await fetchCampaigns();
                // Sort to show the most recent campaign at the top
                data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setCampaigns(data);
            } catch (err) {
                setError("Failed to fetch campaigns.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        loadCampaigns();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const hasInProgressCampaigns = campaigns.some(c => c.status === 'IN_PROGRESS');
            if (hasInProgressCampaigns) {
                fetchCampaigns().then(data => {
                    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setCampaigns(data);
                });
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [campaigns]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <main className="max-w-5xl mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Campaign History</h1>
                    <Link href="/campaigns/create">
                        <span className="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                            + New Campaign
                        </span>
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    {isLoading && <p className="text-center text-gray-500">Loading campaigns...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    {!isLoading && !error && (
                        <div className="space-y-6">
                            {campaigns.length > 0 ? (
                                campaigns.map(campaign => (
                                    <CampaignCard key={campaign.id} campaign={campaign} />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No campaigns found.</p>
                                    <p className="text-gray-400 mt-2">Get started by creating a new campaign.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
