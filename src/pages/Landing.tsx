import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import WaitlistSection from "@/components/WaitlistSection";
import landingDress from "@/assets/landing-dress.jpg";
import landingCoffee from "@/assets/landing-coffee.jpg";
import landingGabi from "@/assets/landing-gabi.jpg";
import landingBerbere from "@/assets/landing-berbere.jpg";
import telsum from "@/assets/telsum-necklace.jpg";
import netela from "@/assets/netela-shawl.webp";
import mesob from "@/assets/mesob-table.jpg";
import saintGeorge from "@/assets/saint-george-painting.jpg";
import kemis from "@/assets/kemis-1.jpg";

/* ----- tiny scroll-reveal hook (no deps) ----- */
const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
};

const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-spring ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

/* ----- cinematic scroll progress hook -----
   Returns 0 → 1 as element travels through viewport.
   0 = just entering bottom, 0.5 = centered, 1 = just leaving top. */
const useScrollProgress = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // p=0 when top of el at bottom of viewport, p=1 when bottom of el at top
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const p = Math.min(1, Math.max(0, passed / total));
      setProgress(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return { ref, progress };
};

/* Cinematic section: crossfades + subtle vertical drift as it passes through.
   Creates the feeling of one continuous editorial reel. */
const Cinematic = ({
  children,
  className = "",
  intensity = 1,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  // bell curve: peak opacity/position at p=0.5
  const bell = 1 - Math.pow((progress - 0.5) * 2, 2); // 0 at edges, 1 at center
  const opacity = 0.35 + 0.65 * Math.max(0, bell);
  const translateY = (0.5 - progress) * 60 * intensity; // drift up as we scroll
  const scale = 0.97 + 0.03 * Math.max(0, bell);
  return (
    <div
      ref={ref}
      style={{
        opacity,
        transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
        willChange: "transform, opacity",
      }}
      className={className}
    >
      {children}
    </div>
  );
};

/* Parallax layer — moves at a fraction of scroll speed within its parent */
const ParallaxLayer = ({
  children,
  speed = 0.2,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const y = (progress - 0.5) * 200 * speed;
  return (
    <div
      ref={ref}
      style={{ transform: `translate3d(0, ${y}px, 0)`, willChange: "transform" }}
      className={className}
    >
      {children}
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* parallax for hero */
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const chapters = [
    {
      n: "01",
      eyebrow: "The Cloth",
      title: "Hand-loomed, generation after generation.",
      copy: "Habesha kemis, netela, gabi — woven on wooden looms in Shiro Meda, then carried across oceans by the women who wear them.",
      image: kemis,
      tag: "Textiles",
    },
    {
      n: "02",
      eyebrow: "The Cup",
      title: "Where coffee was born.",
      copy: "From the highlands of Yirgacheffe to a jebena pouring slow in your kitchen. The ceremony, intact.",
      image: landingCoffee,
      tag: "Coffee",
    },
    {
      n: "03",
      eyebrow: "The Spice",
      title: "Heat, measured in memory.",
      copy: "Berbere, mitmita, shiro — blended by hand, sun-dried, never standardised. Tastes like your grandmother's kitchen, because it is.",
      image: landingBerbere,
      tag: "Pantry",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* ============ NAV ============ */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <span className="font-semibold text-[15px] tracking-tight">
            OneTribe<span className="text-primary">.</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-[13px] text-muted-foreground">
            <button onClick={() => navigate("/marketplace")} className="hover:text-foreground transition-colors">Shop</button>
            <button onClick={() => navigate("/storefronts")} className="hover:text-foreground transition-colors">Storefronts</button>
            <button onClick={() => navigate("/community")} className="hover:text-foreground transition-colors">Community</button>
            <button onClick={() => navigate("/cultural-guide")} className="hover:text-foreground transition-colors">Journal</button>
          </div>
          <button
            onClick={() => navigate(user ? "/home" : "/auth")}
            className="text-[13px] font-medium px-4 h-8 rounded-full bg-foreground text-background hover:opacity-90 active:scale-[0.97] transition-all ease-spring"
          >
            {user ? "Open app" : "Get started"}
          </button>
        </div>
      </nav>

      {/* ============ HERO — full-bleed editorial ============ */}
      <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden">
        {/* parallax image */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate3d(0, ${scrollY * 0.3}px, 0) scale(1.08)` }}
        >
          <img
            src={landingDress}
            alt="A woman in a traditional Habesha kemis"
            className="w-full h-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>

        {/* hero content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* eyebrow row */}
          <div className="pt-24 px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
            <Reveal>
              <div className="flex items-center gap-3 text-white/80">
                <span className="h-px w-10 bg-white/60" />
                <span className="text-eyebrow">Vol. 01 — The Diaspora Issue</span>
              </div>
            </Reveal>
          </div>

          {/* big title */}
          <div className="flex-1 flex items-end px-6 lg:px-10 pb-16 md:pb-24">
            <div className="max-w-[1400px] mx-auto w-full grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8">
                <Reveal delay={120}>
                  <h1
                    className="text-white font-semibold tracking-[-0.04em] leading-[0.95]"
                    style={{ fontSize: "clamp(3.5rem, 9vw, 8.5rem)" }}
                  >
                    Home,<br />
                    <span className="italic font-light">delivered</span>
                    <span className="text-primary">.</span>
                  </h1>
                </Reveal>
              </div>
              <div className="md:col-span-4 md:pb-4">
                <Reveal delay={280}>
                  <p className="text-white/85 text-[15px] md:text-base leading-relaxed mb-6 max-w-sm">
                    A marketplace for the global Habesha — built by the diaspora, stocked by the makers who keep it alive.
                  </p>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => navigate("/marketplace")}
                      className="group inline-flex items-center gap-2 px-6 h-12 rounded-full bg-white text-foreground text-[14px] font-medium hover:bg-white/90 active:scale-[0.97] transition-all ease-spring"
                    >
                      Enter the marketplace
                      <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>

          {/* bottom meta strip */}
          <div className="border-t border-white/15 backdrop-blur-md bg-black/10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between text-[11px] tracking-[0.15em] uppercase text-white/70">
              <span>Addis · Asmara · Atlanta · London · Dubai</span>
              <span className="hidden md:inline">Scroll to begin ↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="border-y border-border/60 bg-background py-6 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-[marquee_38s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 shrink-0">
              {[
                "Habesha Kemis",
                "Yirgacheffe Coffee",
                "Hand-blended Berbere",
                "Netela Shawls",
                "Telsum Jewelry",
                "Jebena & Sini",
                "Eritrean Zuria",
                "Shiro & Mitmita",
              ].map((w) => (
                <span key={w + i} className="flex items-center gap-12 text-[clamp(2rem,5vw,3.75rem)] font-semibold tracking-[-0.03em]">
                  {w}
                  <span className="text-primary">●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </section>

      {/* ============ MANIFESTO ============ */}
      <Cinematic intensity={0.6}>
        <section className="py-32 md:py-44 px-6 lg:px-10">
          <div className="max-w-[1200px] mx-auto grid md:grid-cols-12 gap-10">
            <div className="md:col-span-3">
              <Reveal>
                <p className="text-eyebrow text-muted-foreground sticky top-28">A Note</p>
              </Reveal>
            </div>
            <div className="md:col-span-9">
              <Reveal delay={120}>
                <p
                  className="font-light tracking-[-0.025em] leading-[1.15]"
                  style={{ fontSize: "clamp(1.75rem, 3.6vw, 3.25rem)" }}
                >
                  We started OneTribe because the things that make us
                  <span className="text-muted-foreground"> — the cloth, the coffee, the way a kitchen smells on a Sunday — </span>
                  shouldn't disappear because we moved.
                </p>
              </Reveal>
              <Reveal delay={260}>
                <div className="mt-10 flex items-center gap-4 text-[13px] text-muted-foreground">
                  <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-[12px] font-semibold">OT</div>
                  <div>
                    <p className="text-foreground font-medium">The OneTribe team</p>
                    <p>Founded between Addis Ababa & Washington, D.C.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </Cinematic>

      {/* ============ CHAPTER SECTIONS ============ */}
      {chapters.map((c, idx) => (
        <Cinematic key={c.n} intensity={0.8}>
          <section className="py-20 md:py-28 px-6 lg:px-10">
            <div className="max-w-[1400px] mx-auto">
              <div
                className={`grid md:grid-cols-12 gap-8 md:gap-14 items-center ${
                  idx % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* image with parallax depth */}
                <Reveal className="md:col-span-7">
                  <div className="relative group">
                    <div className="aspect-[4/5] md:aspect-[5/4] overflow-hidden rounded-[2rem] bg-muted">
                      <ParallaxLayer speed={0.35} className="w-full h-full">
                        <img
                          src={c.image}
                          alt={c.title}
                          className="w-full h-[115%] object-cover -mt-[7%] transition-transform duration-[1400ms] ease-spring group-hover:scale-[1.04]"
                        />
                      </ParallaxLayer>
                    </div>
                    <div className="absolute -top-4 -left-4 bg-background text-foreground text-[11px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-border shadow-soft">
                      {c.tag}
                    </div>
                  </div>
                </Reveal>

                {/* text */}
                <Reveal delay={150} className="md:col-span-5">
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-[clamp(3rem,6vw,5rem)] font-light text-primary tracking-tighter leading-none">
                      {c.n}
                    </span>
                    <span className="text-eyebrow text-muted-foreground">{c.eyebrow}</span>
                  </div>
                  <h3
                    className="font-semibold tracking-[-0.03em] leading-[1.05] mb-6"
                    style={{ fontSize: "clamp(1.875rem, 3.4vw, 3rem)" }}
                  >
                    {c.title}
                  </h3>
                  <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
                    {c.copy}
                  </p>
                  <button
                    onClick={() => navigate("/marketplace")}
                    className="group inline-flex items-center gap-2 text-[14px] font-medium border-b border-foreground/30 hover:border-foreground pb-1 transition-colors"
                  >
                    Shop the chapter
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </Reveal>
              </div>
            </div>
          </section>
        </Cinematic>
      ))}

      {/* ============ MOSAIC GALLERY ============ */}
      <Cinematic intensity={0.6}>
        <section className="py-28 md:py-36 px-6 lg:px-10">
          <div className="max-w-[1400px] mx-auto">
            <Reveal>
              <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-4">
                <div>
                  <p className="text-eyebrow text-muted-foreground mb-3">The Index</p>
                  <h2
                    className="font-semibold tracking-[-0.035em] leading-[0.95]"
                    style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
                  >
                    A look<br />inside.
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  See everything →
                </button>
              </div>
            </Reveal>

            <div className="grid grid-cols-12 gap-3 md:gap-5">
              {[
                { src: telsum, span: "col-span-6 md:col-span-4 row-span-2 aspect-[3/4]", label: "Telsum", speed: 0.25 },
                { src: netela, span: "col-span-6 md:col-span-4 aspect-[4/3]", label: "Netela", speed: 0.4 },
                { src: mesob, span: "col-span-6 md:col-span-4 aspect-[4/3]", label: "Mesob", speed: 0.15 },
                { src: landingGabi, span: "col-span-6 md:col-span-4 aspect-[4/3]", label: "Gabi", speed: 0.35 },
                { src: saintGeorge, span: "col-span-12 md:col-span-4 aspect-[4/3]", label: "Iconography", speed: 0.2 },
              ].map((it, i) => (
                <Reveal key={it.label} delay={i * 80} className={it.span}>
                  <div className="group relative w-full h-full overflow-hidden rounded-2xl md:rounded-[1.75rem] bg-muted">
                    <ParallaxLayer speed={it.speed} className="w-full h-full">
                      <img
                        src={it.src}
                        alt={it.label}
                        className="w-full h-[120%] -mt-[10%] object-cover transition-transform duration-[1200ms] ease-spring group-hover:scale-[1.06]"
                      />
                    </ParallaxLayer>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4 text-white text-[12px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-spring">
                      {it.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Cinematic>

      {/* ============ NUMBERS — editorial stats, no boxes ============ */}
      <Cinematic intensity={0.7}>
        <section className="py-28 md:py-36 px-6 lg:px-10 border-t border-border/60">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-10 md:gap-6">
            {[
              { k: "100%", v: "Authentic, makers verified" },
              { k: "40+", v: "Cities served, growing weekly" },
              { k: "8%", v: "8% flat platform fee — taken from your payout, never added to the buyer's price." },
            ].map((s, i) => (
              <Reveal key={s.k} delay={i * 120} className="md:col-span-4">
                <div className="border-t border-foreground/15 pt-8">
                  <p
                    className="font-semibold tracking-[-0.05em] leading-[0.9] mb-5"
                    style={{ fontSize: "clamp(4rem, 9vw, 7.5rem)" }}
                  >
                    {s.k}
                  </p>
                  <p className="text-[15px] text-muted-foreground max-w-[18ch] leading-relaxed">
                    {s.v}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Cinematic>

      {/* ============ TESTIMONIAL — single, bold ============ */}
      <Cinematic intensity={0.9}>
        <section className="py-28 md:py-40 px-6 lg:px-10 bg-foreground text-background">
          <div className="max-w-[1100px] mx-auto">
            <Reveal>
              <p className="text-eyebrow text-background/50 mb-10">In their words</p>
            </Reveal>
            <Reveal delay={120}>
              <blockquote
                className="font-light tracking-[-0.03em] leading-[1.1]"
                style={{ fontSize: "clamp(2rem, 5vw, 4.25rem)" }}
              >
                <span className="text-background/40">“</span>
                I found a kemis that looks exactly like the one my mother wore at her wedding.
                I cried when it arrived.
                <span className="text-background/40">”</span>
              </blockquote>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-12 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-background/15 flex items-center justify-center text-[13px] font-semibold">MT</div>
                <div className="text-[14px]">
                  <p className="font-medium">Makda T.</p>
                  <p className="text-background/60">Buyer · Toronto</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </Cinematic>

      {/* ============ CLOSING CTA ============ */}
      <Cinematic intensity={0.8}>
        <section className="py-32 md:py-44 px-6 lg:px-10 text-center">
          <div className="max-w-[1100px] mx-auto">
            <Reveal>
              <p className="text-eyebrow text-primary mb-8">Be part of it</p>
            </Reveal>
            <Reveal delay={120}>
              <h2
                className="font-semibold tracking-[-0.045em] leading-[0.95] mb-10"
                style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
              >
                The tribe is<br />
                <span className="italic font-light">global</span>.
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/auth")}
                  className="px-8 h-13 py-4 rounded-full bg-foreground text-background text-[14px] font-medium hover:opacity-90 active:scale-[0.97] transition-all ease-spring"
                >
                  Create your account
                </button>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="px-8 py-4 text-[14px] font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Browse first →
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </Cinematic>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-border/60 py-12 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-[15px] tracking-tight">OneTribe<span className="text-primary">.</span></p>
            <p className="text-[12px] text-muted-foreground mt-1">© {new Date().getFullYear()} — The global Habesha marketplace.</p>
          </div>
          <div className="flex gap-8 text-[12px] text-muted-foreground">
            <button onClick={() => navigate("/marketplace")} className="hover:text-foreground transition-colors">Shop</button>
            <button onClick={() => navigate("/sell")} className="hover:text-foreground transition-colors">Sell</button>
            <button onClick={() => navigate("/support")} className="hover:text-foreground transition-colors">Support</button>
            <button onClick={() => navigate("/faq")} className="hover:text-foreground transition-colors">FAQ</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
