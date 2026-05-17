import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package, TrendingUp, Users, CheckCircle2, AlertCircle } from 'lucide-react';

export const SellerTools = () => {
  const { profile, isSeller } = useUserRole();
  const { user } = useAuth();
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setStripeAccountId(data?.stripe_account_id ?? null));
  }, [user?.id]);

  if (!isSeller()) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Tools</h1>
          <p className="text-muted-foreground">
            You need to be a verified seller to access these tools.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your business and track your sales performance.
        </p>
      </div>

      {profile?.business_name && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {profile.business_name}
              <Badge variant={profile.verification_status === 'verified' ? 'default' : 'secondary'}>
                {profile.verification_status}
              </Badge>
            </CardTitle>
            <CardDescription>
              Business since {new Date(profile.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Link
        to="/seller-onboarding"
        className={`block border rounded-sm p-6 transition-colors ${
          stripeAccountId
            ? 'border-border hover:border-foreground/40'
            : 'border-primary/40 bg-primary/5 hover:border-primary'
        }`}
      >
        <div className="flex items-start gap-4">
          {stripeAccountId ? (
            <CheckCircle2 className="text-primary mt-0.5 shrink-0" size={22} />
          ) : (
            <AlertCircle className="text-primary mt-0.5 shrink-0" size={22} />
          )}
          <div className="flex-1">
            <h3 className="font-semibold tracking-tight">
              {stripeAccountId ? 'Payouts connected' : 'Set up payouts'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {stripeAccountId
                ? 'Sales are paid out automatically to your bank account.'
                : 'Connect your bank account to receive money from your sales.'}
            </p>
          </div>
          <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            {stripeAccountId ? 'Manage →' : 'Start →'}
          </span>
        </div>
      </Link>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Items currently for sale
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total unique buyers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Response rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              No orders yet. Start selling to see your orders here.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <p>• List a new item</p>
              <p>• Update inventory</p>
              <p>• View messages</p>
              <p>• Check analytics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};