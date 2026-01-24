import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Role = "user" | "assistant";

type ChatTurn = {
  id: string;
  role: Role;
  content: string;
};

const QUICK_PROMPTS = [
  "What traditional Ethiopian clothing do you have?",
  "Help me find a gift for someone",
  "What sizes are available for dresses?",
  "Tell me about Habesha cultural items",
];

export const Assistant = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([{
    id: "welcome",
    role: "assistant",
    content:
      "Please enter what you're looking for, and we'll help you find it (AI Assistant).",
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
      
      if (error.message?.includes('Rate limit')) {
        throw new Error("You've reached the maximum number of requests. Please try again in a few minutes.");
      }
      
      throw new Error("Failed to get AI response. Please try again.");
    }

    return data.message;
  };

  const onSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || loading) return;
    
    const userTurn: ChatTurn = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userTurn]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askAI([...messages, userTurn]);
      const assistantTurn: ChatTurn = { id: `${userTurn.id}-a`, role: "assistant", content: reply };
      setMessages(prev => [...prev, assistantTurn]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "There was an error getting AI response. Please try again.";
      setMessages(prev => [...prev, { id: `${userTurn.id}-err`, role: "assistant", content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const showQuickPrompts = messages.length === 1;

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b border-border flex items-center gap-3">
        <Sparkles className="text-primary" size={20} />
        <h1 className="text-foreground text-lg font-semibold">AI Shopping Assistant</h1>
      </header>

      <main ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xl px-4 py-2 rounded-lg ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        
        {showQuickPrompts && !loading && (
          <div className="flex flex-wrap gap-2 mt-4">
            {QUICK_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onSend(prompt)}
                className="px-3 py-2 text-sm bg-muted hover:bg-accent text-foreground rounded-lg border border-border transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        
        {loading && (
          <div className="text-muted-foreground text-sm">Thinking…</div>
        )}
      </main>

      <footer className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="Ask about habesha goods, shipping, sizes, or cultural details…"
            className="flex-1 px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            disabled={!canSend}
            onClick={() => onSend()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={18} /> Send
          </button>
        </div>
      </footer>
    </div>
  );
};