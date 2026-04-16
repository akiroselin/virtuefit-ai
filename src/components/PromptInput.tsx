'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2 } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string, style: string, colors: string[]) => void;
  isGenerating: boolean;
}

const colorOptions = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Gray', hex: '#6b7280' },
];

const suggestedPrompts = [
  'Futuristic cyberpunk jacket with LED accents',
  'Elegant evening gown with flowing silhouette',
  'Streetwear hoodie with geometric patterns',
  'Minimalist monochrome blazer',
  'Avant-garde sculptural dress',
];

export default function PromptInput({ onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleColorToggle = (hex: string) => {
    setSelectedColors((prev) =>
      prev.includes(hex)
        ? prev.filter((c) => c !== hex)
        : prev.length < 3
        ? [...prev, hex]
        : prev
    );
  };

  const handleGenerate = () => {
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt, '', selectedColors);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="glass-effect rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg accent-gradient flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg">AI Design Assistant</h2>
          <p className="text-sm text-text-secondary">Describe your dream outfit</p>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="relative">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="E.g., A futuristic silver jacket with geometric patterns and LED lighting..."
            className="w-full bg-dark-purple/50 border border-border-subtle rounded-xl px-4 py-3 pr-12 text-text-primary placeholder:text-text-secondary/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            rows={3}
          />
          <motion.button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="absolute right-3 bottom-3 w-9 h-9 rounded-lg accent-gradient flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            whileTap={{ scale: 0.95 }}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </motion.button>
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && prompt.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full mt-2 z-10 bg-dark-purple border border-border-subtle rounded-xl overflow-hidden"
            >
              <p className="px-4 py-2 text-xs text-text-secondary border-b border-border-subtle">
                Try these prompts
              </p>
              {suggestedPrompts.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-secondary">
            Preferred Colors (max 3)
          </label>
          <span className="text-xs text-text-secondary/60">
            {selectedColors.length}/3 selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <motion.button
              key={color.hex}
              onClick={() => handleColorToggle(color.hex)}
              className={`
                w-8 h-8 rounded-full border-2 transition-all relative
                ${selectedColors.includes(color.hex) 
                  ? 'border-white scale-110' 
                  : 'border-transparent hover:scale-105'
                }
              `}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              whileTap={{ scale: 0.9 }}
            >
              {selectedColors.includes(color.hex) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className={`
                    w-3 h-3 rounded-full border-2
                    ${color.hex === '#ffffff' || color.hex === '#ef4444' || color.hex === '#eab308' 
                      ? 'border-dark-purple' 
                      : 'border-white'
                    }
                  `} />
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        className="w-full py-4 rounded-xl accent-gradient font-bold text-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Outfit
            </>
          )}
        </span>
        {isGenerating && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.button>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-text-secondary/60">
        Press <kbd className="px-1.5 py-0.5 bg-dark-purple rounded border border-border-subtle">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-dark-purple rounded border border-border-subtle">Enter</kbd> to generate
      </p>
    </div>
  );
}
