'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Create', href: '#create' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Profile', href: '#profile' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border-subtle">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 rounded-lg accent-gradient flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-gradient">
                VirtueFit AI
              </h1>
              <p className="text-xs text-text-secondary">Virtual Try-On Platform</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="relative text-text-secondary hover:text-text-primary transition-colors py-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-gradient group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* AI Assistant Button */}
          <motion.button
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass-effect hover:bg-white/10 transition-all"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            <span className="font-medium">AI Assistant</span>
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 w-6 bg-text-primary transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-6 bg-text-primary transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-text-primary transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-border-subtle"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary transition-colors py-2"
                >
                  {item.name}
                </a>
              ))}
              <button className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect mt-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
                <span className="font-medium">AI Assistant</span>
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
