// stores/quizStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // ADD: createJSONStorage
import { Quiz, QuizAttempt } from '../types/QuizType';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuizStore {
  // Current quiz state
  currentQuiz: Quiz | null;
  currentAnswers: number[];
  currentScore: number;
  startTime: Date | null;
  
  // Quiz history
  attempts: QuizAttempt[];
  
  // Actions
  setCurrentQuiz: (quiz: Quiz) => void;
  updateAnswer: (questionIndex: number, answer: number) => void;
  calculateScore: () => number;
  completeQuiz: (timeSpent: number) => void;
  clearCurrentQuiz: () => void;
  getQuizAttempts: (quizId: string) => QuizAttempt[];
  getBestScore: (quizId: string) => number;
  getAverageScore: (quizId: string) => number;
  getTotalAttempts: (quizId: string) => number;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQuiz: null,
      currentAnswers: [],
      currentScore: 0,
      startTime: null,
      attempts: [],

      // Set current quiz and initialize
      setCurrentQuiz: (quiz: Quiz) => set({
        currentQuiz: quiz,
        currentAnswers: new Array(quiz.questions.length).fill(-1),
        currentScore: 0,
        startTime: new Date(),
      }),

      // Update answer for specific question
      updateAnswer: (questionIndex: number, answer: number) => set((state) => {
        const newAnswers = [...state.currentAnswers];
        newAnswers[questionIndex] = answer;
        return { currentAnswers: newAnswers };
      }),

      // Calculate current score
      calculateScore: () => {
        const state = get();
        if (!state.currentQuiz) return 0;
        
        let correct = 0;
        state.currentAnswers.forEach((answer, index) => {
          if (answer === state.currentQuiz!.questions[index].correctAnswer) {
            correct++;
          }
        });
        
        const score = Math.round((correct / state.currentQuiz.questions.length) * 100);
        set({ currentScore: score });
        return score;
      },

      // Complete quiz and save attempt
      completeQuiz: (timeSpent: number) => set((state) => {
        if (!state.currentQuiz) return state;

        const newAttempt: QuizAttempt = {
          id: Date.now().toString(),
          quizId: state.currentQuiz.id,
          userId: 'current-user', // Replace with actual user ID
          answers: [...state.currentAnswers],
          score: state.currentScore,
          completedAt: new Date(),
          timeSpent,
        };

        return {
          attempts: [...state.attempts, newAttempt],
        };
      }),

      // Clear current quiz state
      clearCurrentQuiz: () => set({
        currentQuiz: null,
        currentAnswers: [],
        currentScore: 0,
        startTime: null,
      }),

      // Get all attempts for a specific quiz
      getQuizAttempts: (quizId: string) => {
        return get().attempts.filter(attempt => attempt.quizId === quizId);
      },

      // Get best score for a quiz
      getBestScore: (quizId: string) => {
        const attempts = get().getQuizAttempts(quizId);
        return attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
      },

      // Get average score for a quiz
      getAverageScore: (quizId: string) => {
        const attempts = get().getQuizAttempts(quizId);
        if (attempts.length === 0) return 0;
        const sum = attempts.reduce((acc, attempt) => acc + attempt.score, 0);
        return Math.round(sum / attempts.length);
      },

      // Get total attempts for a quiz
      getTotalAttempts: (quizId: string) => {
        return get().getQuizAttempts(quizId).length;
      },
    }),
    {
      name: 'quiz-storage',
      storage: createJSONStorage(() => AsyncStorage), // ADD: This line to use AsyncStorage
      partialize: (state) => ({
        attempts: state.attempts, // Only persist attempts
      }),
    }
  )
);