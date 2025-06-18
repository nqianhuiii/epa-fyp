import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { FlashcardProps } from '../../../types/FlashcardType';
import { Card } from '../../ui/card';

const FlashcardComponent: React.FC<FlashcardProps> = ({ flashcard, onPress }) => {
  const cardCount = flashcard.cards.length;
  const createdDate = new Date(flashcard.createdAt);
  const isNew = (Date.now() - createdDate.getTime()) < (7 * 24 * 60 * 60 * 1000); // Less than 7 days old

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Semalam';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu lalu`;
    return date.toLocaleDateString('ms-MY');
  };

  const getDifficultyByCardCount = (count: number) => {
    if (count <= 10) return { color: 'bg-green-100 text-green-700', label: 'Mudah', icon: 'leaf' };
    if (count <= 25) return { color: 'bg-yellow-100 text-yellow-700', label: 'Sederhana', icon: 'flame' };
    return { color: 'bg-red-100 text-red-700', label: 'Mencabar', icon: 'flash' };
  };

  const difficulty = getDifficultyByCardCount(cardCount);

  return (
    <TouchableOpacity onPress={() => onPress(flashcard)} activeOpacity={0.7}>
      <Card className="mb-4 mx-4 bg-white border-t-8 border-indigo-500 rounded-xl shadow-md">
        <View className="p-4">
          {/* Header with Title and New Badge */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center mb-1">
                <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={2}>
                  {flashcard.title}
                </Text>
                {isNew && (
                  <View className="bg-blue-500 px-2 py-1 rounded-full ml-2">
                    <Text className="text-xs font-semibold text-white">BARU</Text>
                  </View>
                )}
              </View>
              <Text className="text-xs text-gray-500">
                Dicipta {formatDate(createdDate)}
              </Text>
            </View>
          </View>

          {/* Description */}
          {flashcard.description && (
            <Text className="text-sm text-gray-600 leading-5 mb-4" numberOfLines={3}>
              {flashcard.description}
            </Text>
          )}

          {/* Stats Row */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center mb-3">
                <View className="flex-row items-center mr-6">
                <Ionicons name="layers" size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-1.5">
                    {cardCount} kad
                </Text>
                </View>
                
                <View className="flex-row items-center">
                <Ionicons name="time" size={16} color="#6B7280" />
                <Text className="text-sm font-medium text-gray-700 ml-2">
                    ~{Math.ceil(cardCount * 0.3)} min
                </Text>
                </View>
            </View>        
        

            {/* Difficulty */}
            {/* <View className={`px-3 py-2 rounded-lg ${difficulty.color} flex-row items-center`}>
              <Ionicons name={difficulty.icon as any} size={12} color="currentColor" />
              <Text className="text-xs font-semibold ml-1">
                {difficulty.label}
              </Text>
            </View> */}
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            {/* Primary Start Button */}
            <TouchableOpacity
              className="flex-1 bg-emerald-500 flex-row items-center justify-center py-3 px-4 rounded-xl shadow-sm"
              onPress={() => onPress(flashcard)}
              disabled={cardCount === 0}
            >
              <Ionicons name="play" size={18} color="white" />
              <Text className="text-white text-sm font-semibold ml-2">
                {cardCount === 0 ? 'Tiada Kad' : 'Mula Belajar'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default FlashcardComponent;