import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart3, Package, TrendingUp, Users, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SellerOrder {
  id: string;
  product_id: string | null;
  product_ids: string[];
  amount_total: number | null;
  seller_payout: number | null;
  total: number;
  status: string;
  created_at: string;
  product_title?: string;
}

export const SellerTools = () => {
  const { profile, isSeller } = useUserRole();
  const { user } = useAuth();
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;

    supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setStripeAccountId(data?.stripe_account_id ?? null));

    (async () => {
      setLoadingOrders(true);
      const { data: orderRows } = await supabase
        .from('orders')
        .select('id, product_id, product_ids, amount_total, seller_payout, total, status, created_at')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!orderRows) {
        setOrders([]);
        setLoadingOrders(false);
        return;
      }

      // Collect product ids and fetch titles (seller can read their own products via RLS)
      const idSet = new Set<string>();
      orderRows.forEach((o) => {
        if (o.product_id) idSet.add(o.product_id);
        (o.product_ids ?? []).forEach((pid: string) => pid && idSet.add(pid));
      });

      let titleMap = new Map<string, string>();
      if (idSet.size > 0) {
        const { data: products } = await supabase
          .from('products')
          .select('id, title')
          .in('id', Array.from(idSet));
        if (products) titleMap = new Map(products.map((p: any) => [p.id, p.title as string]));
      }

      setOrders(
        orderRows.map((o) => {
          const firstId = o.product_id ?? o.product_ids?.[0] ?? null;
          const title = firstId ? titleMap.get(firstId) : undefined;
          const extra = (o.product_ids?.length ?? 0) > 1 ? ` +${o.product_ids.length - 1} more` : '';
          return { ...o, product_title: title ? `${title}${extra}` : 'Item' };
        }) as SellerOrder[]
      );
      setLoadingOrders(false);
    })();
  }, [user?.id]);

  const totalEarnedCents = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + (o.seller_payout ?? 0), 0);
  const totalEarned = totalEarnedCents / 100;

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

      {/* Payouts status */}
      {stripeAccountId ? (
        <div className="flex items-center justify-between rounded-lg border border-green-600/30 bg-green-50 dark:bg-green-950/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-600 shrink-0" size={22} />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">Payouts active</p>
              <p className="text-xs text-green-800/80 dark:text-green-200/80">
                Sales pay out automatically to your bank account.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/seller-onboarding">Manage</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-yellow-500/40 bg-yellow-50 dark:bg-yellow-950/30 px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                Set up payouts to receive money from your sales
              </p>
              <p className="text-xs text-yellow-800/80 dark:text-yellow-200/80 mt-1">
                Connect your bank via Stripe — takes a couple of minutes.
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/seller-onboarding">Set up payouts</Link>
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {orders.filter((o) => o.status === 'paid').length} paid {orders.filter((o) => o.status === 'paid').length === 1 ? 'order' : 'orders'}
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
            <p className="text-xs text-muted-foreground">Items currently for sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">All-time sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Response rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your most recent sales and their payout status.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingOrders ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No orders yet. Start selling to see your orders here.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Payout</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => {
                  const payout = o.seller_payout != null ? o.seller_payout / 100 : null;
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(o.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{o.product_title}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {payout != null ? `$${payout.toFixed(2)}` : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={o.status === 'paid' ? 'default' : 'secondary'} className="capitalize">
                          {o.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
