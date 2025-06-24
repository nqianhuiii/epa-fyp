import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { FlashcardHeader } from './flashcardHeader';
import { Flashcard } from './flashcard';
import { ProgressBar } from './progressBar';
import { StatsDisplay } from './statsDisplay';
import { ActionButtons } from './actionButton';
import { SharedValue } from 'react-native-reanimated';

interface FlashcardScreenProps {
  card: {
    term: string;
    definition: string;
  };
  currentCardIndex: number;
  totalCards: number;
  progress: number;
  isFlipped: boolean;
  flipAnim: SharedValue<number>;
  currentCardStatus: 'kuasai' | 'belum-kuasai' | 'not-answered';
  kuasaiCount: number;
  belumKuasaiCount: number;
  flashcardSetTitle: string;
  onFlip: () => void;
  onMarkKuasai: () => void;
  onMarkBelumKuasai: () => void;
  // onResetCard: () => void;
//   onNextCard: () => void;
  onExit: () => void;
}

export function FlashcardScreen({
  card,
  currentCardIndex,
  totalCards,
  progress,
  isFlipped,
  flipAnim,
  currentCardStatus,
  kuasaiCount,
  belumKuasaiCount,
  flashcardSetTitle,
  onFlip,
  onMarkKuasai,
  onMarkBelumKuasai,
  // onResetCard,
//   onNextCard,
  onExit,
}: FlashcardScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
    
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <FlashcardHeader
        title={flashcardSetTitle}
        onExit={onExit}
      />

      <ProgressBar
        progress={progress} 
        currentCardIndex={currentCardIndex}
        totalCards={totalCards}
       />

      <StatsDisplay 
        kuasaiCount={kuasaiCount}
        belumKuasaiCount={belumKuasaiCount}
      />

      <Flashcard
        card={card}
        isFlipped={isFlipped}
        flipAnim={flipAnim}
        onFlip={onFlip}
      />

      
      {/* <Instructions isVisible={isFlipped} /> */}
      
      <ActionButtons
        isFlipped={isFlipped}
        currentCardIndex={currentCardIndex}
        totalCards={totalCards}
        currentCardStatus={currentCardStatus}
        onMarkKuasai={onMarkKuasai}
        onMarkBelumKuasai={onMarkBelumKuasai}
        // onResetCard={onResetCard}
        // onNextCard={onNextCard}
      />
    </SafeAreaView>
  );
}