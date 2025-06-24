import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView } from 'react-native';

interface FlashcardHeaderProps {
  title: string;
  onExit: () => void;
}

export const FlashcardHeader: React.FC<FlashcardHeaderProps> = ({
  title,
  onExit,
}) => (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={onExit} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#4ade80" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      </View>
      {/* You can add progress or other controls here */}
    </View>
);
