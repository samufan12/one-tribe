import { useNavigate } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          items: items.map((i) => ({
            productId: i.id,
            productTitle: i.title,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      });
      if (error) throw error;
      if (data?.url) {
        clearCart();
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <GrailedLayout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Browse our marketplace to find authentic cultural goods.
          </p>
          <Button onClick={() => navigate("/marketplace")}>
            Start Shopping
          </Button>
        </div>
      </GrailedLayout>
    );
  }

  return (
    <GrailedLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Continue Shopping</span>
        </button>

        <h1 className="text-2xl font-bold">Shopping Cart ({itemCount})</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-card border rounded-lg p-4"
            >
              <button
                onClick={() => navigate(`/product/${item.id}`)}
                className="w-24 h-24 rounded-md overflow-hidden shrink-0 bg-muted"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="font-semibold text-foreground hover:underline text-left line-clamp-1"
                >
                  {item.title}
                </button>
                <p className="text-sm text-muted-foreground">{item.category} · {item.condition}</p>
                <p className="font-bold mt-1">${item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-accent transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-accent transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="font-bold shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border rounded-lg p-6 space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Platform Fee (5%)</span>
            <span>${(total * 0.05).toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${(total * 1.05).toFixed(2)}</span>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            size="lg"
            className="w-full"
          >
            {isCheckingOut ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Checkout · $${(total * 1.05).toFixed(2)}`
            )}
          </Button>
        </div>
      </div>
    </GrailedLayout>
  );
};

export default CartPage;
