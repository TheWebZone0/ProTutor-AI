import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { Content, Part } from '@google/genai';
import { Message, TutorMode } from './types';
import { sendMessageToGemini } from './services/geminiService';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "👋 **Hello! I'm your Professional Study AI Tutor.**\n\nI can help you with Math, Physics, Coding, Essay writing, and more.\n\nSend me a problem or upload a photo of your homework, and I'll explain it step-by-step!",
      timestamp: Date.now()
    }
  ]);
  
  const [mode, setMode] = useState<TutorMode>('learning');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClear = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      content: "Chat cleared. What subject shall we tackle next?",
      timestamp: Date.now()
    }]);
    setSidebarOpen(false);
  };

  const handleSendMessage = async (text: string, images: string[]) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      attachments: images.map(img => ({ mimeType: 'image/jpeg', data: img }))
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    // Prepare history for API (convert local Message type to Gemini Content type)
    const history: Content[] = messages.map(msg => {
      const parts: Part[] = [];
      if (msg.content) {
        parts.push({ text: msg.content });
      }
      if (msg.attachments) {
        msg.attachments.forEach(att => {
          parts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: att.data
            }
          });
        });
      }
      
      // Ensure parts is not empty
      if (parts.length === 0) {
        parts.push({ text: '' });
      }

      return {
        role: msg.role,
        parts: parts
      };
    });

    try {
      // Create placeholder for bot response
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
        isStreaming: true
      }]);

      await sendMessageToGemini(
        history,
        text,
        images,
        mode,
        (chunkText) => {
          setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, content: chunkText } : msg
          ));
        }
      );

      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
      ));

    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        role: 'model',
        content: "⚠️ Sorry, I encountered an error connecting to the AI service. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* Sidebar */}
      <Sidebar 
        mode={mode} 
        setMode={setMode} 
        onClear={handleClear}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
              <Menu size={24} />
            </button>
            <span className="font-bold text-slate-800">ProTutor AI</span>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
            {mode === 'learning' ? 'Learning' : 'Fast'}
          </span>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-4xl mx-auto pb-4">
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="z-20">
          <InputArea onSend={handleSendMessage} isLoading={isLoading} />
        </div>

      </div>
    </div>
  );
}

export default App;