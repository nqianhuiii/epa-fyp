export interface Textbook {
  id: string;
  fileName: string;
  pdfUrl: string;
  title: string;
}

// Navigation types for React Navigation
export type TextbookStackParamList = {
  TextbookList: undefined;
  TextbookViewer: {
    textbook: Textbook;
  };
};

// Component props
export interface TextbookCardProps {
  textbook: Textbook;
  onPress: (textbook: Textbook) => void;
}

export interface TextbookListProps {
  textbooks: Textbook[];
  loading?: boolean;
  onRefresh?: () => void;
  onTextbookPress: (textbook: Textbook) => void;
}

export interface Notes {
  id: string;
  fileName: string;
  pdfUrl: string;
  title: string;
  chapter: string;
}

export type NotesStackParamList = {
  NotesList: undefined;
  NotesViewer: {
    notes: Notes;
  };
};

export interface NotesCardProps {
  notes: Notes;
  onPress: (note: Notes) => void;
}

export interface NotesListProps {
  notes: Notes[];
  loading?: boolean;
  onRefresh?: () => void;
  onNotesPress: (notes: Notes) => void;
}

export type ExerciseType = 'pastYear' | 'practice';

export interface Exercise {
  id: string;
  fileName: string;
  pdfUrl: string;
  title: string;
  chapter?: string;
  type: ExerciseType
}

export type ExerciseStackParamList = {
  ExerciseList: undefined;
  ExerciseViewer: {
    exercise: Exercise;
  };
};

export interface ExerciseCardProps {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
}

export interface ExerciseListProps {
  exercise: Exercise[];
  loading?: boolean;
  onRefresh?: () => void;
  onExercisePress: (exercise: Exercise) => void;
}