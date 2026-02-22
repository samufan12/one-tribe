import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import landingDress from "@/assets/landing-dress.jpg";
import landingCoffee from "@/assets/landing-coffee.jpg";
import landingGabi from "@/assets/landing-gabi.jpg";
import landingBerbere from "@/assets/landing-berbere.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      title: "Authentic Marketplace",
      description: "Discover genuine traditional clothing and handcrafted items from verified sellers across the community."
    },
    {
      title: "Vibrant Community",
      description: "Connect with fellow enthusiasts, share styling tips, and celebrate cultural heritage together."
    },
    {
      title: "Secure Transactions",
      description: "Shop with confidence knowing your purchases are protected with our buyer guarantee."
    },
    {
      title: "Personal Style Guidance",
      description: "Get personalized recommendations and styling advice tailored to your preferences."
    }
  ];

  const testimonials = [
    {
      name: "Makda T.",
      role: "Verified Buyer",
      image: landingDress,
      quote: "Finally found authentic traditional dresses that remind me of home. The quality is exceptional!"
    },
    {
      name: "Yonas K.",
      role: "Seller",
      image: landingCoffee,
      quote: "OneTribe has helped me reach customers worldwide. My handcrafts are now appreciated globally."
    },
    {
      name: "Sara M.",
      role: "Community Member",
      image: landingGabi,
      quote: "The community here is so supportive. I've learned so much about traditional styling."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">O</span>
                </div>
                <span className="font-bold text-xl">OneTribe</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button onClick={() => navigate('/home')}>
                  Go to App
                </Button>
              ) : (
                <Button onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Discover Habesha Culture
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Your Home for
                <span className="text-primary block mt-2">Cultural Goods</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Connect with the diaspora — sell items from your home or business to buyers worldwide with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/marketplace')} className="text-lg px-8">
                  Start Shopping
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-muted-foreground text-sm">Verified Sellers</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-muted-foreground text-sm">Happy Customers</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="text-3xl font-bold">50+</p>
                  <p className="text-muted-foreground text-sm">Categories</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">
                    <img src={landingDress} alt="Traditional Habesha Dress" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-square">
                    <img src={landingCoffee} alt="Ethiopian Coffee Ceremony" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="pt-8 space-y-3">
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-square">
                    <img src={landingGabi} alt="Traditional Gabi" className="w-full h-full object-cover object-center" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">
                    <img src={landingBerbere} alt="Berbere Spice" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose OneTribe?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're more than a marketplace – we're a community dedicated to preserving and celebrating cultural heritage.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by Our Community</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from the people who make OneTribe special.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-2xl p-6 border">
                <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Discover Authentic Fashion?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of buyers and sellers celebrating cultural heritage through traditional clothing.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate('/auth')}
              className="text-lg px-8"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">O</span>
              </div>
              <span className="font-bold text-xl">OneTribe</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 OneTribe. Celebrating cultural heritage through fashion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;