import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/get-user';

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all ad accounts with their vendors and latest metrics
    const accounts = await db.adAccount.findMany({
      include: {
        vendor: true,
        accountMetrics: {
          orderBy: { fetchedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format the response
    const formattedAccounts = accounts.map(account => ({
      id: account.id,
      name: account.name,
      vendor: account.vendor?.name || 'Unknown',
      businessManagerId: account.businessManagerId,
      status: account.status,
      currency: account.currency,
      timezone: account.timezone,
      lastSeenAt: account.lastSeenAt,
      createdAt: account.createdAt,
      latestMetric: account.accountMetrics[0] || null,
    }));

    return NextResponse.json(formattedAccounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}