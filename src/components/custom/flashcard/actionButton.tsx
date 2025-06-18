import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ActionButtonsProps {
  isFlipped: boolean;
  currentCardIndex: number;
  totalCards: number;
  currentCardStatus: 'kuasai' | 'belum-kuasai' | 'not-answered';
  onMarkKuasai: () => void;
  onMarkBelumKuasai: () => void;
  onResetCard: () => void;
//   onNextCard: () => void;
}

export const ActionButtons = ({ 
  isFlipped, 
  currentCardIndex, 
  totalCards, 
  currentCardStatus,
  onMarkKuasai, 
  onMarkBelumKuasai, 
  onResetCard, 
//   onNextCard 
}: ActionButtonsProps) => (
  isFlipped && (
    <View className="px-5 pb-8 gap-4">
      {/* Mastery Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onMarkBelumKuasai}
          className="flex-1 bg-red-400 py-4 rounded-xl items-center "
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            Belum Kuasai
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={onMarkKuasai}
          className="flex-1 bg-emerald-400 py-4 rounded-xl items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            Kuasai
          </Text>
        </TouchableOpacity>
      </View>

      {/* Next Button */}
      {/* <TouchableOpacity
        onPress={onNextCard}
        className="bg-blue-500 py-4 rounded-xl items-center"
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-semibold">
          {currentCardIndex === totalCards - 1 ? 'Selesai' : 'Kad Seterusnya'}
        </Text>
      </TouchableOpacity> */}
    </View>
  )
);