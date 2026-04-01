import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { z } from "zod";
import { sanitizeString } from "@/lib/sanitize";

export interface Conversation {
  conversation_id: string;
  other_user_id: string;
  other_display_name: string | null;
  other_avatar_url: string | null;
  product_id: string | null;
  last_message_content: string | null;
  last_message_time: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  offer_amount: number | null;
  offer_item_name: string | null;
  created_at: string;
}

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) { setConversations([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase.rpc("get_user_conversations");
    if (!error && data) setConversations(data as Conversation[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
};

export const useMessages = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user) { setMessages([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (!error && data) setMessages(data);
    setLoading(false);
  }, [conversationId, user]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Real-time subscription
  useEffect(() => {
    if (!conversationId || !user) return;
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, user]);

  const messageSchema = z.object({
    content: z.string().trim().min(1, "Message cannot be empty").max(2000, "Message too long"),
    type: z.enum(["text", "offer", "trade"]).default("text"),
    offerAmount: z.number().positive().max(999999).optional(),
    offerItemName: z.string().trim().max(200).optional(),
  });

  const sendMessage = async (content: string, type = "text", offerAmount?: number, offerItemName?: string) => {
    if (!user || !conversationId) return;

    const validation = messageSchema.safeParse({ content, type, offerAmount, offerItemName });
    if (!validation.success) return;

    const sanitizedContent = sanitizeString(validation.data.content);
    const sanitizedItemName = validation.data.offerItemName ? sanitizeString(validation.data.offerItemName) : null;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: sanitizedContent,
      message_type: validation.data.type,
      offer_amount: validation.data.offerAmount ?? null,
      offer_item_name: sanitizedItemName,
    });
  };

  return { messages, loading, sendMessage, refetch: fetchMessages };
};
