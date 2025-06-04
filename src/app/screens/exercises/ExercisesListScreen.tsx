import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import BackButton from '../../../components/custom/customBackButton';
import LoadingScreenWithHeader from '../../../components/custom/loadingScreenWithHeader';
import { Box } from '../../../components/ui/box';
import { Card } from '../../../components/ui/card';
import { HStack } from '../../../components/ui/hstack';
import { Text } from '../../../components/ui/text';
import { VStack } from '../../../components/ui/vstack';
import { ExerciseController } from '../../../hooks/useMaterialController';
import { Exercise } from '../../../types/ResourceType';
import { groupByChapter, sortChapters } from '../../../utils/chapterUtils';

type ExerciseFilter = 'practice' | 'pastYear';

const ExerciseListScreen: React.FC = () => {
  const [exercise, setExercise] = useState<Exercise[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ExerciseFilter>('practice');
  const exerciseController = new ExerciseController();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadExercise();
  }, []);

  useEffect(() => {
    loadExercise();
  }, [selectedFilter]);

  const loadExercise = async () => {
    try {
      setInitialLoading(true);
      const data = await exerciseController.getAllExercise(selectedFilter);
      setExercise(data);
    } catch (error) {
      console.error('Error loading exercise:', error);
      Alert.alert('Error', 'Failed to load exercise. Please try again.');
    } finally {
      setInitialLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await exerciseController.getAllExercise(selectedFilter);
      setExercise(data);
    } catch (error) {
      console.error('Error refreshing exercise:', error);
      Alert.alert('Error', 'Failed to refresh exercise. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleExercisePress = (exercise: Exercise) => {
    router.push(`/screens/exercises/${exercise.id}`);
  };

  const handleFilterPress = (filterType: ExerciseFilter) => {
    setSelectedFilter(filterType);
  };

  const FilterButton = ({
    type,
    label,
    isSelected,
    className, 
  }: {
    type: ExerciseFilter;
    label: string;
    isSelected: boolean;
    className?: String;
  }) => (
    <Pressable onPress={() => handleFilterPress(type)} >
      <Box
        className={`px-12 py-2 rounded-xl border ${
          isSelected
            ? 'bg-emerald-400 border-emerald-400'
            : 'bg-white border-emerald-400'
        }`}
      >
        <Text
          className={`text-sm font-semibold ${
            isSelected ? 'text-white' : 'text-emerald-400'
          }`}
        >
          {label}
        </Text>
      </Box>
    </Pressable>
  );

  // Conditional grouping and sorting based on filter
  const shouldGroupByChapter = selectedFilter === 'practice';
  const groupedExercise = shouldGroupByChapter ? groupByChapter(exercise) : null;
  const sortedChapters = shouldGroupByChapter ? sortChapters(Object.keys(groupedExercise!)) : [];

  const renderExerciseItem = (item: Exercise) => (
    <Card key={item.id} className="mb-3 mx-4">
      <Pressable onPress={() => handleExercisePress(item)} className="active:opacity-70">
        <Box className="p-2">
          <HStack className="items-center">
            <Box className="w-16 h-20 bg-emerald-50 rounded-lg items-center justify-center">
                <Ionicons name="document-text" size={24} color="#10B981" />
            </Box>
            <VStack className="flex-1 space-y-2 ml-4">
              <Text
                className="text-base font-semibold text-gray-800 leading-tight"
                numberOfLines={2}
              >
                {item.title}
              </Text>
            </VStack>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </HStack>
        </Box>
      </Pressable>
    </Card>
  );

  const renderChapterSection = (chapter: string, chapterExercise: Exercise[]) => (
    <VStack key={chapter} className="mb-6">
      <Box className="mx-4 mb-3">
        <Text className="text-lg font-bold text-gray-800 mb-1">{chapter}</Text>
        <Box className="h-0.5 bg-emerald-400 rounded-full" />
      </Box>
      <VStack className="space-y-0">{chapterExercise.map(renderExerciseItem)}</VStack>
    </VStack>
  );

  const renderExerciseList = () => {
    if (exercise.length === 0) {
      return (
        <Box className="flex-1 items-center justify-center px-4">
          <Ionicons name="document-text" size={48} color="#D1D5DB" />
          <Text className="text-lg font-medium text-gray-600 mb-2 mt-4">
            Tiada Soalan
          </Text>
        </Box>
      );
    }

    if (shouldGroupByChapter) {
      // Render with chapter grouping for 'practice' filter
      return (
        <VStack className="space-y-0">
          {sortedChapters.map((chapter) =>
            renderChapterSection(chapter, groupedExercise![chapter])
          )}
        </VStack>
      );
    } else {
      // Render as simple list for 'pastYear' filter
      return (
        <VStack className="space-y-0">
          {exercise.map(renderExerciseItem)}
        </VStack>
      );
    }
  };

  if (initialLoading) {
    return (
      <LoadingScreenWithHeader
        title="Soalan"
        message="Sedang memuatkan soalan"
        showBackButton={true}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Soalan',
          headerShadowVisible: false,
          headerBackTitle: '',
          headerLeft: () => BackButton(),
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
        {/* Filter Section */}
        <HStack className="justify-between px-4 pb-6">
            <HStack space='3xl'>
                <FilterButton
                    className="px-6 py-3" 
                    type="practice"
                    label="Latih Tubi"
                    isSelected={selectedFilter === 'practice'}
                />
                <FilterButton
                    className="px-6 py-3" 
                    type="pastYear"
                    label="Soalan Peperiksaan"
                    isSelected={selectedFilter === 'pastYear'}
                />
            </HStack>
        </HStack>
        
        {renderExerciseList()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseListScreen;