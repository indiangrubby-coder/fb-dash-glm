'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Copy, RefreshCw, Pause, Play, Eye, EyeOff, LogOut } from 'lucide-react';
import AccountCard from '@/components/AccountCard';
import CampaignPanel from '@/components/CampaignPanel';
import ThemeToggle from '@/components/ThemeToggle';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: accounts, error, mutate } = useSWR('/api/accounts', fetcher, {
    refreshInterval: 10000, // Auto-refresh every 10 seconds
  });

  const { data: accountDetails } = useSWR(
    selectedAccount ? `/api/accounts/${selectedAccount}` : null,
    fetcher,
    {
      refreshInterval: 10000,
    }
  );

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Trigger sync
      await fetch('/api/sync', { method: 'POST' });
      // Refresh the data
      mutate();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load accounts. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Facebook Ads Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Monitor and control your advertising accounts
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Syncing...' : 'Sync Data'}
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {accounts?.filter(acc => acc.status === 'ACTIVE').length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Spend Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${accounts?.reduce((sum, acc) => sum + (acc.latestMetric?.spend || 0), 0).toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accounts?.reduce((sum, acc) => sum + (acc.latestMetric?.clicks || 0), 0) || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {accounts?.map((account: any) => (
            <AccountCard
              key={account.id}
              account={account}
              onSelect={() => setSelectedAccount(account.id)}
              isSelected={selectedAccount === account.id}
            />
          ))}
        </div>

        {/* Campaign Panel */}
        {selectedAccount && accountDetails && (
          <CampaignPanel
            account={accountDetails.account}
            campaigns={accountDetails.campaigns}
            onClose={() => setSelectedAccount(null)}
          />
        )}
      </main>
    </div>
  );
}