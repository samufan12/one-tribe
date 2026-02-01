import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import GrailedLayout from "@/components/GrailedLayout";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GrailedLayout showCategoryNav={false}>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            {showConfetti && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-ping absolute w-24 h-24 bg-green-200 rounded-full opacity-50" />
              </div>
            )}
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. The seller has been notified and will prepare your order for shipping.
          </p>

          {/* Order Info */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-primary" size={24} />
              <h3 className="font-semibold text-foreground">What's Next?</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                <span>You'll receive an email confirmation shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                <span>The seller will prepare your item for shipping</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                <span>You'll get tracking info once it ships</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate("/marketplace")}
              className="flex-1"
            >
              Continue Shopping
              <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/messages")}
              className="flex-1"
            >
              Message Seller
            </Button>
          </div>
        </div>
      </div>
    </GrailedLayout>
  );
};

export default PaymentSuccess;
