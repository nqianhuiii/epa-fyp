import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import BackButton from '../../../components/custom/customBackButton';
import LoadingScreenWithHeader from '../../../components/custom/loadingScreenWithHeader';
import { Box } from '../../../components/ui/box';
import { Text } from '../../../components/ui/text';
import { VStack } from '../../../components/ui/vstack';
import { FlashcardController } from '../../../hooks/useFlashcardController';
import { FlashcardSet } from '@/types/FlashcardType';
import FlashcardComponent from '../../../components/custom/flashcard/flashcardComponent';

const FlashcardListScreen: React.FC = () => { 
  const { flashcards, isLoading, getFlashcards } = FlashcardController();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const result = await getFlashcards();
      if (!result.success) {
        console.error('Error loading flashcards:', result.error);
        Alert.alert('Error', 'Failed to load flashcards. Please try again.');
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
      Alert.alert('Error', 'Failed to load flashcards. Please try again.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await getFlashcards();
      if (!result.success) {
        console.error('Error refreshing flashcards:', result.error);
        Alert.alert('Error', 'Failed to refresh flashcards. Please try again.');
      }
    } catch (error) {
      console.error('Error refreshing flashcards:', error);
      Alert.alert('Error', 'Failed to refresh flashcards. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

const handleFlashcardPress = (flashcard: FlashcardSet) => {
  router.replace({
    pathname: "/screens/flashcard/taking/[id]",
    params: { id: flashcard.id, flashcardSet: JSON.stringify(flashcard) }
  });
};
  if (isLoading) {
    return (
      <LoadingScreenWithHeader
        title="Kad Imbasan"
        message="Sedang memuatkan kad imbasan..."
        showBackButton={true}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Add StatusBar to ensure proper styling */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          headerTitle: "Kad Imbasan", 
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
        {flashcards.length === 0 ? (
          <Box className="flex-1 items-center justify-center px-4">
            <Box className="w-20 h-20 bg-emerald-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="help-circle-outline" size={40} color="#10B981" />
            </Box>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Tiada kad imbasan tersedia
            </Text>
            <Text className="text-sm text-gray-500 text-center leading-relaxed">
              Kad Imbasan akan dipaparkan di sini{'\n'}apabila ia tersedia untuk anda.
            </Text>
          </Box>
        ) : (
          <VStack className="space-y-0">
            {flashcards.map((flashcard) => (
              <FlashcardComponent 
                key={flashcard.id}
                flashcard={flashcard}
                onPress={handleFlashcardPress}
              />
            ))}
          </VStack>
        )}
      </ScrollView>     
    </SafeAreaView>
  );
};

export default FlashcardListScreen;