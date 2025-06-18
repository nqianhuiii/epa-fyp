import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView } from 'react-native';

interface FlashcardHeaderProps {
  title: string;
  onExit: () => void;
}

// export const FlashcardHeader = ({ 
//   title, 
//   currentCardIndex, 
//   totalCards, 
//   onExit 
// }: FlashcardHeaderProps) => (
//   <View className="flex-row justify-between items-center px-5 py-4 bg-white shadow-md">
//     <TouchableOpacity onPress={onExit} className="p-2">
//       <Ionicons name="close" size={24} color="#4ade80" />
//     </TouchableOpacity>
    
//     <View className="flex-1 items-center">
//       <Text className="text-lg font-semibold text-gray-700 mb-1">
//         {title}
//       </Text>
//       <Text className="text-sm text-gray-500">
//         {currentCardIndex + 1} daripada {totalCards}
//       </Text>
//     </View>
    
//     <View className="w-10" />
//   </View>
// );
export const FlashcardHeader: React.FC<FlashcardHeaderProps> = ({
  title,
  onExit,
}) => (
  <SafeAreaView className=" bg-white"> 
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={onExit} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#4ade80" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      </View>
      {/* You can add progress or other controls here */}
    </View>
  </SafeAreaView>
);
