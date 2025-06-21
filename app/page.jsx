'use client';

import Cardcomponent from "@/components/cardcomponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, MessageCircle, Phone, X, Send, Heart, Reply } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey everyone! How's your day going? 💛",
      sender: "Sarah",
      timestamp: "2:30 PM",
      likes: 3,
      isLiked: false,
      replies: []
    },
    {
      id: 2,
      text: "Feeling a bit overwhelmed today, but trying to stay positive!",
      sender: "Mike",
      timestamp: "2:32 PM",
      likes: 5,
      isLiked: true,
      replies: []
    },
    {
      id: 3,
      text: "You're doing great, Mike! Remember to take deep breaths 🌸",
      sender: "Emma",
      timestamp: "2:35 PM",
      likes: 2,
      isLiked: false,
      replies: []
    },
    {
      id: 4,
      text: "Thanks Emma! That really helps ❤️",
      sender: "Mike",
      timestamp: "2:36 PM",
      likes: 4,
      isLiked: false,
      replies: []
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  const navigateToCall = () => {
    router.push('/call');
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        isLiked: false,
        replies: []
      };
      setMessages([...messages, message]);
      setNewMessage("");
      setReplyTo(null);
    }
  };

  const toggleLike = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1, isLiked: !msg.isLiked }
        : msg
    ));
  };

  const handleDoubleClick = (message) => {
    setReplyTo(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1e1e1e] via-[#252526] to-[#000000] text-white overflow-hidden p-4 md:p-6 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="w-full max-w-2xl text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">Soul-care</h1>
        <p className="text-lg md:text-2xl text-white/80 mb-6">Connect. Share. Heal. Your safe space for support and well-being.</p>
      </div>

      {/* Action Cards */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl justify-center mb-12">
        {/* Dashboard Card */}
        <div onClick={navigateToDashboard} className="cursor-pointer flex-1">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl hover:bg-white/20 transition-colors duration-200">
            <CardHeader className="flex items-center space-x-2">
              <LayoutDashboard className="w-6 h-6 text-white" />
              <CardTitle className="text-white text-lg">Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/80">View your progress, stats, and recent activity.</p>
            </CardContent>
          </Card>
        </div>
        {/* Start Call Card */}
        <div onClick={navigateToCall} className="cursor-pointer flex-1">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl hover:bg-white/20 transition-colors duration-200">
            <CardHeader className="flex items-center space-x-2">
              <Phone className="w-6 h-6 text-green-400" />
              <CardTitle className="text-white text-lg">Start a Call</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/80">Connect instantly with someone who cares.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optionally, keep Cardcomponent for extra info or features */}
      {/* <div className="w-full max-w-2xl mb-12"><Cardcomponent/></div> */}

      {/* Sticky Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={toggleChat}
          className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-colors p-4 rounded-full shadow-2xl"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white">Community Chat</h3>
              <button 
                onClick={toggleChat}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="group">
                  <div 
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 cursor-pointer hover:bg-white/15 transition-colors"
                    onDoubleClick={() => handleDoubleClick(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-white">{message.sender}</span>
                      <span className="text-xs text-white/60">{message.timestamp}</span>
                    </div>
                    <p className="text-white/90 mb-2">{message.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => toggleLike(message.id)}
                          className={`flex items-center space-x-1 text-xs transition-colors ${
                            message.isLiked ? 'text-red-400' : 'text-white/60 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${message.isLiked ? 'fill-current' : ''}`} />
                          <span>{message.likes}</span>
                        </button>
                        <button 
                          onClick={() => setReplyTo(message)}
                          className="text-xs text-white/60 hover:text-white transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reply indicator */}
                  {replyTo?.id === message.id && (
                    <div className="ml-4 mt-2 p-2 bg-white/5 rounded-lg border-l-2 border-blue-400">
                      <p className="text-xs text-white/60">Replying to {message.sender}</p>
                      <p className="text-xs text-white/80 truncate">{message.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/20">
              {replyTo && (
                <div className="mb-2 p-2 bg-white/5 rounded-lg flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-white/60">Replying to {replyTo.sender}</p>
                    <p className="text-xs text-white/80 truncate">{replyTo.text}</p>
                  </div>
                  <button 
                    onClick={() => setReplyTo(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                />
                <button 
                  onClick={sendMessage}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
