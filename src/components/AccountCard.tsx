'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface AccountMetric {
  spend: number;
  spendCap: number;
  clicks: number;
  impressions: number;
  cpc: number;
  balance: number;
  statusAtFetch: string;
  fetchedAt: string;
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
  latestMetric: AccountMetric | null;
}

interface AccountCardProps {
  account: Account;
  onSelect: () => void;
  isSelected: boolean;
}

export default function AccountCard({ account, onSelect, isSelected }: AccountCardProps) {
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(account.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const isDisabled = ['DISABLED', 'UNSETTLED', 'PENDING_RISK_REVIEW'].includes(account.status || '');
  const cardClass = isDisabled 
    ? 'border-red-200 bg-red-50' 
    : isSelected 
    ? 'border-blue-500 bg-blue-50' 
    : 'border-gray-200 bg-white';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DISABLED':
        return 'bg-red-100 text-red-800';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_RISK_REVIEW':
        return 'bg-orange-100 text-orange-800';
      case 'UNSETTLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${cardClass}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {account.name}
            </CardTitle>
            <CardDescription className="text-sm">
              {account.vendor}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(account.status || 'UNKNOWN')}>
            {account.status || 'UNKNOWN'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Metrics */}
        {account.latestMetric ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Spend Today</p>
              <p className="font-semibold">
                ${account.latestMetric.spend.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Spend Cap</p>
              <p className="font-semibold">
                ${account.latestMetric.spendCap.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Clicks</p>
              <p className="font-semibold">
                {account.latestMetric.clicks.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">CPC</p>
              <p className="font-semibold">
                ${account.latestMetric.cpc.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Balance</p>
              <p className={`font-semibold ${account.latestMetric.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${account.latestMetric.balance.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Impressions</p>
              <p className="font-semibold">
                {account.latestMetric.impressions.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No metrics available
          </div>
        )}

        {/* Account Info */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Account ID:</span>
            <div className="flex items-center space-x-1">
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {account.id}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyId();
                }}
                className="h-6 w-6 p-0"
              >
                {copiedId ? (
                  <Eye className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Currency:</span>
            <span className="font-medium">{account.currency}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Last Updated:</span>
            <span className="font-medium">
              {account.latestMetric 
                ? new Date(account.latestMetric.fetchedAt).toLocaleTimeString()
                : 'Never'
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}