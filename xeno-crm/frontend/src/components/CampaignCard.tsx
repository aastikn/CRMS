'use client';

import { CampaignHistoryItem } from "../lib/types";

function Stat({ label, value }: { label: string, value: string | number }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-800">{value}</p>
        </div>
    )
}

export function CampaignCard({ campaign }: { campaign: CampaignHistoryItem }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-bold text-gray-800">{campaign.name}</p>
                <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${
                    campaign.status === 'COMPLETED' ? 'bg-green-500' :
                    campaign.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                    campaign.status === 'FAILED' ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                    {campaign.status}
                </span>
            </div>
            <div className="mb-4">
                <p className="text-sm text-gray-500">Message</p>
                <p className="text-gray-800 text-lg italic">"{campaign.message}"</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <Stat label="Audience" value={campaign.audienceSize.toLocaleString()} />
                <Stat label="Sent" value={campaign.sentCount.toLocaleString()} />
                <Stat label="Failed" value={campaign.failedCount.toLocaleString()} />
                <Stat label="Created At" value={new Date(campaign.createdAt).toLocaleString()} />
            </div>
        </div>
    )
}
