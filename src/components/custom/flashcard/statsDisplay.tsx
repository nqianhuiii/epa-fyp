import React from 'react';
import { View, Text } from 'react-native';

interface StatsDisplayProps {
  kuasaiCount: number;
  belumKuasaiCount: number;
}

export const StatsDisplay = ({ 
  kuasaiCount, 
  belumKuasaiCount 
}: StatsDisplayProps) => (
  <View className="flex-row justify-center px-5 py-4 gap-8">
    <View className="items-center">
      <Text className="text-2xl font-bold text-red-500">
        {belumKuasaiCount}
      </Text>
      <Text className="text-xs text-gray-500">Belum Kuasai</Text>
    </View>
    <View className="items-center">
      <Text className="text-2xl font-bold text-green-500">
        {kuasaiCount}
      </Text>
      <Text className="text-xs text-gray-500">Kuasai</Text>
    </View>
  </View>
);
