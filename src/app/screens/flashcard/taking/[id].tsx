// app/screens/flashcard/taking/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, Text } from 'react-native';
import { FlashcardScreen } from '../../../../components/custom/flashcard/flashcardScreen';
// import { FlashcardResultScreen } from '../../../../components/custom/flashcard/flashcardResultScreen';
import { useFlashcardStore } from '../../../../store/flashcardStore';
import { FlashcardSet } from '../../../../types/FlashcardType';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import FlashcardResultScreen from '../results';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../../../components/custom/customBackButton';

export default function FlashcardTakingPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Zustand store
  const {
    currentFlashcardSet,
    currentCardStatuses,
    currentCardIndex,
    sessionStartTime,
    kuasaiCount,
    belumKuasaiCount,
    setCurrentFlashcardSet,
    markCard,
    nextCard,
    completeAttempt,
    clearCurrentSession,
  } = useFlashcardStore();

  // Extract the flashcard set from router params
  const flashcardSet = useMemo(() => {
    if (!params.flashcardSet) return null;
    try {
      let flashcardString = params.flashcardSet as string;
      
      // Handle case where flashcard might be double-encoded
      if (flashcardString.startsWith('"{') || flashcardString.startsWith('"[')) {
        flashcardString = JSON.parse(flashcardString);
      }
      
      const parsedFlashcardSet = JSON.parse(flashcardString);
      console.log('Successfully parsed flashcard set:', parsedFlashcardSet.title || 'Untitled');
      return parsedFlashcardSet;
    } catch (error) {
      console.error('Error parsing flashcard data:', error);
      console.error('Flashcard param value:', params.flashcardSet);
      return null;
    }
  }, [params.flashcardSet]);

  // Local UI state
  const [stage, setStage] = useState<'flashcard' | 'results'>('flashcard');
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardInitialized, setFlashcardInitialized] = useState(false);
  const flipAnim = useSharedValue(0);
 const navigation = useNavigation();

  useLayoutEffect(() => {
    if (stage === 'results') {
      navigation.setOptions({
        headerShown: true,
        headerTitle: 'Keputusan Kad Imbasan',
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerLeft: () => <BackButton />,
      });
    } else {
      navigation.setOptions({ headerShown: false });
    }
  }, [stage, navigation]);
  
  // Initialize flashcard set in store when component mounts
  useEffect(() => {
    if (flashcardSet && !flashcardInitialized) {
      // Clear any existing session state first
      clearCurrentSession();
      
      // Set the new flashcard set
      setCurrentFlashcardSet(flashcardSet);
      setFlashcardInitialized(true);
      
      console.log('Flashcard session initialized:', flashcardSet.title);
    }
  }, [flashcardSet, flashcardInitialized, setCurrentFlashcardSet, clearCurrentSession]);

  // Handle card flip animation
  const handleFlip = useCallback(() => {

    flipAnim.value = withTiming(isFlipped ? 0 : 1, { duration: 400 });
    setIsFlipped(prev => !prev);  
}, 
  [isFlipped, flipAnim]);

  // Handle marking card as kuasai
  const handleMarkKuasai = useCallback(() => {
    markCard('kuasai');  // Mark as 'kuasai'

    const hasMoreCards = nextCard();  // Move to next card

    if (hasMoreCards) {
        setIsFlipped(false);
        flipAnim.value = 0;
    } else {
        handleCompleteSession();
    }
}, [markCard, nextCard, flipAnim]);

  // Handle marking card as belum kuasai
  const handleMarkBelumKuasai = useCallback(() => {
    markCard('belum-kuasai');

    const hasMoreCards = nextCard();

    if (hasMoreCards) {
        setIsFlipped(false);
        flipAnim.value = 0;
    } else {
        handleCompleteSession();
    }
  }, [markCard, nextCard, flipAnim]);



//   // Handle next card
//   const handleNextCard = useCallback(() => {
//     const hasMoreCards = nextCard();
    
//     if (hasMoreCards) {
//       // Reset flip state for next card
//       setIsFlipped(false);
//       flipAnim.value = 0;
//     } else {
//       // No more cards, complete session
//       handleCompleteSession();
//     }
//   }, [nextCard, flipAnim]);

  // Handle session completion
  const handleCompleteSession = useCallback(() => {
    const timeSpent = sessionStartTime ? 
      Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000) : 0;
    
    // Save session to store
    completeAttempt(timeSpent);
    
    // Show results
    setStage('results');
  }, [sessionStartTime, completeAttempt]);

  // Handle exit with confirmation
  const handleExitWithConfirm = useCallback(() => {
    Alert.alert(
      'Keluar Flashcard',
      'Adakah anda pasti mahu keluar? Kemajuan anda akan hilang.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: handleExit }
      ]
    );
  }, []);

  // Handle exit
  const handleExit = useCallback(() => {
    try {
      // Clear current session state when exiting
      clearCurrentSession();
      
      // Reset local state
      setStage('flashcard');
      setIsFlipped(false);
      setFlashcardInitialized(false);
      flipAnim.value = 0;
      
      router.back();
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [router, clearCurrentSession, flipAnim]);

  // Handle finish from results screen
  const handleFinish = useCallback(() => {
    clearCurrentSession();
    router.back();
  }, [clearCurrentSession, router]);

  // Handle restart from results screen
  const handleRestart = useCallback(() => {
    if (flashcardSet) {
      // Reset everything for a new session
      setCurrentFlashcardSet(flashcardSet);
      setStage('flashcard');
      setIsFlipped(false);
      flipAnim.value = 0;
    }
  }, [flashcardSet, setCurrentFlashcardSet, flipAnim]);

  // Get current card safely
  const currentCard = currentFlashcardSet?.cards[currentCardIndex];
  const currentCardStatus = currentCardStatuses[currentCardIndex];

  // Early return if flashcard set is not available
  if (!flashcardSet) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading flashcard set</Text>
      </View>
    );
  }

  // Calculate progress
  const progress = ((currentCardIndex + 1) / flashcardSet.cards.length) * 100;

  // Render appropriate screen based on stage
  switch (stage) {
    case 'flashcard':
      // Check if currentCard exists before rendering FlashcardScreen
      if (!currentCard) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading flashcard...</Text>
          </View>
        );
      }

      return (
        <FlashcardScreen
          card={currentCard}
          currentCardIndex={currentCardIndex}
          totalCards={flashcardSet.cards.length}
          progress={progress}
          isFlipped={isFlipped}
          flipAnim={flipAnim}
          currentCardStatus={currentCardStatus}
          kuasaiCount={kuasaiCount}
          belumKuasaiCount={belumKuasaiCount}
          flashcardSetTitle={flashcardSet.title}
          onFlip={handleFlip}
          onMarkKuasai={handleMarkKuasai}
          onMarkBelumKuasai={handleMarkBelumKuasai}
        //   onNextCard={handleNextCard}
          onExit={handleExitWithConfirm}
        />
      );

    case 'results':
      return (
        <FlashcardResultScreen
          flashcardSetTitle={flashcardSet.title}
          totalCards={flashcardSet.cards.length}
          kuasaiCount={kuasaiCount}
          belumKuasaiCount={belumKuasaiCount}
          timeSpent={sessionStartTime ? 
            Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000) : 0}
          onFinish={handleFinish}
          onRestart={handleRestart}
        />
      );

    default:
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      );
  }
}