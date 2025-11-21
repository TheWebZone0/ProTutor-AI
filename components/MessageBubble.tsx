import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Bot, User, Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
          {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative px-5 py-4 rounded-2xl shadow-sm border ${
            isUser 
              ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
              : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
          }`}>
            
            {/* Attachments if user sent images */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {message.attachments.map((att, idx) => (
                  <img 
                    key={idx} 
                    src={`data:${att.mimeType};base64,${att.data}`} 
                    alt="Attachment" 
                    className="h-32 w-auto object-cover rounded-lg border border-white/20"
                  />
                ))}
              </div>
            )}

            {/* Content */}
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <div className="markdown-content text-sm md:text-base">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}

            {/* Copy Button (Model only) */}
            {!isUser && !message.isStreaming && (
              <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Copy response"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}
          </div>
          <span className="text-xs text-slate-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;