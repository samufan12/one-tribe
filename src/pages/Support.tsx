import { Layout } from "@/components/Layout";

const SupportPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Support</h1>
          <p className="text-muted-foreground">
            Get help with your OneTribe experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <p className="text-muted-foreground">Email: support@onetribe.com</p>
              <p className="text-muted-foreground">Phone: +1 (555) 123-4567</p>
              <p className="text-muted-foreground">Hours: Monday - Friday, 9 AM - 6 PM EST</p>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Help</h2>
            <div className="space-y-3">
              <button className="text-primary hover:underline block">Order Status & Tracking</button>
              <button className="text-primary hover:underline block">Returns & Exchanges</button>
              <button className="text-primary hover:underline block">Payment Issues</button>
              <button className="text-primary hover:underline block">Account Settings</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;