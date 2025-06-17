export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// quiz set
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number; // in minutes
  passingScore: number;
  shuffleQuestions: boolean;
  createdAt: Date | string; 
}

// Navigation stack param list for quiz screens
export type QuizStackParamList = {
  QuizList: undefined;           
  QuizViewer: {                  // Preview/details screen
    quiz: Quiz;
  };
  QuizTaking: {                  // Active quiz taking screen
    quiz: Quiz;
  };
  QuizResults: {                 // Results screen 
    quiz: Quiz;
    userAnswers: number[];
    score: number;
  };
};

export interface QuizCardProps {
  quiz: Quiz;
  onPress: (quiz: Quiz) => void;
}

export interface QuizListProps {
  quizzes: Quiz[];
  loading?: boolean;
  onRefresh?: () => void;
  onQuizPress: (quiz: Quiz) => void;
}

export interface QuizTakingProps {
  quiz: Quiz;
  onComplete: (answers: number[], score: number) => void;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: number[];
  score: number;
  completedAt: Date | string;
  timeSpent: number; // in seconds
}