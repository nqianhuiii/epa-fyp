// app/screens/quiz/taking/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Animated } from 'react-native';
import { AnswerRevealScreen } from '../../../../components/custom/quiz/answerReveal';
import { CountdownScreen } from '../../../../components/custom/quiz/countDownScreen';
import { LoadingScreen } from '../../../../components/custom/quiz/loadingScreen';
import { QuestionScreen } from '../../../../components/custom/quiz/questionScreen';
import { useQuizStore } from '../../../../store/quizStore';
import { QuizQuestion } from '../../../../types/QuizType';

export default function QuizTakingPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Zustand store
  const {
    currentQuiz,
    currentAnswers,
    startTime,
    setCurrentQuiz,
    updateAnswer,
    calculateScore,
    completeQuiz,
    clearCurrentQuiz,
  } = useQuizStore();

  // Extract the quiz object from router params
  const quiz = useMemo(() => {
    if (!params.quiz) return null;
    try {
      let quizString = params.quiz as string;
      
      // Handle case where quiz might be double-encoded
      if (quizString.startsWith('"{') || quizString.startsWith('"[')) {
        quizString = JSON.parse(quizString);
      }
      
      const parsedQuiz = JSON.parse(quizString);
      console.log('Successfully parsed quiz:', parsedQuiz.title || 'Untitled');
      return parsedQuiz;
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      console.error('Quiz param value:', params.quiz);
      return null;
    }
  }, [params.quiz]);

  // Local UI state
  const forceCountdown = params.forceCountdown === 'true';
  const [stage, setStage] = useState<'countdown' | 'question' | 'answer-reveal'>('countdown');
  const [countdown, setCountdown] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [quizInitialized, setQuizInitialized] = useState(false);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);

  // Initialize quiz in store when component mounts
  useEffect(() => {
    if (quiz && !quizInitialized) {
      // Clear any existing quiz state first
      clearCurrentQuiz();
      
      // Set the new quiz
      setCurrentQuiz(quiz);
      setQuizInitialized(true);
      
      console.log('Quiz initialized:', quiz.title);
    }
  }, [quiz, quizInitialized, setCurrentQuiz, clearCurrentQuiz]);

  // Initialize state when quiz is available
  useEffect(() => {
    if (quiz && quiz.questions && quizInitialized) {
      setTimeRemaining((quiz.timeLimit || 0) * 60);
      
      const questionList = quiz.shuffleQuestions 
        ? [...quiz.questions].sort(() => Math.random() - 0.5)
        : quiz.questions;
      setQuestions(questionList);
    }
  }, [quiz, quizInitialized]);

  // Load selected answer for current question from store
  useEffect(() => {
    if (hasStartedQuiz && currentAnswers.length > 0) {
      const savedAnswer = currentAnswers[currentQuestionIndex];
      setSelectedAnswer(savedAnswer !== undefined && savedAnswer !== -1 ? savedAnswer : null);
    }
  }, [currentQuestionIndex, currentAnswers, hasStartedQuiz]);

  // Mark quiz as started when countdown finishes
  useEffect(() => {
    if (stage === 'question' && !hasStartedQuiz) {
      setHasStartedQuiz(true);
      console.log('Quiz started!');
    }
  }, [stage, hasStartedQuiz]);

  // Add this effect to handle forced countdown
  useEffect(() => {
  if (forceCountdown && quizInitialized) {
    console.log('Forcing countdown stage for retake');
    setStage('countdown');
    setCountdown(5);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setHasStartedQuiz(false);
    
    // Reset quiz timer if there's a time limit
    if (quiz?.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
  }
  }, [forceCountdown, quizInitialized, quiz?.timeLimit]);

  // Format time utility
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle quiz completion with Zustand
  const handleComplete = useCallback((answers: number[], score: number) => {
    console.log('Quiz completed with score:', score);
    console.log('Answers:', answers);
    
    // Calculate time spent
    const timeSpent = startTime ? 
      Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;
    
    // Save to store
    completeQuiz(timeSpent);
    
    // Navigate to results page
    router.push('/screens/quiz/results');
  }, [startTime, completeQuiz, router]);

  // Handle exit

  const handleExit = useCallback(() => {
    try {
      // Clear current quiz state when exiting
      clearCurrentQuiz();
      
      // Reset local state as well
      setStage('countdown');
      setCountdown(5);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setHasStartedQuiz(false);
      setQuizInitialized(false);
      
      router.back();
    } catch (error) {
      console.error('Navigation error:', error);
    }
}, [router, clearCurrentQuiz]);

  // Handle exit with confirmation
  const handleExitWithConfirm = useCallback(() => {
    Alert.alert(
      'Keluar Kuiz',
      'Adakah anda pasti mahu keluar? Kemajuan anda akan hilang.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: handleExit }
      ]
    );
  }, [handleExit]);

  // Quiz completion handler with Zustand - only call when quiz has actually started
  const handleQuizComplete = useCallback(() => {
    if (!hasStartedQuiz) {
      console.log('Quiz completion called before quiz started - ignoring');
      return;
    }

    const finalScore = calculateScore();
    
    // Get current answers from store
    const answersToSubmit = [...currentAnswers];
    
    // Fill any remaining unanswered questions with -1
    while (answersToSubmit.length < questions.length) {
      answersToSubmit.push(-1);
    }
    
    console.log('Completing quiz with answers:', answersToSubmit);
    handleComplete(answersToSubmit, finalScore);
  }, [calculateScore, currentAnswers, questions.length, handleComplete, hasStartedQuiz]);

  // Answer selection handler
  const handleAnswerSelect = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  }, []);

  // Confirm answer handler with Zustand
  const handleConfirmAnswer = useCallback(() => {
    if (selectedAnswer === null) return;
    
    // Save answer to store
    updateAnswer(currentQuestionIndex, selectedAnswer);
    
    setStage('answer-reveal');
  }, [selectedAnswer, currentQuestionIndex, updateAnswer]);

  // Next question handler
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setStage('question');
    } else {
      handleQuizComplete();
    }
  }, [currentQuestionIndex, questions.length, handleQuizComplete]);

  // Countdown timer effect
  useEffect(() => {
    if (stage === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        // Animate countdown
        Animated.sequence([
          Animated.timing(scaleAnim, { duration: 100, toValue: 1.2, useNativeDriver: true }),
          Animated.timing(scaleAnim, { duration: 100, toValue: 1, useNativeDriver: true })
        ]).start();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && countdown === 0) {
      setStage('question');
    }
  }, [countdown, stage, scaleAnim]);

  // Quiz timer effect - only run when quiz has started
  useEffect(() => {
    if (stage === 'question' && hasStartedQuiz && (quiz?.timeLimit || 0) > 0 && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (hasStartedQuiz && timeRemaining === 0 && (quiz?.timeLimit || 0) > 0) {
      console.log('Time is up!');
      handleQuizComplete();
    }
  }, [timeRemaining, stage, quiz?.timeLimit, handleQuizComplete, hasStartedQuiz]);

  // Early return if quiz is not provided or not initialized
  if (!quiz || !quiz.questions || quiz.questions.length === 0 || !quizInitialized) {
    return <LoadingScreen />;
  }

  // Add loading state while questions are being initialized
  if (questions.length === 0) {
    return <LoadingScreen />;
  }

  // Get current question safely and check answer correctness
  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  // Render appropriate screen based on stage
  switch (stage) {
    case 'countdown':
      return (
        <CountdownScreen
          countdown={countdown}
          scaleAnim={scaleAnim}
          quizTitle={quiz.title || 'Kuiz'}
          questionCount={questions.length}
          timeLimit={quiz.timeLimit || 0}
        />
      );

    case 'question':
      if (!currentQuestion) return <LoadingScreen />;
      return (
        <QuestionScreen
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          timeRemaining={timeRemaining}
          timeLimit={quiz.timeLimit || 0}
          formatTime={formatTime}
          onAnswerSelect={handleAnswerSelect}
          onConfirmAnswer={handleConfirmAnswer}
          onExit={handleExitWithConfirm}
          quizTitle={quiz.title}
        />
      );

    case 'answer-reveal':
      if (!currentQuestion) return <LoadingScreen />;
      return (
        <AnswerRevealScreen
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          onNextQuestion={handleNextQuestion}
          onExit={handleExitWithConfirm}
          timeRemaining={timeRemaining}
          timeLimit={quiz.timeLimit || 0}
          formatTime={formatTime}
        />
      );

    default:
      return <LoadingScreen />;
  }
}