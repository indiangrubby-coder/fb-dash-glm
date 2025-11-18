import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/get-user';
import { getFacebookAPI } from '@/lib/simulation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = params.id;

    // Get account from database
    const account = await db.adAccount.findUnique({
      where: { id: accountId },
      include: {
        vendor: true,
        accountMetrics: {
          orderBy: { fetchedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Get campaigns from Facebook API or simulation
    const facebookAPI = getFacebookAPI();
    const campaigns = await facebookAPI.getCampaigns(accountId);

    return NextResponse.json({
      account: {
        id: account.id,
        name: account.name,
        vendor: account.vendor?.name || 'Unknown',
        businessManagerId: account.businessManagerId,
        status: account.status,
        currency: account.currency,
        timezone: account.timezone,
        lastSeenAt: account.lastSeenAt,
        createdAt: account.createdAt,
      },
      campaigns,
      metrics: account.accountMetrics,
    });
  } catch (error) {
    console.error('Error fetching account details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}