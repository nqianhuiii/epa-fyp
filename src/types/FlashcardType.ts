export interface Flashcard {
  term: string;
  definition: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  createdAt: Date | string;
}

export type FlashcardStackParamList = {
  FlashcardList: undefined;
  FlashcardViewer: {
    flashcardSet: FlashcardSet;
  };
};

export interface FlashcardProps {
  flashcard: FlashcardSet;
  onPress: (flashcardSet: FlashcardSet) => void;
}

export interface FlashcardAttempt {
  id: string;
  flashcardSetId: string;
  userId: string;
  completedAt: Date | string;
  timeSpent: number;
  kuasaiCount: number;
  belumKuasaiCount: number;
  cardStatuses: ('kuasai' | 'belum-kuasai' | 'not-answered')[];
}

