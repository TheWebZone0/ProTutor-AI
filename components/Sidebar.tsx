import React from 'react';
import { TutorMode } from '../types';
import { GraduationCap, Zap, BookOpen, Trash2, ExternalLink, MessageSquare } from 'lucide-react';

interface SidebarProps {
  mode: TutorMode;
  setMode: (mode: TutorMode) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mode, setMode, onClear, isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-slate-100 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static border-r border-slate-800 flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">ProTutor AI</h1>
              <p className="text-xs text-slate-400">by Adham Ahmed</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Learning Mode</h2>
            <div className="space-y-2">
              <button 
                onClick={() => setMode('learning')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
                  mode === 'learning' 
                  ? 'bg-indigo-600/20 border-indigo-600 text-indigo-400' 
                  : 'bg-slate-800/50 border-transparent hover:bg-slate-800 text-slate-300'
                }`}
              >
                <BookOpen size={20} />
                <div className="text-left">
                  <div className="font-medium">Full Learning</div>
                  <div className="text-[10px] opacity-70">Detailed steps & practice</div>
                </div>
              </button>

              <button 
                onClick={() => setMode('fast')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
                  mode === 'fast' 
                  ? 'bg-emerald-600/20 border-emerald-600 text-emerald-400' 
                  : 'bg-slate-800/50 border-transparent hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Zap size={20} />
                <div className="text-left">
                  <div className="font-medium">Fast Answer</div>
                  <div className="text-[10px] opacity-70">Quick solution</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mb-8">
             <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Contact</h2>
             <a 
                href="https://wa.me/+201091569465" 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/30"
             >
                <MessageSquare size={20} />
                <div className="text-left">
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-[10px] opacity-70">Ask Adham directly</div>
                </div>
             </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={onClear}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <Trash2 size={18} />
            <span className="text-sm font-medium">Clear Chat</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;