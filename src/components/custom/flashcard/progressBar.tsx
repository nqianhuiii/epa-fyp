import React from 'react';
import { Text, View, Animated } from 'react-native';

interface ProgressBarProps {
  progress: number;
  currentCardIndex: number;
  totalCards: number;
}

export const ProgressBar :  React.FC<ProgressBarProps>  = ({
    progress,
    currentCardIndex,
    totalCards,
}) => (
  <View className="px-5 py-4 bg-white">
    <View className="mb-2">
       <Text className="text-sm font-medium text-gray-700">
        Kad {currentCardIndex + 1} daripada {totalCards}
      </Text>
    </View>
    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <Animated.View 
        className="h-full bg-indigo-500 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </View>

  </View>
)
