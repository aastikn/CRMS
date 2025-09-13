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

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <main className="max-w-4xl mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Campaign History</h1>
                    <Link href="/campaigns/create">
                        <span className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 cursor-pointer">
                            + New Campaign
                        </span>
                    </Link>
                </div>

                {isLoading && <p className="text-center">Loading campaigns...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!isLoading && !error && (
                    <div className="space-y-6">
                        {campaigns.length > 0 ? (
                            campaigns.map(campaign => (
                                <CampaignCard key={campaign.id} campaign={campaign} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No campaigns found.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
