
import { useState } from "react";
import { Send, ArrowLeft, MoreVertical, Image, Paperclip } from "lucide-react";

type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'offer';
  offerDetails?: {
    amount: number;
    itemName: string;
  };
};

type ChatUser = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
};

const mockChats: { user: ChatUser; messages: ChatMessage[] }[] = [
  {
    user: {
      id: "1",
      name: "Meron Tadesse",
      avatar: "/lovable-uploads/e565a3ea-dc96-4344-a533-62026d4245e1.png",
      isOnline: true
    },
    messages: [
      {
        id: "1",
        senderId: "1",
        content: "Hi! I'm interested in the Habesha kemis you posted. Is it still available?",
        timestamp: "2:30 PM",
        type: 'text'
      },
      {
        id: "2",
        senderId: "me",
        content: "Yes it is! It's in perfect condition, never worn.",
        timestamp: "2:32 PM",
        type: 'text'
      },
      {
        id: "3",
        senderId: "1",
        content: "Would you consider $200?",
        timestamp: "2:35 PM",
        type: 'offer',
        offerDetails: {
          amount: 200,
          itemName: "Traditional Ethiopian Habesha Kemis"
        }
      }
    ]
  }
];

export const ChatInterface = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState(mockChats);

  const sendMessage = () => {
    if (!newMessage.trim() || selectedChat === null) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: "me",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setChats(prev => prev.map((chat, index) => 
      index === selectedChat 
        ? { ...chat, messages: [...chat.messages, newMsg] }
        : chat
    ));
    setNewMessage("");
  };

  if (selectedChat === null) {
    return (
      <div className="h-full">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Messages</h2>
        </div>
        
        <div className="space-y-1 p-2">
          {chats.map((chat, index) => (
            <button
              key={chat.user.id}
              onClick={() => setSelectedChat(index)}
              className="w-full p-3 flex items-center gap-3 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="relative">
                <img 
                  src={chat.user.avatar} 
                  alt={chat.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{chat.user.name}</span>
                  <span className="text-xs text-gray-400">
                    {chat.messages[chat.messages.length - 1]?.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {chat.messages[chat.messages.length - 1]?.content}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentChat = chats[selectedChat];

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <button 
          onClick={() => setSelectedChat(null)}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="relative">
          <img 
            src={currentChat.user.avatar} 
            alt={currentChat.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {currentChat.user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-medium">{currentChat.user.name}</h3>
          <p className="text-xs text-gray-400">
            {currentChat.user.isOnline ? "Online" : `Last seen ${currentChat.user.lastSeen}`}
          </p>
        </div>
        
        <button className="text-gray-400 hover:text-white">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {currentChat.messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === 'me' 
                ? 'bg-primary text-white' 
                : 'bg-gray-800 text-gray-100'
            }`}>
              {message.type === 'offer' && message.offerDetails ? (
                <div className="space-y-2">
                  <div className="text-sm opacity-75">Offer for:</div>
                  <div className="font-medium">{message.offerDetails.itemName}</div>
                  <div className="text-lg font-bold">${message.offerDetails.amount}</div>
                  {message.senderId !== 'me' && (
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                        Accept
                      </button>
                      <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                        Counter
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p>{message.content}</p>
              )}
              <div className="text-xs opacity-75 mt-1">{message.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-white p-2">
            <Paperclip size={20} />
          </button>
          <button className="text-gray-400 hover:text-white p-2">
            <Image size={20} />
          </button>
          
          <div className="flex-1 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              onClick={sendMessage}
              className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary/90 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
