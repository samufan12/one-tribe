import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart3, Package, TrendingUp, Users, CheckCircle2, AlertTriangle, ShoppingBag, DollarSign, Clock } from 'lucide-react';
import { SellerOnboardingChecklist } from '@/components/SellerOnboardingChecklist';

interface SellerOrder {
  id: string;
  created_at: string;
  status: string;
  amount_total: number | null;
  seller_payout: number | null;
  total: number | null;
  product_id: string | null;
  product_title: string | null;
  buyer_id: string | null;
  buyer_display_name: string | null;
}

const statusPillClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
    case 'shipped':
    case 'delivered':
      return 'bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30';
    case 'refunded':
      return 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30';
    case 'pending':
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const SellerTools = () => {
  const { profile, isSeller } = useUserRole();
  const { user } = useAuth();
  const { toast } = useToast();
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    const { data, error } = await supabase.rpc('get_seller_orders');
    if (!error && data) {
      setOrders(data as SellerOrder[]);
    } else if (error) {
      console.error('Failed to load orders', error);
    }
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setStripeAccountId(data?.stripe_account_id ?? null));
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleMarkShipped = async (orderId: string) => {
    setUpdatingId(orderId);
    const { error } = await supabase.rpc('mark_order_shipped', { p_order_id: orderId });
    setUpdatingId(null);
    if (error) {
      toast({ title: 'Could not update order', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Order marked as shipped', description: 'The buyer has been notified.' });
    loadOrders();
  };

  const handleMarkDelivered = async (orderId: string) => {
    setUpdatingId(orderId);
    const { error } = await supabase.rpc('mark_order_delivered', { p_order_id: orderId });
    setUpdatingId(null);
    if (error) {
      toast({ title: 'Could not update order', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Order marked as delivered', description: 'A review request was sent to the buyer.' });
    loadOrders();
  };

  const totalEarnedCents = orders
    .filter((o) => ['paid', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + (o.seller_payout ?? 0), 0);
  const totalEarned = totalEarnedCents / 100;
  const pendingShipments = orders.filter((o) => o.status === 'paid').length;

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
      <SellerOnboardingChecklist />
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From {orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
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
        </TabsContent>

        <TabsContent value="orders" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingShipments}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Manage shipments and track the status of each sale.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <p className="text-sm text-muted-foreground py-6 text-center">Loading orders…</p>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No orders yet — share your listings to get your first sale
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead className="text-right">Payout</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((o) => {
                        const payout = o.seller_payout != null ? o.seller_payout / 100 : null;
                        const paid = o.amount_total != null ? o.amount_total / 100 : null;
                        return (
                          <TableRow key={o.id}>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                              {new Date(o.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium">{o.product_title ?? 'Item'}</TableCell>
                            <TableCell className="text-sm">{o.buyer_display_name ?? 'Anonymous'}</TableCell>
                            <TableCell className="text-right tabular-nums">
                              {paid != null ? `$${paid.toFixed(2)}` : '—'}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {payout != null ? `$${payout.toFixed(2)}` : '—'}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${statusPillClass(
                                  o.status
                                )}`}
                              >
                                {o.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              {o.status === 'paid' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={updatingId === o.id}
                                  onClick={() => handleMarkShipped(o.id)}
                                >
                                  {updatingId === o.id ? 'Updating…' : 'Mark as shipped'}
                                </Button>
                              )}
                              {o.status === 'shipped' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={updatingId === o.id}
                                  onClick={() => handleMarkDelivered(o.id)}
                                >
                                  {updatingId === o.id ? 'Updating…' : 'Mark as delivered'}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
