import GrailedLayout from "@/components/GrailedLayout";

const FAQPage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">
              Find answers to common questions about OneTribe.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-3">What is OneTribe?</h3>
              <p className="text-muted-foreground">
                OneTribe is a marketplace dedicated to authentic traditional clothing and cultural items. 
                We connect buyers with sellers who offer genuine, high-quality cultural goods from around the world.
              </p>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-3">How do I become a seller?</h3>
              <p className="text-muted-foreground">
                Click on "Become Seller" in your account menu to apply. We review all seller applications 
                to ensure quality and authenticity of products.
              </p>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and other secure payment methods to ensure 
                safe transactions for both buyers and sellers.
              </p>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-3">How do returns work?</h3>
              <p className="text-muted-foreground">
                Items can be returned within 30 days of purchase in their original condition. 
                Each seller may have specific return policies, which are displayed on their product listings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GrailedLayout>
  );
};

export default FAQPage;
