import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Role = "user" | "assistant";

type ChatTurn = {
  id: string;
  role: Role;
  content: string;
};

export const Assistant = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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

  const askAI = async (history: ChatTurn[]): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: {
        messages: history.map(m => ({ role: m.role, content: m.content }))
      }
    });

    if (error) {
      console.error("AI Assistant error:", error);
      throw new Error("Failed to get AI response");
    }

    return data.message;
  };

  const onSend = async () => {
    if (!canSend) return;
    const userTurn: ChatTurn = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(prev => [...prev, userTurn]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askAI([...messages, userTurn]);
      const assistantTurn: ChatTurn = { id: `${userTurn.id}-a`, role: "assistant", content: reply };
      setMessages(prev => [...prev, assistantTurn]);
    } catch (e) {
      setMessages(prev => [...prev, { id: `${userTurn.id}-err`, role: "assistant", content: "There was an error getting AI response. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Sparkles className="text-primary" size={20} />
        <h1 className="text-white text-lg font-semibold">AI Shopping Assistant</h1>
      </header>

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
