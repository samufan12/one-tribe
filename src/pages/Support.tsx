import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, Clock, MessageSquare, HelpCircle, CreditCard, Package, UserCog, ChevronRight } from "lucide-react";

const quickHelpItems = [
  {
    icon: Package,
    title: "Order Status & Tracking",
    description: "Track your order or check delivery status.",
    action: "/faq",
  },
  {
    icon: HelpCircle,
    title: "Returns & Exchanges",
    description: "Learn about our return and exchange policy.",
    action: "/faq",
  },
  {
    icon: CreditCard,
    title: "Payment Issues",
    description: "Help with payments, refunds, or billing questions.",
    action: "/faq",
  },
  {
    icon: UserCog,
    title: "Account Settings",
    description: "Manage your profile, password, and preferences.",
    action: "/profile",
  },
];

const SupportPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setSending(true);
    // Simulate submission
    setTimeout(() => {
      setSending(false);
      setName("");
      setEmail("");
      setMessage("");
      toast({ title: "Message sent!", description: "We'll get back to you within 24–48 hours." });
    }, 1000);
  };

  return (
    <GrailedLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Support</h1>
          <p className="text-muted-foreground mt-1">
            Get help with your OneTribe experience.
          </p>
        </div>

        {/* Quick Help */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickHelpItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.action)}
              className="flex items-start gap-4 bg-card border rounded-lg p-4 text-left hover:border-primary/40 transition-colors group"
            >
              <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                <item.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground mt-1 shrink-0 group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href="mailto:support@onetribe.com" className="text-sm text-muted-foreground hover:underline">
                    support@onetribe.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">In-App Chat</p>
                  <button
                    onClick={() => navigate("/assistant")}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Chat with our AI assistant
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">Response Time</p>
                  <p className="text-sm text-muted-foreground">Within 24–48 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" rows={4} />
                </div>
                <Button type="submit" disabled={sending} className="w-full">
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </GrailedLayout>
  );
};

export default SupportPage;
