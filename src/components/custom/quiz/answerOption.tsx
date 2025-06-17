// components/quiz/AnswerOption.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnswerOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect?: boolean;
  isUserAnswer?: boolean;
  showResult?: boolean;
  onSelect?: (index: number) => void;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  index,
  isSelected,
  isCorrect = false,
  isUserAnswer = false,
  showResult = false,
  onSelect
}) => {
  let bgColor = 'bg-white border-gray-200';
  let textColor = 'text-gray-700';
  
  if (showResult) {
    if (isCorrect) {
      bgColor = 'bg-green-50 border-green-300';
      textColor = 'text-green-700';
    } else if (isUserAnswer && !isCorrect) {
      bgColor = 'bg-red-50 border-red-300';
      textColor = 'text-red-700';
    }
  } else if (isSelected) {
    bgColor = 'border-blue-500 bg-blue-50';
    textColor = 'text-blue-700 font-medium';
  }

  const Component = onSelect ? TouchableOpacity : View;
  const componentProps = onSelect ? { onPress: () => onSelect(index) } : {};

  return (
    <Component
      {...componentProps}
      className={`p-4 rounded-lg border-2 ${bgColor} mb-4`}
    >
      <View className="flex-row items-center">
        <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
          isSelected && !showResult
            ? 'border-blue-500 bg-blue-500'
            : 'border-gray-300'
        }`}>
          {isSelected && !showResult ? (
            <Text className="text-white text-xs font-bold">
              {String.fromCharCode(65 + index)}
            </Text>
          ) : (
            <Text className="text-gray-400 text-xs font-bold">
              {String.fromCharCode(65 + index)}
            </Text>
          )}
        </View>
        <Text className={`flex-1 ${textColor}`}>
          {option}
        </Text>
        {showResult && isCorrect && (
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        )}
        {showResult && isUserAnswer && !isCorrect && (
          <Ionicons name="close-circle" size={20} color="#EF4444" />
        )}
      </View>
    </Component>
  );
};
