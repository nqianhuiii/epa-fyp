// stores/flashcardStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashcardSet, FlashcardAttempt } from '../types/FlashcardType';

interface FlashcardStore {
  // Current session state
  currentFlashcardSet: FlashcardSet | null;
  currentCardStatuses: ('kuasai' | 'belum-kuasai' | 'not-answered')[];
  currentCardIndex: number;
  sessionStartTime: Date | null;
  kuasaiCount: number;
  belumKuasaiCount: number;
  
  // Attempts history (renamed from sessions to match your interface)
  attempts: FlashcardAttempt[];
  
  // Actions
  setCurrentFlashcardSet: (flashcardSet: FlashcardSet) => void;
  markCard: (status: 'kuasai' | 'belum-kuasai') => void;
  nextCard: () => boolean; // returns false if no more cards
  previousCard: () => boolean; // returns false if already at first card
  goToCard: (index: number) => boolean; // go to specific card
  completeAttempt: (timeSpent: number) => void;
  clearCurrentSession: () => void;
  getAttemptHistory: (flashcardSetId: string) => FlashcardAttempt[];
  getTotalKuasai: (flashcardSetId: string) => number;
  getTotalBelumKuasai: (flashcardSetId: string) => number;
  getTotalAttempts: (flashcardSetId: string) => number;
  resetCurrentCard: () => void;
  resetAllCards: () => void;
  
  // New utility functions for kuasai/belum kuasai analysis
  getKuasaiCards: (flashcardSetId: string) => string[]; // returns card terms that are consistently kuasai
  getBelumKuasaiCards: (flashcardSetId: string) => string[]; // returns card terms that are consistently belum kuasai
  getCardProgress: (flashcardSetId: string, cardTerm: string) => {
    kuasaiCount: number;
    belumKuasaiCount: number;
    totalAttempts: number;
    lastStatus: 'kuasai' | 'belum-kuasai' | 'not-answered' | null;
  };
  getCurrentProgress: () => {
    totalCards: number;
    answeredCards: number;
    kuasaiCount: number;
    belumKuasaiCount: number;
    progressPercentage: number;
  };
}

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentFlashcardSet: null,
      currentCardStatuses: [],
      currentCardIndex: 0,
      sessionStartTime: null,
      kuasaiCount: 0,
      belumKuasaiCount: 0,
      attempts: [],

      // Set current flashcard set and initialize
      setCurrentFlashcardSet: (flashcardSet: FlashcardSet) => set({
        currentFlashcardSet: flashcardSet,
        currentCardStatuses: new Array(flashcardSet.cards.length).fill('not-answered'),
        currentCardIndex: 0,
        sessionStartTime: new Date(),
        kuasaiCount: 0,
        belumKuasaiCount: 0,
      }),

      // Mark current card status
      markCard: (status: 'kuasai' | 'belum-kuasai') => set((state) => {
        const newStatuses = [...state.currentCardStatuses];
        const currentIndex = state.currentCardIndex;
        
        // Remove previous status count if card was already marked
        const previousStatus = newStatuses[currentIndex];
        let newKuasaiCount = state.kuasaiCount;
        let newBelumKuasaiCount = state.belumKuasaiCount;
        
        if (previousStatus === 'kuasai') {
          newKuasaiCount--;
        } else if (previousStatus === 'belum-kuasai') {
          newBelumKuasaiCount--;
        }
        
        // Set new status
        newStatuses[currentIndex] = status;
        
        // Update counts
        if (status === 'kuasai') {
          newKuasaiCount++;
        } else if (status === 'belum-kuasai') {
          newBelumKuasaiCount++;
        }
        
        return {
          currentCardStatuses: newStatuses,
          kuasaiCount: newKuasaiCount,
          belumKuasaiCount: newBelumKuasaiCount,
        };
      }),

      // Move to next card
      nextCard: () => {
        const state = get();
        if (!state.currentFlashcardSet) return false;
        
        const nextIndex = state.currentCardIndex + 1;
        if (nextIndex >= state.currentFlashcardSet.cards.length) {
          return false; // No more cards
        }
        
        set({ currentCardIndex: nextIndex });
        return true;
      },

      // Move to previous card
      previousCard: () => {
        const state = get();
        if (state.currentCardIndex <= 0) return false;
        
        set({ currentCardIndex: state.currentCardIndex - 1 });
        return true;
      },

      // Go to specific card
      goToCard: (index: number) => {
        const state = get();
        if (!state.currentFlashcardSet || index < 0 || index >= state.currentFlashcardSet.cards.length) {
          return false;
        }
        
        set({ currentCardIndex: index });
        return true;
      },

      // Reset current card status (for current card only)
      resetCurrentCard: () => set((state) => {
        const newStatuses = [...state.currentCardStatuses];
        const currentIndex = state.currentCardIndex;
        const previousStatus = newStatuses[currentIndex];
        
        let newKuasaiCount = state.kuasaiCount;
        let newBelumKuasaiCount = state.belumKuasaiCount;
        
        // Remove previous status count
        if (previousStatus === 'kuasai') {
          newKuasaiCount--;
        } else if (previousStatus === 'belum-kuasai') {
          newBelumKuasaiCount--;
        }
        
        newStatuses[currentIndex] = 'not-answered';
        
        return {
          currentCardStatuses: newStatuses,
          kuasaiCount: newKuasaiCount,
          belumKuasaiCount: newBelumKuasaiCount,
        };
      }),

      // Reset all cards in current session
      resetAllCards: () => set((state) => {
        if (!state.currentFlashcardSet) return state;
        
        return {
          currentCardStatuses: new Array(state.currentFlashcardSet.cards.length).fill('not-answered'),
          kuasaiCount: 0,
          belumKuasaiCount: 0,
        };
      }),

      // Complete attempt and save (renamed from completeSession)
      completeAttempt: (timeSpent: number) => set((state) => {
        if (!state.currentFlashcardSet) return state;

        const newAttempt: FlashcardAttempt = {
          id: Date.now().toString(),
          flashcardSetId: state.currentFlashcardSet.id,
          userId: 'current-user', // Replace with actual user ID
          kuasaiCount: state.kuasaiCount,
          belumKuasaiCount: state.belumKuasaiCount,
          cardStatuses: [...state.currentCardStatuses],
          completedAt: new Date(),
          timeSpent,
        };

        return {
          attempts: [...state.attempts, newAttempt],
        };
      }),

      // Clear current session state
      clearCurrentSession: () => set({
        currentFlashcardSet: null,
        currentCardStatuses: [],
        currentCardIndex: 0,
        sessionStartTime: null,
        kuasaiCount: 0,
        belumKuasaiCount: 0,
      }),

      // Get attempt history for a flashcard set
      getAttemptHistory: (flashcardSetId: string) => {
        return get().attempts.filter(attempt => attempt.flashcardSetId === flashcardSetId);
      },

      // Get total kuasai across all attempts
      getTotalKuasai: (flashcardSetId: string) => {
        const attempts = get().getAttemptHistory(flashcardSetId);
        return attempts.reduce((total, attempt) => total + attempt.kuasaiCount, 0);
      },

      // Get total belum kuasai across all attempts
      getTotalBelumKuasai: (flashcardSetId: string) => {
        const attempts = get().getAttemptHistory(flashcardSetId);
        return attempts.reduce((total, attempt) => total + attempt.belumKuasaiCount, 0);
      },

      // Get total number of attempts
      getTotalAttempts: (flashcardSetId: string) => {
        return get().getAttemptHistory(flashcardSetId).length;
      },

      // Get cards that are consistently marked as kuasai
      getKuasaiCards: (flashcardSetId: string) => {
        const state = get();
        const attempts = state.getAttemptHistory(flashcardSetId);
        if (attempts.length === 0) return [];

        const flashcardSet = state.currentFlashcardSet;
        if (!flashcardSet || flashcardSet.id !== flashcardSetId) return [];

        const kuasaiCards: string[] = [];
        
        flashcardSet.cards.forEach((card, index) => {
          const cardStatuses = attempts.map(attempt => attempt.cardStatuses[index]).filter(Boolean);
          const kuasaiCount = cardStatuses.filter(status => status === 'kuasai').length;
          const totalAnswered = cardStatuses.filter(status => status !== 'not-answered').length;
          
          // Consider a card "kuasai" if it's marked kuasai in more than 70% of attempts
          if (totalAnswered > 0 && kuasaiCount / totalAnswered > 0.7) {
            kuasaiCards.push(card.term);
          }
        });

        return kuasaiCards;
      },

      // Get cards that are consistently marked as belum kuasai
      getBelumKuasaiCards: (flashcardSetId: string) => {
        const state = get();
        const attempts = state.getAttemptHistory(flashcardSetId);
        if (attempts.length === 0) return [];

        const flashcardSet = state.currentFlashcardSet;
        if (!flashcardSet || flashcardSet.id !== flashcardSetId) return [];

        const belumKuasaiCards: string[] = [];
        
        flashcardSet.cards.forEach((card, index) => {
          const cardStatuses = attempts.map(attempt => attempt.cardStatuses[index]).filter(Boolean);
          const belumKuasaiCount = cardStatuses.filter(status => status === 'belum-kuasai').length;
          const totalAnswered = cardStatuses.filter(status => status !== 'not-answered').length;
          
          // Consider a card "belum kuasai" if it's marked belum kuasai in more than 50% of attempts
          if (totalAnswered > 0 && belumKuasaiCount / totalAnswered > 0.5) {
            belumKuasaiCards.push(card.term);
          }
        });

        return belumKuasaiCards;
      },

      // Get progress for a specific card
      getCardProgress: (flashcardSetId: string, cardTerm: string) => {
        const state = get();
        const attempts = state.getAttemptHistory(flashcardSetId);
        const flashcardSet = state.currentFlashcardSet;
        
        if (!flashcardSet || flashcardSet.id !== flashcardSetId) {
          return { kuasaiCount: 0, belumKuasaiCount: 0, totalAttempts: 0, lastStatus: null };
        }

        const cardIndex = flashcardSet.cards.findIndex(card => card.term === cardTerm);
        if (cardIndex === -1) {
          return { kuasaiCount: 0, belumKuasaiCount: 0, totalAttempts: 0, lastStatus: null };
        }

        const cardStatuses = attempts.map(attempt => attempt.cardStatuses[cardIndex]).filter(Boolean);
        const kuasaiCount = cardStatuses.filter(status => status === 'kuasai').length;
        const belumKuasaiCount = cardStatuses.filter(status => status === 'belum-kuasai').length;
        const lastStatus = cardStatuses.length > 0 ? cardStatuses[cardStatuses.length - 1] : null;

        return {
          kuasaiCount,
          belumKuasaiCount,
          totalAttempts: attempts.length,
          lastStatus,
        };
      },

      // Get current session progress
      getCurrentProgress: () => {
        const state = get();
        if (!state.currentFlashcardSet) {
          return { totalCards: 0, answeredCards: 0, kuasaiCount: 0, belumKuasaiCount: 0, progressPercentage: 0 };
        }

        const totalCards = state.currentFlashcardSet.cards.length;
        const answeredCards = state.currentCardStatuses.filter(status => status !== 'not-answered').length;
        const progressPercentage = totalCards > 0 ? (answeredCards / totalCards) * 100 : 0;

        return {
          totalCards,
          answeredCards,
          kuasaiCount: state.kuasaiCount,
          belumKuasaiCount: state.belumKuasaiCount,
          progressPercentage,
        };
      },
    }),
    {
      name: 'flashcard-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        attempts: state.attempts, // Only persist attempts (renamed from sessions)
      }),
    }
  )
);