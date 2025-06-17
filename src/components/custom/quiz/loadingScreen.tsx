// components/quiz/LoadingScreen.tsx
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export const LoadingScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-500 to-purple-600">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-xl font-medium">
          Memuat kuiz...
        </Text>
      </View>
    </SafeAreaView>
  );
};