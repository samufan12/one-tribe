import { Layout } from "@/components/Layout";

const CartPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review your selected items before checkout.
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start browsing our marketplace to add items to your cart.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;