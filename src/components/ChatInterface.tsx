import { useState, useEffect } from "react";
import { Send, ArrowLeft, MoreVertical, Paperclip } from "lucide-react";
import { useConversations, useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export const ChatInterface = () => {
  const { user } = useAuth();
  const { conversations, loading: convsLoading } = useConversations();
  const [searchParams] = useSearchParams();
  const conversationParam = searchParams.get("conversation");
  const [selectedConvId, setSelectedConvId] = useState<string | null>(conversationParam);
  const { messages, loading: msgsLoading, sendMessage } = useMessages(selectedConvId);
  const [newMessage, setNewMessage] = useState("");

  // Update selected conversation if URL param changes
  useEffect(() => {
    if (conversationParam) setSelectedConvId(conversationParam);
  }, [conversationParam]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage.trim());
    setNewMessage("");
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Please sign in to view your messages.</p>
      </div>
    );
  }

  if (!selectedConvId) {
    return (
      <div className="h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Messages</h2>
        </div>

        {convsLoading ? (
          <div className="p-4 text-muted-foreground">Loading conversations…</div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No conversations yet.</p>
            <p className="text-sm mt-2">Start one by messaging a seller from a product page.</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <button
                key={conv.conversation_id}
                onClick={() => setSelectedConvId(conv.conversation_id)}
                className="w-full p-3 flex items-center gap-3 hover:bg-muted rounded-lg transition-colors"
              >
                <img
                  src={conv.other_avatar_url || "/placeholder.svg"}
                  alt={conv.other_display_name || "User"}
                  className="w-12 h-12 rounded-full object-cover bg-muted"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-medium">
                      {conv.other_display_name || "Unknown User"}
                    </span>
                    {conv.last_message_time && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conv.last_message_time), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.last_message_content || "No messages yet"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const currentConv = conversations.find(c => c.conversation_id === selectedConvId);

  return (
    <div className="h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <button onClick={() => setSelectedConvId(null)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </button>
        <img
          src={currentConv?.other_avatar_url || "/placeholder.svg"}
          alt={currentConv?.other_display_name || "User"}
          className="w-10 h-10 rounded-full object-cover bg-muted"
        />
        <div className="flex-1">
          <h3 className="text-foreground font-medium">{currentConv?.other_display_name || "Unknown User"}</h3>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {msgsLoading ? (
          <div className="text-center text-muted-foreground">Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground">No messages yet. Say hello!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender_id === user.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}>
                {msg.message_type === "offer" && msg.offer_item_name ? (
                  <div className="space-y-2">
                    <div className="text-sm opacity-75">Offer for:</div>
                    <div className="font-medium">{msg.offer_item_name}</div>
                    <div className="text-lg font-bold">${msg.offer_amount}</div>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
                <div className="text-xs opacity-75 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:text-foreground p-2">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-background border border-border rounded-l-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={2000}
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
