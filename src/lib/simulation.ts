import { FacebookAdAccount, FacebookCampaign, FacebookInsights, FacebookAccountDetails, getStatusText, FacebookAPI } from './facebook';

export class SimulationAPI {
  private generateRandomId(): string {
    return `act_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRandomName(prefix: string): string {
    const suffixes = ['Pro', 'Max', 'Plus', 'Ultra', 'Elite', 'Premium'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix} ${suffix}`;
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  async getAdAccounts(businessId: string): Promise<FacebookAdAccount[]> {
    const accounts: FacebookAdAccount[] = [];
    const numAccounts = this.generateRandomNumber(3, 8);

    for (let i = 0; i < numAccounts; i++) {
      const statusCode = this.generateRandomNumber(1, 9);
      accounts.push({
        id: this.generateRandomId(),
        name: this.generateRandomName('Account'),
        account_status: statusCode,
        currency: 'USD',
        timezone_id: 1,
        business: {
          name: 'Test Business',
        },
      });
    }

    return accounts;
  }

  async getAccountDetails(accountId: string): Promise<FacebookAccountDetails> {
    return {
      account_status: this.generateRandomNumber(1, 9),
      spend_cap: this.generateRandomFloat(100, 10000),
      currency: 'USD',
      balance: this.generateRandomFloat(-100, 5000),
    };
  }

  async getAccountInsights(accountId: string, date: string = 'today'): Promise<FacebookInsights> {
    const clicks = this.generateRandomNumber(0, 1000);
    const spend = this.generateRandomFloat(0, 500);
    
    return {
      spend,
      clicks,
      impressions: this.generateRandomNumber(clicks * 10, clicks * 100),
      cpc: clicks > 0 ? spend / clicks : 0,
    };
  }

  async getCampaigns(accountId: string): Promise<FacebookCampaign[]> {
    const campaigns: FacebookCampaign[] = [];
    const numCampaigns = this.generateRandomNumber(2, 6);

    for (let i = 0; i < numCampaigns; i++) {
      const status = Math.random() > 0.3 ? 'ACTIVE' : 'PAUSED';
      campaigns.push({
        id: `camp_${Math.random().toString(36).substr(2, 9)}`,
        name: this.generateRandomName('Campaign'),
        status,
        effective_status: status,
      });
    }

    return campaigns;
  }

  async updateCampaignStatus(campaignId: string, status: 'ACTIVE' | 'PAUSED'): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    // In simulation, we don't actually update anything
  }

  async pauseAllCampaigns(accountId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    // In simulation, we don't actually update anything
  }
}

export function getFacebookAPI() {
  const isSimulation = process.env.APP_ENV === 'simulation';
  
  if (isSimulation) {
    return new SimulationAPI();
  }

  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Facebook access token is required in production mode');
  }

  return new FacebookAPI(accessToken);
}