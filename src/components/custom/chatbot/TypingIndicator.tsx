import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

export const TypingIndicator: React.FC = () => {
  const opacity1 = useRef(new Animated.Value(0.3)).current;
  const opacity2 = useRef(new Animated.Value(0.3)).current;
  const opacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity1, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity2, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity3, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ]).start(() => animate());
    };

    animate();
  }, []);

  return (
    <View className="flex-row justify-start mb-4">
      <View className="w-8 h-8 bg-emerald-400 rounded-full mr-2 items-center justify-center">
        <Text className="text-white text-xs font-bold">🤖</Text>
      </View>
      <View className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
        <View className="flex-row items-center">
          <Animated.View 
            className="w-2 h-2 bg-gray-400 rounded-full mr-1"
            style={{ opacity: opacity1 }}
          />
          <Animated.View 
            className="w-2 h-2 bg-gray-400 rounded-full mr-1"
            style={{ opacity: opacity2 }}
          />
          <Animated.View 
            className="w-2 h-2 bg-gray-400 rounded-full"
            style={{ opacity: opacity3 }}
          />
        </View>
      </View>
    </View>
  );
};