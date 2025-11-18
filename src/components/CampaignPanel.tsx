'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, X, Pause, Play } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: string;
  effective_status: string;
}

interface Account {
  id: string;
  name: string;
  vendor: string;
  status: string;
  currency: string;
  timezone: string;
  lastSeenAt: string;
  createdAt: string;
}

interface CampaignPanelProps {
  account: Account;
  campaigns: Campaign[];
  onClose: () => void;
}

export default function CampaignPanel({ account, campaigns, onClose }: CampaignPanelProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isPausingAll, setIsPausingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggleCampaign = async (campaignId: string, currentStatus: string) => {
    setIsLoading(campaignId);
    setError(null);
    setSuccess(null);

    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/set-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Campaign status updated to ${newStatus}`);
        // You might want to refresh the campaigns data here
      } else {
        setError(data.error || 'Failed to update campaign status');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const handlePauseAll = async () => {
    setIsPausingAll(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/accounts/${account.id}/pause-all`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('All campaigns paused successfully');
        // You might want to refresh the campaigns data here
      } else {
        setError(data.error || 'Failed to pause all campaigns');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsPausingAll(false);
    }
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE');
  const pausedCampaigns = campaigns.filter(c => c.status === 'PAUSED');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Campaign Management</h2>
            <p className="text-gray-600">{account.name} - {account.vendor}</p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-6 mt-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4">
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Stats */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <div className="text-sm text-gray-500">Total Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeCampaigns.length}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pausedCampaigns.length}</div>
              <div className="text-sm text-gray-500">Paused</div>
            </div>
          </div>

          {activeCampaigns.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handlePauseAll}
                disabled={isPausingAll}
                variant="destructive"
              >
                {isPausingAll ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Pausing All...
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause All Campaigns
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Campaigns List */}
        <div className="p-6 overflow-y-auto max-h-96">
          {campaigns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No campaigns found for this account
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-gray-500 font-mono">{campaign.id}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={
                          campaign.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {campaign.status}
                      </Badge>
                      <Button
                        onClick={() => handleToggleCampaign(campaign.id, campaign.status)}
                        disabled={isLoading === campaign.id}
                        variant="outline"
                        size="sm"
                      >
                        {isLoading === campaign.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : campaign.status === 'ACTIVE' ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}