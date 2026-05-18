import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().trim().email().max(255);

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: parsed.data, source: "landing_page" });

    if (error) {
      if (error.code === "23505") {
        setStatus("error");
        setMessage("You're already on the list!");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
      return;
    }

    setStatus("success");
    setMessage("እንኳን ደስ አለዎ! You're on the list. We'll be in touch soon.");
    setEmail("");
  };

  return (
    <section className="bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-8 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-eyebrow text-background/60 mb-4">Early access</p>
          <h2 className="text-display mb-5">Be first. Join the waitlist.</h2>
          <p className="text-base md:text-lg text-background/70 mb-10">
            We're launching soon. Get early access to OneTribe — the marketplace built for the Habesha diaspora.
          </p>

          {status === "success" ? (
            <div
              role="status"
              className="bg-background/10 border border-background/20 rounded-full px-6 py-4 text-background"
            >
              {message}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            >
              <input
                type="email"
                required
                aria-label="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") {
                    setStatus("idle");
                    setMessage("");
                  }
                }}
                placeholder="you@example.com"
                className="flex-1 px-5 py-3 rounded-full bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-background/40 transition-all"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-7 py-3 bg-background text-foreground font-medium text-sm rounded-full hover:bg-background/90 active:scale-[0.98] transition-all duration-200 ease-spring disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === "loading" ? "Joining…" : "Join waitlist"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p role="alert" className="mt-4 text-sm text-background/80">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
