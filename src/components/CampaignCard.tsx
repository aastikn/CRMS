'use client';

import { CampaignHistoryItem } from "../lib/types";

function Stat({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
    )
}

export function CampaignCard({ campaign }: { campaign: CampaignHistoryItem }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-indigo-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xl font-bold text-gray-900">{campaign.name}</p>
                    <p className="text-sm text-gray-400">Created: {new Date(campaign.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${
                    campaign.status === 'COMPLETED' ? 'bg-green-600' :
                    campaign.status === 'IN_PROGRESS' ? 'bg-indigo-500' :
                    campaign.status === 'FAILED' ? 'bg-red-600' : 'bg-gray-500'
                }`}>
                    {campaign.status}
                </span>
            </div>
            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Message</p>
                <p className="text-gray-700 text-lg italic bg-gray-50 p-4 rounded-lg">&quot;{campaign.message}&quot;</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Stat label="Audience Size" value={campaign.audienceSize.toLocaleString()} />
                <Stat label="Successfully Sent" value={campaign.sentCount.toLocaleString()} />
                <Stat label="Failed to Send" value={campaign.failedCount.toLocaleString()} />
            </div>
        </div>
    )
}
