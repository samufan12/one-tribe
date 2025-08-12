import { useEffect, useMemo, useRef, useState } from "react";
import { Send, KeyRound, Sparkles } from "lucide-react";

// Simple AI assistant for Habesha shopping guidance
// Uses OpenAI if an API key is provided (stored in localStorage under 'openai_api_key').
// Otherwise, it works in demo mode with canned responses.

type Role = "user" | "assistant";

type ChatTurn = {
  id: string;
  role: Role;
  content: string;
};

const OPENAI_MODEL = "gpt-4.1-2025-04-14"; // Recommended default

export const Assistant = () => {
  const [apiKey, setApiKey] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("openai_api_key") || "" : ""
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKeyBox, setShowKeyBox] = useState(!apiKey);
  const [messages, setMessages] = useState<ChatTurn[]>([{
    id: "welcome",
    role: "assistant",
    content:
      "Selam! I'm your Habesha AI shopping assistant. I can help you discover authentic Ethiopian & Eritrean goods, compare items, and explain cultural context. Ask me anything!",
  }]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "AI Shopping Assistant | OneTribe";
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const canSend = input.trim().length > 0 && !loading;

  const handleSaveKey = () => {
    localStorage.setItem("openai_api_key", apiKey.trim());
    setShowKeyBox(false);
  };

  const systemPrompt = useMemo(() => (
    "You are a helpful shopping assistant specializing in Ethiopian and Eritrean (Habesha) goods. " +
    "Be culturally respectful, concise, and practical. When users ask about products, suggest categories like traditional clothing (habesha kemis, netela, gabi), coffee & spices (buna, berbere, mitmita), and handcrafts (mesob, baskets, art). " +
    "Assume shipping availability to the US and Europe. If asked about price or stock, say you will check once the catalog is available."
  ), []);

  const askOpenAI = async (history: ChatTurn[]): Promise<string> => {
    if (!apiKey) {
      // Demo fallback
      return "I can provide general guidance. To enable real AI answers, add your OpenAI API key (click the key icon).";
    }

    const payload = {
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.4,
      max_tokens: 400,
    } as any;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("OpenAI error:", text);
      throw new Error("OpenAI request failed");
    }

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    return answer;
  };

  const onSend = async () => {
    if (!canSend) return;
    const userTurn: ChatTurn = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(prev => [...prev, userTurn]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askOpenAI([...messages, userTurn]);
      const assistantTurn: ChatTurn = { id: `${userTurn.id}-a`, role: "assistant", content: reply };
      setMessages(prev => [...prev, assistantTurn]);
    } catch (e) {
      setMessages(prev => [...prev, { id: `${userTurn.id}-err`, role: "assistant", content: "There was an error reaching OpenAI. Please check your API key and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Sparkles className="text-primary" size={20} />
        <h1 className="text-white text-lg font-semibold">AI Shopping Assistant</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            aria-label="Configure OpenAI API key"
            onClick={() => setShowKeyBox(v => !v)}
            className="px-3 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-800 flex items-center gap-2"
          >
            <KeyRound size={16} /> API Key
          </button>
        </div>
      </header>

      {showKeyBox && (
        <div className="p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
            <input
              type="password"
              placeholder="sk-... OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
            >
              Save key
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            For production, we recommend storing secrets in Supabase Edge Function secrets instead of the browser. We'll wire this up when backend is enabled.
          </p>
        </div>
      )}

      <main ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xl px-4 py-2 rounded-lg ${m.role === "user" ? "bg-primary text-white" : "bg-gray-800 text-gray-100"}`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 text-sm">Thinking…</div>
        )}
      </main>

      <footer className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="Ask about habesha goods, shipping, sizes, or cultural details…"
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            disabled={!canSend}
            onClick={onSend}
            className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={18} /> Send
          </button>
        </div>
      </footer>
    </div>
  );
};
