import { Stack } from 'expo-router';
import React from 'react';
import { Animated, SafeAreaView, Text, View } from 'react-native';
import BackButton from '../customBackButton';

interface CountdownScreenProps {
  countdown: number;
  scaleAnim: Animated.Value;
  quizTitle: string;
  questionCount: number;
  timeLimit: number;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({
  countdown,
  scaleAnim,
  quizTitle,
  questionCount,
  timeLimit
}) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ 
            headerShown: true, 
            headerTitle: "Memuatkan Kuiz", 
            headerShadowVisible: false,
            headerBackTitle: '',
            headerLeft: () => BackButton()}}
        />
        <View className="flex-1 items-center justify-center px-6">
                {/* Top Section */}
                <View className="items-center mb-12">
                <Text className="text-emerald-400 text-2xl font-bold mb-2">
                    {quizTitle || 'Kuiz'}
                </Text>
                <Text className="text-gray-600 text-base text-center">
                    Kuiz akan bermula dalam
                </Text>
                </View>

                {/* Countdown Circle */}
                <View className="items-center mb-12">
                <Animated.View 
                    style={{ transform: [{ scale: scaleAnim }] }}
                    className="w-40 h-40 bg-white rounded-full items-center justify-center shadow-lg shadow-blue-300 border-4 border-blue-300"
                >
                    <Text className="text-6xl font-bold text-blue-500">
                    {countdown}
                    </Text>
                </Animated.View>

                </View>

                {/* Bottom Info - Numbers beside labels */}
                <View className="flex-row space-x-4 gap-4">
                {/* Questions Card */}
                <View className="flex-1 items-start bg-emerald-50 px-6 py-5 rounded-2xl">
                    <View className="flex-row items-center mb-2">
                    <View className="w-6 h-6 bg-emerald-500 rounded-full items-center justify-center mr-2">
                        <Text className="text-white text-xs font-bold">?</Text>
                    </View>
                    <Text className="text-gray-600 text-base">Soalan</Text>
                    </View>
                    <Text className="text-emerald-500 text-3xl font-bold ml-8">
                    {questionCount}
                    </Text>
                </View>
                
                {/* Time Card */}
                <View className="flex-1 items-start bg-blue-50 px-6 py-5 rounded-2xl">
                    <View className="flex-row items-center mb-2">
                    <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-2">
                        <Text className="text-white text-xs font-bold">⏰</Text>
                    </View>
                    <Text className="text-gray-600 text-base">Minit</Text>
                    </View>
                    <Text className="text-blue-500 text-3xl font-bold ml-8">
                    {timeLimit || 0}
                    </Text>
                </View>
                </View>
                {/* Loading dots animation */}
                <View className="flex-row items-center space-x-2 mt-8">
                <View className="w-2 h-2 mr-1 bg-emerald-500 rounded-full animate-pulse" />
                <View className="w-2 h-2 mr-1 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <View className="w-2 h-2 mr-1 bg-emerald-200 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </View>
        </View>
    </SafeAreaView>
  );
};