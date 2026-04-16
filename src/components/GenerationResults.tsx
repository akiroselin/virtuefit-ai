'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Download, 
  Share2, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  X,
  Star,
  StarOff
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { GeneratedOutfit } from '@/store/useStore';

export default function GenerationResults() {
  const { history, favorites, toggleFavorite } = useStore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'history' | 'favorites'>('history');

  const displayItems = viewMode === 'history' ? history : favorites;

  if (displayItems.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-dark-purple flex items-center justify-center">
            <span className="text-2xl">🖼️</span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg">
              {viewMode === 'history' ? 'Generation History' : 'Favorites'}
            </h2>
            <p className="text-sm text-text-secondary">
              {viewMode === 'history' ? 'Your recent creations' : 'Your saved outfits'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-dark-purple flex items-center justify-center mb-4">
            <span className="text-4xl">
              {viewMode === 'history' ? '✨' : '❤️'}
            </span>
          </div>
          <p className="text-text-secondary">
            {viewMode === 'history' 
              ? 'No outfits generated yet' 
              : 'No favorites yet'
            }
          </p>
          <p className="text-sm text-text-secondary/60 mt-1">
            {viewMode === 'history'
              ? 'Create your first AI-powered outfit!'
              : 'Heart your favorite designs to save them here'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-dark-purple flex items-center justify-center">
            <span className="text-2xl">🖼️</span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg">
              {viewMode === 'history' ? 'Generation History' : 'Favorites'}
            </h2>
            <p className="text-sm text-text-secondary">
              {displayItems.length} {displayItems.length === 1 ? 'outfit' : 'outfits'}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('history')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              viewMode === 'history'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setViewMode('favorites')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
              viewMode === 'favorites'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Heart className="w-3 h-3" />
            Favorites
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {displayItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative rounded-xl overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedIndex(index)}
          >
            {/* Image */}
            <div className="aspect-square relative bg-dark-purple">
              {item.images?.[0] ? (
                <img
                  src={item.images[0]}
                  alt={item.prompt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">👗</span>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  {favorites.some((f) => f.id === item.id) ? (
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  ) : (
                    <Heart className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download logic
                  }}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <Download className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Style Badge */}
              {item.style && (
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-1 bg-purple-500/80 rounded text-xs text-white">
                    {item.style}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2 bg-dark-purple/50">
              <p className="text-xs text-text-secondary truncate">
                {item.prompt.slice(0, 50)}...
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedIndex !== null && displayItems[selectedIndex] && (
          <OutfitModal
            item={displayItems[selectedIndex]}
            onClose={() => setSelectedIndex(null)}
            onPrev={() => setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : displayItems.length - 1)}
            onNext={() => setSelectedIndex(selectedIndex < displayItems.length - 1 ? selectedIndex + 1 : 0)}
            hasMultiple={displayItems.length > 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OutfitModal({ 
  item, 
  onClose, 
  onPrev, 
  onNext,
  hasMultiple 
}: { 
  item: GeneratedOutfit; 
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasMultiple: boolean;
}) {
  const { toggleFavorite, favorites } = useStore();
  const isFavorite = favorites.some((f) => f.id === item.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl w-full bg-dark-purple rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Navigation */}
        {hasMultiple && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square md:aspect-auto bg-black flex items-center justify-center">
            {item.images?.[0] ? (
              <img
                src={item.images[0]}
                alt={item.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-8xl">👗</span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-400">
                  {item.style || 'Custom Design'}
                </span>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  {isFavorite ? (
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  ) : (
                    <Heart className="w-6 h-6 text-text-secondary" />
                  )}
                </button>
              </div>

              <h3 className="font-heading font-bold text-2xl mb-2">Generated Outfit</h3>
              <p className="text-text-secondary leading-relaxed">
                {item.prompt}
              </p>

              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="text-xs text-text-secondary">
                  Generated on {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download
              </button>
              <button className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share
              </button>
              <button className="flex-1 py-3 rounded-xl accent-gradient flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
