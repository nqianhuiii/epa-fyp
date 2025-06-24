import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ChatHeaderProps {
  onClearChat: () => void;
  onSettings?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat, onSettings }) => {
  return (
    <View className="bg-emerald-400 px-4 py-3 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
          <Text className="text-emerald-400 text-lg font-bold">🤖</Text>
        </View>
        <View>
          <Text className="text-white font-bold text-lg">E-bot</Text>
          <Text className="text-emerald-100 text-sm">Asas Sains Komputer T1</Text>
        </View>
      </View>
      
      <View className="flex-row">
        {onSettings && (
          <Pressable onPress={onSettings} className="mr-3">
            <Text className="text-white text-lg">⚙️</Text>
          </Pressable>
        )}
        <Pressable onPress={onClearChat}>
          <Text className="text-white text-lg">🗑️</Text>
        </Pressable>
      </View>
    </View>
  );
};