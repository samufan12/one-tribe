import { useNavigate } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import { useCart } from "@/hooks/useCart";
import { Loader2 } from "lucide-react";
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
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        await clearCart();
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start checkout.");
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <GrailedLayout>
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <p className="text-eyebrow text-muted-foreground mb-3">Empty</p>
          <h1
            className="font-semibold tracking-[-0.03em] leading-[1] mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Your bag awaits<br />
            <span className="italic font-light text-muted-foreground">a story.</span>
          </h1>
          <button onClick={() => navigate("/marketplace")} className="px-8 h-12 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition-all">
            Begin browsing
          </button>
        </div>
      </GrailedLayout>
    );
  }

  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-12 pb-6">
        <button onClick={() => navigate(-1)} className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors">
          ← Continue browsing
        </button>
        <div className="mt-6 flex items-baseline justify-between">
          <h1 className="font-semibold tracking-[-0.03em]" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
            Your bag
          </h1>
          <p className="text-sm text-muted-foreground">{itemCount} {itemCount === 1 ? "piece" : "pieces"}</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Items as editorial list */}
        <div className="lg:col-span-8 divide-y divide-border border-y border-border">
          {items.map((item) => (
            <div key={item.id} className="py-8 grid grid-cols-12 gap-6 items-start">
              <button onClick={() => navigate(`/product/${item.id}`)} className="col-span-4 sm:col-span-3 aspect-[4/5] overflow-hidden bg-secondary rounded-sm group">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-spring group-hover:scale-105" />
              </button>
              <div className="col-span-8 sm:col-span-9 flex flex-col h-full">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">{item.category} · {item.condition}</p>
                    <button onClick={() => navigate(`/product/${item.id}`)} className="text-lg sm:text-xl font-medium tracking-tight text-left hover:underline underline-offset-4">
                      {item.title}
                    </button>
                  </div>
                  <p className="text-lg font-medium tabular-nums tracking-tight shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-border hover:border-foreground transition-colors">−</button>
                    <span className="tabular-nums w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-border hover:border-foreground transition-colors">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary — minimal */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <p className="text-eyebrow text-muted-foreground mb-6">Summary</p>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">${total.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Platform fee (5%)</dt><dd className="tabular-nums">${(total * 0.05).toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className="text-muted-foreground">Calculated next</dd></div>
          </dl>
          <div className="border-t border-border mt-6 pt-6 flex items-baseline justify-between">
            <span className="text-eyebrow text-muted-foreground">Total</span>
            <span className="text-2xl font-medium tabular-nums tracking-tight">${(total * 1.05).toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="mt-8 w-full h-14 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 active:scale-[0.99] transition-all duration-200 ease-spring disabled:opacity-60 inline-flex items-center justify-center"
          >
            {isCheckingOut ? <Loader2 size={16} className="animate-spin" /> : `Checkout · $${(total * 1.05).toFixed(2)}`}
          </button>
          <p className="mt-4 text-[11px] text-muted-foreground text-center leading-relaxed">
            Secure payment · Buyer protection on every order
          </p>
        </aside>
      </div>
    </GrailedLayout>
  );
};

export default CartPage;
