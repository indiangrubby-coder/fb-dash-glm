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

    const campaignId = params.id;
    const { status } = await request.json();

    if (!status || !['ACTIVE', 'PAUSED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be ACTIVE or PAUSED' },
        { status: 400 }
      );
    }

    // Update campaign status via Facebook API or simulation
    const facebookAPI = getFacebookAPI();
    await facebookAPI.updateCampaignStatus(campaignId, status);

    // Log the action
    await db.accountAction.create({
      data: {
        performedBy: user.username,
        adAccountId: 'unknown', // We don't track which account the campaign belongs to
        targetType: 'campaign',
        targetId: campaignId,
        action: `set_status_${status.toLowerCase()}`,
        payload: JSON.stringify({ 
          status,
          timestamp: new Date().toISOString() 
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Campaign status updated to ${status}`,
    });
  } catch (error) {
    console.error('Error updating campaign status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}