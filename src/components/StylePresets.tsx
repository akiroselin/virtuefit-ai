'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface StylePreset {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
}

const stylePresets: StylePreset[] = [
  {
    id: 'streetwear',
    name: 'Streetwear',
    description: 'Urban, casual, bold',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    tags: ['Casual', 'Urban', 'Bold'],
  },
  {
    id: 'formal',
    name: 'Formal',
    description: 'Elegant, sophisticated',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
    tags: ['Elegant', 'Classic', 'Professional'],
  },
  {
    id: 'avant-garde',
    name: 'Avant-Garde',
    description: 'Experimental, artistic',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    tags: ['Artistic', 'Experimental', 'Bold'],
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple, refined',
    image: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=400',
    tags: ['Clean', 'Simple', 'Elegant'],
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic, edgy, tech',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
    tags: ['Futuristic', 'Tech', 'Edgy'],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro, nostalgic, classic',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    tags: ['Retro', 'Nostalgic', 'Classic'],
  },
];

export default function StylePresets() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="glass-effect rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-dark-purple flex items-center justify-center">
          <span className="text-2xl">🎨</span>
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg">Style Presets</h2>
          <p className="text-sm text-text-secondary">Choose a base style</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stylePresets.map((style, index) => (
          <motion.button
            key={style.id}
            onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
            onHoverStart={() => setHoveredId(style.id)}
            onHoverEnd={() => setHoveredId(null)}
            className={`
              relative rounded-xl overflow-hidden text-left transition-all
              ${selectedStyle === style.id 
                ? 'ring-2 ring-purple-500 scale-[1.02]' 
                : 'hover:scale-[1.02]'
              }
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Image */}
            <div className="aspect-[3/4] relative">
              <img
                src={style.image}
                alt={style.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="font-heading font-semibold text-white text-sm">
                  {style.name}
                </h3>
                <p className="text-xs text-white/70 mt-0.5">
                  {style.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {style.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedStyle === style.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full accent-gradient flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">✓</span>
                </motion.div>
              )}

              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-purple-500/20 opacity-0"
                animate={{ opacity: hoveredId === style.id ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected Style Info */}
      {selectedStyle && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-dark-purple/50 rounded-xl border border-border-subtle"
        >
          <p className="text-sm text-text-secondary">
            Selected: <span className="text-text-primary font-medium">
              {stylePresets.find((s) => s.id === selectedStyle)?.name}
            </span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
