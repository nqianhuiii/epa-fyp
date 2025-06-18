import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface FlashcardComponentProps {
  card: {
    term: string;
    definition: string;
  };
  isFlipped: boolean;
  flipAnim: SharedValue<number>; 
  onFlip: () => void;
}

export const Flashcard = ({
  card,
  isFlipped,
  flipAnim,
  onFlip,
}: FlashcardComponentProps) => {
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [0, 180], Extrapolate.CLAMP);
    const opacity = interpolate(flipAnim.value, [0, 0.5, 1], [1, 0, 0]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: 'hidden',
      position: 'absolute',
      width: '100%',
      height: '100%',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [180, 360], Extrapolate.CLAMP);
    const opacity = interpolate(flipAnim.value, [0, 0.5, 1], [0, 0, 1]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: 'hidden',
      position: 'absolute',
      width: '100%',
      height: '100%',
    };
  });

  return (
    <View className="flex-1 justify-center items-center px-5">
      <View
        style={{
          width: width - 40,
          height: height * 0.4,
          position: 'relative',
        }}
      >
        {/* Front of card */}
        <Animated.View style={frontAnimatedStyle}>
        <TouchableOpacity
            onPress={onFlip}
            className="flex-1 bg-white rounded-2xl p-6 shadow-2xl"
            activeOpacity={0.95}
        >
            <View className="flex-1 justify-center items-center">
            <Text className="text-3xl font-bold text-gray-700 text-center mb-4">
                {card.term}
            </Text>
            <Text className="text-base text-gray-500 text-center">
                Tekan untuk lihat jawapan
            </Text>
            </View>
        </TouchableOpacity>
        </Animated.View>


        {/* Back of card */}
        <Animated.View style={backAnimatedStyle}>
        <TouchableOpacity
            onPress={onFlip}
            className="flex-1 bg-indigo-500 rounded-2xl p-6 shadow-2xl"
            activeOpacity={0.95}
        >
            <View className="flex-1 justify-center items-center">
            <Text className="text-xl font-semibold text-white text-center leading-8">
                {card.definition}
            </Text>
            </View>
        </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};
