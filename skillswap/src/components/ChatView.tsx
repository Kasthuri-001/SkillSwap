import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User, LearningRequest } from '../types';
import { MessageSquare, Send, Image as ImageIcon, CheckCheck, ArrowLeft, Paperclip, Sparkles } from 'lucide-react';

interface ChatThread {
  request: LearningRequest;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: ChatMessage | null;
  unreadCount: number;
}

interface ChatViewProps {
  currentUser: User;
  threads: ChatThread[];
  activeRequestId?: string | null;
  onSendMessage: (requestId: string, receiverId: string, content: string, imageUrl?: string) => Promise<void>;
  onMarkRead: (requestId: string) => Promise<void>;
}

const QUICK_REPLIES = [
  "Hi! Ready for our SkillSwap session?",
  "What time on Friday works best for you?",
  "Thanks for the great teaching session!",
  "Here is the video meeting link!"
];

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  threads,
  activeRequestId,
  onSendMessage,
  onMarkRead
}) => {
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [imageInputUrl, setImageInputUrl] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Select initial thread if activeRequestId passed
  useEffect(() => {
    if (activeRequestId && threads.length > 0) {
      const match = threads.find((t) => t.request.id === activeRequestId);
      if (match) setSelectedThread(match);
    } else if (!selectedThread && threads.length > 0) {
      setSelectedThread(threads[0]);
    }
  }, [activeRequestId, threads]);

  // Load chat history when thread selected
  useEffect(() => {
    if (!selectedThread) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat/history/${selectedThread.request.id}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          onMarkRead(selectedThread.request.id);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 3000); // Live poll sync fallback
    return () => clearInterval(interval);
  }, [selectedThread?.request.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    if (!selectedThread) return;

    const content = textOverride || messageInput;
    if (!content.trim() && !imageInputUrl.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage(selectedThread.request.id, selectedThread.partnerId, content, imageInputUrl || undefined);

      // Append locally
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_' + Date.now(),
          requestId: selectedThread.request.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          receiverId: selectedThread.partnerId,
          content,
          imageUrl: imageInputUrl || undefined,
          read: false,
          timestamp: new Date().toISOString()
        }
      ]);

      setMessageInput('');
      setImageInputUrl('');
      setShowImageModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {!selectedThread ? (
        /* Threads List View */
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Real-Time SkillSwap Chat</span>
            </h2>
            <p className="text-xs text-slate-400">Coordinate session schedules, ask questions, and share materials</p>
          </div>

          {threads.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-medium">No active chat conversations yet.</p>
              <p className="text-[11px] text-slate-500">Send or accept a learning request on Discover to start chatting!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {threads.map((thread) => (
                <div
                  key={thread.request.id}
                  onClick={() => setSelectedThread(thread)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative">
                      <img
                        src={thread.partnerAvatar}
                        alt={thread.partnerName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
                    </div>

                    <div className="truncate space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-xs text-white truncate">{thread.partnerName}</h4>
                        <span className="text-[9px] bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-medium truncate">
                          {thread.request.skillTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {thread.lastMessage ? thread.lastMessage.content || 'Sent an image' : thread.request.message}
                      </p>
                    </div>
                  </div>

                  {thread.unreadCount > 0 && (
                    <span className="bg-indigo-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Active One-to-One Conversation Screen */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Active Chat Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between z-10">
            <div className="flex items-center space-x-2.5 min-w-0">
              <button
                onClick={() => setSelectedThread(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <img
                src={selectedThread.partnerAvatar}
                alt={selectedThread.partnerName}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />

              <div className="truncate">
                <h4 className="font-bold text-xs text-white truncate">{selectedThread.partnerName}</h4>
                <p className="text-[10px] text-indigo-300 truncate">{selectedThread.request.skillTitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-medium text-emerald-400">Online</span>
            </div>
          </div>

          {/* Quick Reply Pills */}
          <div className="bg-slate-900/60 px-3 py-1.5 border-b border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0">Quick:</span>
            {QUICK_REPLIES.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(undefined, reply)}
                className="whitespace-nowrap text-[10px] font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-2.5 py-0.5 rounded-full transition"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No messages yet. Say hello to start discussing your SkillSwap session!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed space-y-1 shadow-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="Attachment"
                          className="rounded-lg max-h-48 w-full object-cover mb-1 border border-white/10"
                        />
                      )}
                      <p>{msg.content}</p>
                    </div>

                    <div className="flex items-center space-x-1 mt-1 text-[9px] text-slate-500 px-1">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="bg-slate-900 border-t border-slate-800 p-2.5 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowImageModal(!showImageModal)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              title="Attach Image URL"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Type message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none placeholder-slate-500"
            />

            <button
              type="submit"
              disabled={isSending || (!messageInput.trim() && !imageInputUrl.trim())}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Image Attachment Modal Input */}
          {showImageModal && (
            <div className="bg-slate-900 border-t border-slate-800 p-2 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Paste Image URL..."
                value={imageInputUrl}
                onChange={(e) => setImageInputUrl(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-xs font-semibold text-slate-400 hover:text-white px-2"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
