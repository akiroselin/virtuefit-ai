'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  progress: number;
}

export default function LoadingOverlay({ progress }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-space-black/90 backdrop-blur-md"
    >
      <div className="flex flex-col items-center gap-8 max-w-md w-full mx-4">
        {/* Logo Animation */}
        <motion.div
          className="relative"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-24 h-24 rounded-2xl accent-gradient flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                '0 0 30px rgba(102, 126, 234, 0.5)',
                '0 0 60px rgba(102, 126, 234, 0.8)',
                '0 0 30px rgba(118, 75, 162, 0.6)',
                '0 0 30px rgba(102, 126, 234, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Text */}
        <div className="text-center space-y-2">
          <motion.h2
            className="font-heading font-bold text-2xl text-gradient"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AI is Creating...
          </motion.h2>
          <p className="text-text-secondary">
            Crafting your unique virtual outfit
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-2 bg-dark-purple rounded-full overflow-hidden">
            <motion.div
              className="h-full accent-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Processing</span>
            <span className="font-mono">{progress.toFixed(0)}%</span>
          </div>
        </div>

        {/* Particles */}
        <div className="relative w-64 h-64">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full accent-gradient"
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
              }}
              animate={{
                x: Math.cos((i * 60 * Math.PI) / 180) * 100,
                y: Math.sin((i * 60 * Math.PI) / 180) * 100,
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Status Messages */}
        <motion.div
          className="text-center space-y-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-sm text-text-secondary">
            {progress < 30 && "Analyzing style preferences..."}
            {progress >= 30 && progress < 60 && "Generating garment designs..."}
            {progress >= 60 && progress < 90 && "Applying fabric textures..."}
            {progress >= 90 && "Finalizing virtual try-on..."}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
