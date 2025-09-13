import { Audience, Campaign, Rule, RuleGroup } from './types';

// Mock function to get audience size
export async function getAudienceSize(payload: { audience?: Audience, rawQuery?: string }): Promise<{ count: number }> {
  console.log('Fetching audience size for payload:', payload);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      let count = 0;
      if (payload.rawQuery) {
        // Super simple dummy logic for raw query
        count = 1000 - (payload.rawQuery.length * 5);
      } else if (payload.audience) {
        // Logic from before
        count = 1000;
        if (payload.audience.conjunction === 'AND') {
            const groupCounts = payload.audience.groups.map(group => {
                return Math.max(0, 1000 - (group.rules.length * (group.conjunctions.includes('OR') ? 50 : 150)));
            });
            count = Math.min(...groupCounts, 1000);
        } else {
            const groupCounts = payload.audience.groups.map(group => {
                return Math.max(0, 1000 - (group.rules.length * (group.conjunctions.includes('OR') ? 50 : 150)));
            });
            count = Math.min(1000, Math.max(...groupCounts, 0));
        }
      }
      resolve({ count: Math.floor(Math.max(0, count)) });
    }, 500);
  });
}

// Mock function to launch a campaign
export async function launchCampaign(campaign: { name: string, message: string, audience?: Audience, rawQuery?: string }): Promise<{ success: boolean; campaignId: string }> {
  console.log('Launching campaign:', campaign);
  // In a real app, this would make a POST request to /api/v1/campaigns
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, campaignId: `camp_${Date.now()}` });
    }, 1000);
  });
}
