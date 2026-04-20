import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, ArrowRight, ShieldCheck, Globe2, Sparkles, Users } from "lucide-react";
import landingDress from "@/assets/landing-dress.jpg";
import landingCoffee from "@/assets/landing-coffee.jpg";
import landingGabi from "@/assets/landing-gabi.jpg";
import landingBerbere from "@/assets/landing-berbere.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: ShieldCheck,
      title: "Authentic, verified",
      description: "Every seller is reviewed. Every item, the real thing.",
    },
    {
      icon: Users,
      title: "A global community",
      description: "Habesha households and businesses, on every continent.",
    },
    {
      icon: Globe2,
      title: "Worldwide shipping",
      description: "From Addis to Atlanta, tracked end-to-end.",
    },
    {
      icon: Sparkles,
      title: "Curated with care",
      description: "Personalised picks tuned to your taste.",
    },
  ];

  const testimonials = [
    {
      name: "Makda T.",
      role: "Verified Buyer",
      quote: "Finally found authentic traditional dresses that remind me of home. The quality is exceptional.",
    },
    {
      name: "Yonas K.",
      role: "Seller",
      quote: "OneTribe has helped me reach customers worldwide. My handcrafts are now appreciated globally.",
    },
    {
      name: "Sara M.",
      role: "Community Member",
      quote: "The community here is so supportive. I've learned so much about traditional styling.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-full"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </button>
              <span className="font-semibold text-[17px] tracking-tight">OneTribe</span>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <Button
                  size="sm"
                  onClick={() => navigate('/home')}
                  className="rounded-full px-5 h-8 text-[13px] font-medium"
                >
                  Open app
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="rounded-full px-5 h-8 text-[13px] font-medium"
                >
                  Get started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="max-w-[1080px] mx-auto px-6 lg:px-8 text-center">
          <p className="text-eyebrow text-primary mb-5">The global Habesha marketplace</p>
          <h1 className="text-display mb-6">
            Home, in every<br className="hidden sm:block" /> corner of the world.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Authentic clothing, coffee, jewelry and craft from Ethiopian and Eritrean
            makers — delivered to wherever you call home.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/marketplace')}
              className="rounded-full px-7 h-12 text-[15px] font-medium gap-1.5 shadow-soft"
            >
              Start shopping
              <ArrowRight size={16} />
            </Button>
            <button
              onClick={() => navigate('/cultural-guide')}
              className="text-[15px] font-medium text-primary hover:underline underline-offset-4 px-4 h-12 inline-flex items-center gap-1"
            >
              Learn more <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Hero image mosaic */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 mt-16 md:mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-muted shadow-soft">
              <img src={landingDress} alt="Traditional Habesha Dress" className="w-full h-full object-cover object-top" />
            </div>
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-muted shadow-soft md:translate-y-8">
              <img src={landingCoffee} alt="Ethiopian Coffee Ceremony" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-muted shadow-soft">
              <img src={landingGabi} alt="Traditional Gabi" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-muted shadow-soft md:translate-y-8">
              <img src={landingBerbere} alt="Berbere Spice" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border/60 bg-muted/40">
        <div className="max-w-[1080px] mx-auto px-6 lg:px-8 py-10 md:py-14">
          <div className="grid grid-cols-3 gap-6 md:gap-12 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-semibold tracking-tight">100%</p>
              <p className="text-sm text-muted-foreground mt-1">Authentic</p>
            </div>
            <div className="border-x border-border/60">
              <p className="text-3xl md:text-4xl font-semibold tracking-tight">6</p>
              <p className="text-sm text-muted-foreground mt-1">Categories</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-semibold tracking-tight">Global</p>
              <p className="text-sm text-muted-foreground mt-1">Shipping</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1080px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-eyebrow text-primary mb-4">Why OneTribe</p>
            <h2 className="text-headline mb-4">Built for the diaspora.</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              More than a marketplace — a community keeping heritage alive, one item at a time.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-card rounded-3xl p-7 border border-border/60 hover:border-border hover:shadow-soft-lg transition-all duration-500 ease-spring"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <feature.icon size={18} />
                </div>
                <h3 className="text-[17px] font-semibold mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial split */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="rounded-[2rem] bg-muted/60 overflow-hidden grid md:grid-cols-2 items-stretch">
            <div className="aspect-[4/3] md:aspect-auto bg-muted">
              <img src={landingDress} alt="Habesha craftsmanship" className="w-full h-full object-cover object-top" />
            </div>
            <div className="p-10 md:p-16 flex flex-col justify-center">
              <p className="text-eyebrow text-primary mb-4">Made by hand</p>
              <h2 className="text-headline mb-5">Every thread tells a story.</h2>
              <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
                From hand-loomed netela to small-batch berbere, OneTribe puts artisans
                first — so the craft, and the people behind it, are never lost in translation.
              </p>
              <div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/marketplace')}
                  className="rounded-full px-6 h-11 text-[14px] font-medium"
                >
                  Explore the collection
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1080px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-eyebrow text-primary mb-4">Loved by the community</p>
            <h2 className="text-headline">Real stories. Real homes.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="bg-card rounded-3xl p-7 border border-border/60"
              >
                <blockquote className="text-[15px] leading-relaxed text-foreground mb-6">
                  "{t.quote}"
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-5 border-t border-border/60">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-[13px] font-semibold text-foreground">
                      {t.name.split(" ").map(w => w[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[14px]">{t.name}</p>
                    <p className="text-muted-foreground text-[12px]">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1080px] mx-auto px-6 lg:px-8">
          <div className="rounded-[2rem] bg-foreground text-background p-12 md:p-20 text-center">
            <h2 className="text-headline mb-5 tracking-tight">
              Bring home, home.
            </h2>
            <p className="text-base md:text-lg text-background/70 mb-9 max-w-xl mx-auto leading-relaxed">
              Join thousands of buyers and sellers celebrating heritage, every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="rounded-full px-7 h-12 text-[15px] font-medium bg-background text-foreground hover:bg-background/90"
              >
                Get started
                <ArrowRight size={16} className="ml-1" />
              </Button>
              <button
                onClick={() => navigate('/marketplace')}
                className="text-[15px] font-medium text-background/80 hover:text-background underline-offset-4 hover:underline px-4 h-12 inline-flex items-center"
              >
                Browse marketplace
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-[15px] tracking-tight">OneTribe</span>
          <p className="text-muted-foreground text-[13px]">
            © {new Date().getFullYear()} OneTribe. Celebrating heritage, together.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
