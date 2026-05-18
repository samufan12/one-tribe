import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Profile = {
  user_id: string;
  display_name: string | null;
  business_name: string | null;
  verification_status: string | null;
  stripe_account_id: string | null;
  rejection_reason: string | null;
  created_at: string;
};

type Order = {
  id: string;
  created_at: string;
  buyer_id: string;
  seller_id: string | null;
  product_id: string | null;
  product_ids: string[] | null;
  amount_total: number | null;
  total: number;
  status: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, profile: userProfile, loading: roleLoading } = useUserRole();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [productTitles, setProductTitles] = useState<Record<string, string>>({});

  // Admin check supports both user_roles table and profiles.role column
  const isAdminUser = isAdmin() || (userProfile as any)?.role === "admin";

  // Guard temporarily disabled for debugging — render dashboard for any visitor
  // useEffect(() => {
  //   if (authLoading || roleLoading) return;
  //   if (!user || !isAdminUser) navigate("/");
  // }, [user, authLoading, roleLoading, isAdminUser, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: profRows, error: pErr }, { data: orderRows, error: oErr }] = await Promise.all([
        (supabase.rpc as any)("admin_list_profiles"),
        (supabase.rpc as any)("admin_list_orders"),
      ]);
      if (pErr) throw pErr;
      if (oErr) throw oErr;
      setProfiles((profRows as Profile[]) || []);
      const ords = (orderRows as Order[]) || [];
      setOrders(ords);

      const ids = new Set<string>();
      ords.forEach((o) => {
        if (o.product_id) ids.add(o.product_id);
        (o.product_ids || []).forEach((id) => ids.add(id));
      });
      if (ids.size) {
        const { data: prods } = await supabase.from("products").select("id, title").in("id", Array.from(ids));
        const map: Record<string, string> = {};
        (prods || []).forEach((p: any) => (map[p.id] = p.title));
        setProductTitles(map);
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to load admin data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    const { error } = await (supabase.rpc as any)("approve_seller", { p_user_id: userId });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Approved", description: "Seller verified." });
    fetchData();
  };

  const handleReject = async (userId: string) => {
    if (!rejectReason.trim()) {
      toast({ title: "Reason required", description: "Please enter a rejection reason.", variant: "destructive" });
      return;
    }
    const { error } = await (supabase.rpc as any)("reject_seller", { p_user_id: userId, p_reason: rejectReason });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Rejected", description: "Seller rejected." });
    setRejectingId(null);
    setRejectReason("");
    fetchData();
  };

  if (authLoading || roleLoading || loading) {
    return (
      <GrailedLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      </GrailedLayout>
    );
  }

  // Guard temporarily disabled — always render for debugging

  const pending = profiles.filter((p) => p.verification_status === "pending");
  const verified = profiles.filter((p) => p.verification_status === "verified");

  const productLabel = (o: Order) => {
    if (o.product_id && productTitles[o.product_id]) return productTitles[o.product_id];
    const ids = o.product_ids || [];
    if (ids.length) return ids.map((id) => productTitles[id] || id.slice(0, 6)).join(", ");
    return "—";
  };

  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-12">
        <p className="text-eyebrow text-muted-foreground mb-3">Admin</p>
        <h1 className="text-4xl font-semibold tracking-tight mb-8">Dashboard</h1>

        <Tabs defaultValue="verification">
          <TabsList>
            <TabsTrigger value="verification">Seller Verification ({pending.length})</TabsTrigger>
            <TabsTrigger value="sellers">All Sellers ({verified.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="verification" className="mt-6">
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Display name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No pending verifications.</TableCell></TableRow>
                  ) : pending.map((p) => (
                    <>
                      <TableRow key={p.user_id}>
                        <TableCell>{p.display_name || "—"}</TableCell>
                        <TableCell>{p.business_name || "—"}</TableCell>
                        <TableCell className="font-mono text-xs">{p.user_id.slice(0, 8)}…</TableCell>
                        <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" onClick={() => handleApprove(p.user_id)}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => { setRejectingId(p.user_id); setRejectReason(""); }}>Reject</Button>
                        </TableCell>
                      </TableRow>
                      {rejectingId === p.user_id && (
                        <TableRow key={`${p.user_id}-reject`}>
                          <TableCell colSpan={5} className="bg-muted/30">
                            <div className="flex gap-2 items-center">
                              <Input
                                autoFocus
                                placeholder="Reason for rejection"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                              />
                              <Button size="sm" variant="destructive" onClick={() => handleReject(p.user_id)}>Confirm reject</Button>
                              <Button size="sm" variant="ghost" onClick={() => setRejectingId(null)}>Cancel</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="sellers" className="mt-6">
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Display name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Payouts</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verified.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No verified sellers.</TableCell></TableRow>
                  ) : verified.map((p) => (
                    <TableRow key={p.user_id}>
                      <TableCell>{p.display_name || "—"}</TableCell>
                      <TableCell>{p.business_name || "—"}</TableCell>
                      <TableCell>
                        {p.stripe_account_id
                          ? <Badge variant="default">Connected</Badge>
                          : <Badge variant="outline">Not connected</Badge>}
                      </TableCell>
                      <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No orders yet.</TableCell></TableRow>
                  ) : orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[260px] truncate">{productLabel(o)}</TableCell>
                      <TableCell className="font-mono text-xs">{o.buyer_id.slice(0, 8)}…</TableCell>
                      <TableCell className="font-mono text-xs">{o.seller_id ? `${o.seller_id.slice(0, 8)}…` : "—"}</TableCell>
                      <TableCell>${((o.amount_total ?? Number(o.total) * 100) / 100).toFixed(2)}</TableCell>
                      <TableCell><Badge variant={o.status === "paid" ? "default" : "outline"}>{o.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GrailedLayout>
  );
};

export default AdminDashboard;
