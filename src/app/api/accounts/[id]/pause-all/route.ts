import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/get-user';
import { getFacebookAPI } from '@/lib/simulation';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = params.id;

    // Check if account exists
    const account = await db.adAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Pause all campaigns via Facebook API or simulation
    const facebookAPI = getFacebookAPI();
    await facebookAPI.pauseAllCampaigns(accountId);

    // Log the action
    await db.accountAction.create({
      data: {
        performedBy: user.username,
        adAccountId: accountId,
        targetType: 'account',
        targetId: accountId,
        action: 'pause_all_campaigns',
        payload: JSON.stringify({ timestamp: new Date().toISOString() }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'All campaigns paused successfully',
    });
  } catch (error) {
    console.error('Error pausing all campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}