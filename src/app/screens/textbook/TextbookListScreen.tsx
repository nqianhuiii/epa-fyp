import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import BackButton from '../../../components/custom/customBackButton';
import LoadingScreenWithHeader from '../../../components/custom/loadingScreenWithHeader';
import { Badge, BadgeText } from '../../../components/ui/badge';
import { Box } from '../../../components/ui/box';
import { Card } from '../../../components/ui/card';
import { HStack } from '../../../components/ui/hstack';
import { Text } from '../../../components/ui/text';
import { VStack } from '../../../components/ui/vstack';
import { TextbookController } from '../../../hooks/useMaterialController';
import { Textbook } from '../../../types/ResourceType';

const TextbookListScreen: React.FC = () => {
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const textbookController = new TextbookController();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadTextbooks();
  }, []);

  const loadTextbooks = async () => {
    try {
      setInitialLoading(true);
      const data = await textbookController.getAllTextbooks();
      setTextbooks(data);
    } catch (error) {
      console.error('Error loading textbooks:', error);
      Alert.alert('Error', 'Failed to load textbooks. Please try again.');
    } finally {
      setInitialLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await textbookController.getAllTextbooks();
      setTextbooks(data);
    } catch (error) {
      console.error('Error refreshing textbooks:', error);
      Alert.alert('Error', 'Failed to refresh textbooks. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleTextbookPress = (textbook: Textbook) => {
    router.push(`/screens/textbook/${textbook.id}`);
  };

  const renderTextbookItem = (item: Textbook) => (
    <Card 
      key={item.id}
      className="mb-3 mx-4"
    >
      <Pressable 
        onPress={() => handleTextbookPress(item)}
        className="active:opacity-70"
      >
        <Box className="p-2">
          <HStack className="items-center">
            {/* Book Cover Placeholder */}
            <Box className="w-16 h-20 bg-blue-50 rounded-lg items-center justify-center">
              <Ionicons name="book" size={24} color="#4A90E2" />
            </Box>
            
            {/* Book Info */}
            <VStack className="flex-1 space-y-2 ml-4">
              <Text 
                className="text-base font-semibold text-gray-800 leading-tight"
                numberOfLines={2}
              >
                {item.title}
              </Text>
              {/* Download Badge */}
              <Box className="mt-3">
                <Badge 
                  variant="solid" 
                  action="success"
                  className="self-start rounded-full px-4 py-2"
                >
                  <BadgeText className="text-xs font-medium">
                    Tingkatan 1
                  </BadgeText>
                </Badge>
              </Box>
            </VStack>
            
            {/* Chevron Icon */}
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </HStack>
        </Box>
      </Pressable>
    </Card>
  );

  if (initialLoading) {
    return (
      <LoadingScreenWithHeader
        title="Buku Teks"
        message="Sedang memuatkan buku teks"
        showBackButton={true}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          headerTitle: "Buku Teks", 
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
            colors={['#4A90E2']}
            tintColor="#4A90E2"
          />
        }
      >
        {textbooks.length === 0 ? (
          <Box className="flex-1 items-center justify-center px-4">
            <Ionicons name="book" size={48} color="#D1D5DB" />
            <Text className="text-lg font-medium text-gray-600 mb-2 mt-4">
              Tiada Buku Teks
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Buku teks akan dipaparkan di sini apabila tersedia.
            </Text>
          </Box>
        ) : (
          <VStack className="space-y-0">
            {textbooks.map(renderTextbookItem)}
          </VStack>
        )}
      </ScrollView>     
    </SafeAreaView>
  );
};

export default TextbookListScreen;