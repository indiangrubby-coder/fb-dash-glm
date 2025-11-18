import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getFacebookAPI } from '@/lib/simulation';
import { getStatusText } from '@/lib/facebook';

export async function POST(request: NextRequest) {
  try {
    const isSimulation = process.env.APP_ENV === 'simulation';
    const facebookAPI = getFacebookAPI();

    // In simulation mode, we'll create some sample data
    if (isSimulation) {
      await syncSimulationData(facebookAPI);
    } else {
      await syncProductionData(facebookAPI);
    }

    return NextResponse.json({
      success: true,
      message: 'Data synchronized successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function syncSimulationData(facebookAPI: any) {
  // Create a sample vendor if it doesn't exist
  let vendor = await db.vendor.findFirst({
    where: { name: 'Sample Vendor' },
  });

  if (!vendor) {
    vendor = await db.vendor.create({
      data: {
        name: 'Sample Vendor',
        contactTelegram: '@samplevendor',
        businessManagerId: '123456789',
      },
    });
  }

  // Get sample accounts from simulation
  const accounts = await facebookAPI.getAdAccounts('123456789');
  
  for (const fbAccount of accounts) {
    // Upsert account
    const account = await db.adAccount.upsert({
      where: { id: fbAccount.id },
      update: {
        name: fbAccount.name,
        status: getStatusText(fbAccount.account_status),
        currency: fbAccount.currency,
        lastSeenAt: new Date(),
      },
      create: {
        id: fbAccount.id,
        name: fbAccount.name,
        vendorId: vendor.id,
        businessManagerId: fbAccount.business?.name || 'Unknown',
        status: getStatusText(fbAccount.account_status),
        currency: fbAccount.currency,
        timezone: 'UTC',
        lastSeenAt: new Date(),
      },
    });

    // Get account details and insights
    const details = await facebookAPI.getAccountDetails(fbAccount.id);
    const insights = await facebookAPI.getAccountInsights(fbAccount.id);

    // Upsert metrics with proper Date object
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    
    await db.accountMetric.upsert({
      where: {
        adAccountId_date: {
          adAccountId: account.id,
          date: today,
        },
      },
      update: {
        spend: insights.spend,
        spendCap: details.spend_cap,
        clicks: insights.clicks,
        impressions: insights.impressions,
        cpc: insights.cpc,
        balance: details.balance,
        statusAtFetch: getStatusText(details.account_status),
        fetchedAt: new Date(),
      },
      create: {
        adAccountId: account.id,
        date: today,
        spend: insights.spend,
        spendCap: details.spend_cap,
        clicks: insights.clicks,
        impressions: insights.impressions,
        cpc: insights.cpc,
        balance: details.balance,
        statusAtFetch: getStatusText(details.account_status),
        fetchedAt: new Date(),
      },
    });
  }
}

async function syncProductionData(facebookAPI: any) {
  const businessId = process.env.FACEBOOK_BUSINESS_ID;
  
  if (!businessId) {
    throw new Error('Facebook Business ID is required in production mode');
  }

  // Get real accounts from Facebook
  const accounts = await facebookAPI.getAdAccounts(businessId);
  
  for (const fbAccount of accounts) {
    // Find or create vendor (you might want to implement vendor mapping logic)
    let vendor = await db.vendor.findFirst({
      where: { businessManagerId: fbAccount.business?.name || 'Unknown' },
    });

    if (!vendor) {
      vendor = await db.vendor.create({
        data: {
          name: fbAccount.business?.name || 'Unknown Vendor',
          businessManagerId: fbAccount.business?.name || 'Unknown',
        },
      });
    }

    // Upsert account
    const account = await db.adAccount.upsert({
      where: { id: fbAccount.id },
      update: {
        name: fbAccount.name,
        status: getStatusText(fbAccount.account_status),
        currency: fbAccount.currency,
        lastSeenAt: new Date(),
      },
      create: {
        id: fbAccount.id,
        name: fbAccount.name,
        vendorId: vendor.id,
        businessManagerId: fbAccount.business?.name || 'Unknown',
        status: getStatusText(fbAccount.account_status),
        currency: fbAccount.currency,
        timezone: 'UTC', // You might want to map timezone_id to actual timezone
        lastSeenAt: new Date(),
      },
    });

    // Get account details and insights
    const details = await facebookAPI.getAccountDetails(fbAccount.id);
    const insights = await facebookAPI.getAccountInsights(fbAccount.id);

    // Upsert metrics with proper Date object
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    
    await db.accountMetric.upsert({
      where: {
        adAccountId_date: {
          adAccountId: account.id,
          date: today,
        },
      },
      update: {
        spend: insights.spend,
        spendCap: details.spend_cap,
        clicks: insights.clicks,
        impressions: insights.impressions,
        cpc: insights.cpc,
        balance: details.balance,
        statusAtFetch: getStatusText(details.account_status),
        fetchedAt: new Date(),
      },
      create: {
        adAccountId: account.id,
        date: today,
        spend: insights.spend,
        spendCap: details.spend_cap,
        clicks: insights.clicks,
        impressions: insights.impressions,
        cpc: insights.cpc,
        balance: details.balance,
        statusAtFetch: getStatusText(details.account_status),
        fetchedAt: new Date(),
      },
    });
  }
}