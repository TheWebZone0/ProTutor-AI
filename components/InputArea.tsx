import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string, images: string[]) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [images, setImages] = useState<{ data: string; mime: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!input.trim() && images.length === 0) || isLoading) return;
    
    const imageBase64s = images.map(img => img.data);
    onSend(input, imageBase64s);
    
    setInput('');
    setImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove header data:image/xyz;base64,
        const base64Data = base64String.split(',')[1];
        setImages(prev => [...prev, { data: base64Data, mime: file.type }]);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
    setInput(target.value);
  };

  return (
    <div className="w-full bg-white border-t border-slate-200 p-4 pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex gap-3 mb-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={`data:${img.mime};base64,${img.data}`} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded-lg border border-slate-200"
                />
                <button 
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex items-end bg-slate-50 border border-slate-300 rounded-2xl shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Upload image"
            disabled={isLoading}
          >
            <ImageIcon size={24} />
          </button>
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={autoResize}
            onKeyDown={handleKeyDown}
            placeholder="Paste your homework question here or upload a photo..."
            className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 resize-none py-4 px-2 max-h-[150px] min-h-[56px]"
            rows={1}
            disabled={isLoading}
          />

          <button 
            onClick={handleSubmit}
            disabled={(!input.trim() && images.length === 0) || isLoading}
            className={`p-3 m-1 rounded-xl flex items-center justify-center transition-all ${
              (!input.trim() && images.length === 0) || isLoading 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileSelect}
          />
        </div>
        <div className="text-center mt-2">
            <p className="text-xs text-slate-400">AI can make mistakes. Double check important info.</p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;