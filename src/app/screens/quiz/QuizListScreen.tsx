import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import BackButton from '../../../components/custom/customBackButton';
import LoadingScreenWithHeader from '../../../components/custom/loadingScreenWithHeader';
import QuizCard from '../../../components/custom/quizCard';
import { Box } from '../../../components/ui/box';
import { Text } from '../../../components/ui/text';
import { VStack } from '../../../components/ui/vstack';
import { QuizController } from '../../../hooks/useQuizController';
import { Quiz } from '../../../types/QuizType';

const QuizListScreen: React.FC = () => {
  const { quizzes, isLoading, getQuizzes } = QuizController();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const result = await getQuizzes();
      if (!result.success) {
        console.error('Error loading quizzes:', result.error);
        Alert.alert('Error', 'Failed to load quizzes. Please try again.');
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
      Alert.alert('Error', 'Failed to load quizzes. Please try again.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await getQuizzes();
      if (!result.success) {
        console.error('Error refreshing quizzes:', result.error);
        Alert.alert('Error', 'Failed to refresh quizzes. Please try again.');
      }
    } catch (error) {
      console.error('Error refreshing quizzes:', error);
      Alert.alert('Error', 'Failed to refresh quizzes. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

const handleQuizPress = (quiz: Quiz) => {
  router.push({
    pathname: "/screens/quiz/taking/[id]",
    params: { id: quiz.id, quiz: JSON.stringify(quiz) }
  });
};
  if (isLoading) {
    return (
      <LoadingScreenWithHeader
        title="Kuiz"
        message="Sedang memuatkan kuiz..."
        showBackButton={true}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-whote">
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          headerTitle: "Kuiz", 
          headerShadowVisible: false,
          headerBackTitle: '',
          headerLeft: () => BackButton()
        }}
      /> 
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#10B981']}
            tintColor="#10B981"
          />
        }
      >
        {quizzes.length === 0 ? (
          <Box className="flex-1 items-center justify-center px-4">
            <Box className="w-20 h-20 bg-emerald-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="help-circle-outline" size={40} color="#10B981" />
            </Box>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              No Quizzes Yet
            </Text>
            <Text className="text-sm text-gray-500 text-center leading-relaxed">
              Quizzes will appear here when they{'\n'}become available for you to take.
            </Text>
          </Box>
        ) : (
          <VStack className="space-y-0">
            {quizzes.map((quiz) => (
              <QuizCard 
                key={quiz.id}
                quiz={quiz}
                onPress={handleQuizPress}
              />
            ))}
          </VStack>
        )}
      </ScrollView>     
    </SafeAreaView>
  );
};

export default QuizListScreen;