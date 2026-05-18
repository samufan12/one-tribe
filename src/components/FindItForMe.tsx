import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type PublicProduct = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  location: string;
};

const EXAMPLE_PROMPTS = [
  "Coffee ceremony set",
  "White kemis with tilet",
  "Handwoven mesob table",
];

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "for", "with", "and", "from", "looking", "find", "want", "need"].includes(w));

export const FindItForMe = () => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PublicProduct[] | null>(null);
  const [aiMessage, setAiMessage] = useState<string>("");
  const [postedToCommunity, setPostedToCommunity] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  useEffect(() => {
    document.title = "Find it for me | OneTribe";
  }, []);

  const handleSearch = async (queryText?: string) => {
    const query = (queryText ?? input).trim();
    if (!query || loading) return;

    setLoading(true);
    setAiMessage("");
    setPostedToCommunity(false);
    setLastQuery(query);

    try {
      // 1. Search products
      const { data: products, error } = await supabase.rpc("get_public_products");
      if (error) throw error;

      const tokens = tokenize(query);
      const scored = (products ?? [])
        .map((p: any) => {
          const haystack = `${p.title} ${p.description} ${p.category}`.toLowerCase();
          const score = tokens.reduce((acc, t) => acc + (haystack.includes(t) ? 1 : 0), 0);
          return { p, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map((x) => x.p as PublicProduct);

      setResults(scored);

      // 2. If fewer than 3 results, post to community feed (auth required)
      if (scored.length < 3 && user) {
        const { error: postErr } = await supabase.from("community_posts").insert({
          user_id: user.id,
          post_type: "community_pick",
          caption: `Looking for: ${query}`,
        });
        if (!postErr) setPostedToCommunity(true);
      }

      // 3. AI friendly response (auth required for edge function)
      if (user) {
        try {
          const { data: aiData } = await supabase.functions.invoke("ai-assistant", {
            body: {
              messages: [
                {
                  role: "user",
                  content: `A shopper is looking for: "${query}". We found ${scored.length} matching items in the marketplace${
                    scored.length < 3 ? " and posted their request to the community feed" : ""
                  }. Reply in 1-2 friendly sentences confirming what we did. Extract key attributes (item type, color, size, occasion, region) silently — don't list them.`,
                },
              ],
            },
          });
          if (aiData?.message) setAiMessage(aiData.message);
        } catch {
          // Fall back silently to default message
        }
      }

      if (!aiMessage) {
        setAiMessage(
          scored.length === 0
            ? "Nothing in the marketplace yet — but we've let the community know."
            : `Found ${scored.length} item${scored.length === 1 ? "" : "s"} that may match what you're looking for.`
        );
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showResults = results !== null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Sparkles className="w-3.5 h-3.5" /> AI Assistant
        </div>
        <h1 className="text-4xl md:text-5xl font-serif mb-3">Find it for me</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Describe what you're looking for in any language — we'll find it or ask the community.
        </p>
      </div>

      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. I'm looking for a white kemis with gold tilet for a wedding in July..."
          className="min-h-[120px] text-base resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSearch();
          }}
        />
        <div className="flex justify-end">
          <Button onClick={() => handleSearch()} disabled={!input.trim() || loading} size="lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Find it
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {EXAMPLE_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setInput(p);
              handleSearch(p);
            }}
            disabled={loading}
            className="text-sm px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      {showResults && (
        <div className="mt-10 space-y-6">
          {aiMessage && (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <p>{aiMessage}</p>
              </div>
            </div>
          )}

          {postedToCommunity && (
            <Badge variant="secondary" className="text-xs">
              We've posted this to the community feed
            </Badge>
          )}

          {results && results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((p) => (
                  <div key={p.id} className="border rounded-lg overflow-hidden bg-card flex flex-col">
                    <Link to={`/product/${p.id}`} className="block aspect-square bg-muted overflow-hidden">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </Link>
                    <div className="p-3 flex flex-col gap-2 flex-1">
                      <h3 className="text-sm font-medium line-clamp-2">{p.title}</h3>
                      <p className="text-sm text-muted-foreground">${Number(p.price).toFixed(2)}</p>
                      <Button asChild size="sm" variant="outline" className="mt-auto">
                        <Link to={`/product/${p.id}`}>View listing</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center pt-2">
                Not what you're looking for?{" "}
                <button
                  className="underline hover:text-foreground"
                  onClick={() => {
                    setInput(lastQuery);
                    setResults(null);
                  }}
                >
                  Describe it differently
                </button>
              </p>
            </>
          ) : (
            <div className="text-center py-10 border rounded-lg bg-muted/30">
              <p className="text-base font-medium mb-1">Nothing yet</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {postedToCommunity
                  ? "Your request is now live in the community feed. Sellers will reach out if they have it."
                  : user
                  ? "Try describing your item differently."
                  : "Sign in to share your request with the community."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindItForMe;
