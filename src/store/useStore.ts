import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GeneratedOutfit {
  id: string;
  images: string[];
  prompt: string;
  style: string;
  createdAt: Date;
}

interface UseStore {
  // Current outfit being viewed
  currentOutfit: GeneratedOutfit | null;
  setCurrentOutfit: (outfit: GeneratedOutfit | null) => void;

  // Generation history
  history: GeneratedOutfit[];
  addToHistory: (outfit: GeneratedOutfit) => void;
  clearHistory: () => void;

  // Favorites
  favorites: GeneratedOutfit[];
  addToFavorites: (outfit: GeneratedOutfit) => void;
  removeFromFavorites: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // User preferences
  preferences: {
    defaultStyle: string;
    favoriteColors: string[];
    bodyParams: {
      height: number;
      bust: number;
      waist: number;
      hips: number;
    } | null;
  };
  updatePreferences: (preferences: Partial<UseStore['preferences']>) => void;

  // UI state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useStore = create<UseStore>()(
  persist(
    (set, get) => ({
      // Current outfit
      currentOutfit: null,
      setCurrentOutfit: (outfit) => set({ currentOutfit: outfit }),

      // History
      history: [],
      addToHistory: (outfit) =>
        set((state) => ({
          history: [outfit, ...state.history].slice(0, 50), // Keep last 50
          currentOutfit: outfit,
        })),
      clearHistory: () => set({ history: [] }),

      // Favorites
      favorites: [],
      addToFavorites: (outfit) =>
        set((state) => ({
          favorites: [...state.favorites, outfit],
        })),
      removeFromFavorites: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),
      toggleFavorite: (id) => {
        const { history, favorites, addToFavorites, removeFromFavorites } = get();
        const outfit = history.find((h) => h.id === id) || favorites.find((f) => f.id === id);
        
        if (!outfit) return;

        if (favorites.some((f) => f.id === id)) {
          removeFromFavorites(id);
        } else {
          addToFavorites(outfit);
        }
      },

      // Preferences
      preferences: {
        defaultStyle: '',
        favoriteColors: [],
        bodyParams: null,
      },
      updatePreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),

      // UI
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'virtuefit-storage',
      partialize: (state) => ({
        history: state.history,
        favorites: state.favorites,
        preferences: state.preferences,
      }),
    }
  )
);
