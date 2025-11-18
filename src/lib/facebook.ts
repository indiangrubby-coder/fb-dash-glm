interface FacebookAdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  timezone_id: number;
  business?: {
    name: string;
  };
}

interface FacebookCampaign {
  id: string;
  name: string;
  status: string;
  effective_status: string;
}

interface FacebookInsights {
  spend: number;
  clicks: number;
  impressions: number;
  cpc: number;
}

interface FacebookAccountDetails {
  account_status: number;
  spend_cap: number;
  currency: string;
  balance: number;
}

export class FacebookAPI {
  private accessToken: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}, method: 'GET' | 'POST' = 'GET'): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (method === 'GET') {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      ...(method === 'POST' && { body: JSON.stringify(params) }),
    });

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAdAccounts(businessId: string): Promise<FacebookAdAccount[]> {
    const response = await this.makeRequest(`/${businessId}/client_ad_accounts`, {
      fields: 'id,name,account_status,currency,timezone_id,business',
    });

    return response.data || [];
  }

  async getAccountDetails(accountId: string): Promise<FacebookAccountDetails> {
    const response = await this.makeRequest(`/${accountId}`, {
      fields: 'account_status,spend_cap,currency,balance',
    });

    return response;
  }

  async getAccountInsights(accountId: string, date: string = 'today'): Promise<FacebookInsights> {
    const response = await this.makeRequest(`/act_${accountId}/insights`, {
      time_range: JSON.stringify({
        since: date,
        until: date,
      }),
      fields: 'spend,clicks,impressions,cpc',
    });

    const data = response.data?.[0];
    return {
      spend: parseFloat(data?.spend || '0'),
      clicks: parseInt(data?.clicks || '0'),
      impressions: parseInt(data?.impressions || '0'),
      cpc: parseFloat(data?.cpc || '0'),
    };
  }

  async getCampaigns(accountId: string): Promise<FacebookCampaign[]> {
    const response = await this.makeRequest(`/act_${accountId}/campaigns`, {
      fields: 'id,name,status,effective_status',
    });

    return response.data || [];
  }

  async updateCampaignStatus(campaignId: string, status: 'ACTIVE' | 'PAUSED'): Promise<void> {
    await this.makeRequest(`/${campaignId}`, {
      status,
    }, 'POST');
  }

  async pauseAllCampaigns(accountId: string): Promise<void> {
    const campaigns = await this.getCampaigns(accountId);
    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE');

    // Batch update campaigns
    const batchRequests = activeCampaigns.map(campaign => ({
      method: 'POST',
      relative_url: campaign.id,
      body: `status=PAUSED`,
    }));

    await this.makeRequest('/', {
      batch: batchRequests,
    }, 'POST');
  }
}

export function getStatusText(statusCode: number): string {
  const statusMap: Record<number, string> = {
    1: 'ACTIVE',
    2: 'DISABLED',
    3: 'UNSETTLED',
    7: 'PENDING_RISK_REVIEW',
    8: 'PENDING_SETTLEMENT',
    9: 'IN_GRACE_PERIOD',
    100: 'PENDING_CLOSURE',
    101: 'CLOSED',
    201: 'ADVERTISER_DISABLED',
  };

  return statusMap[statusCode] || 'UNKNOWN';
}