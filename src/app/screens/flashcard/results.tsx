import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { Stack, useRouter } from 'expo-router';
import BackButton from '../../../components/custom/customBackButton';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressCard } from '../../../components/custom/flashcard/progressCard';
import { DetailedStatsRow } from '../../../components/custom/flashcard/detailedStatsRow';

interface FlashcardResultScreenProps {
  flashcardSetTitle: string;
  totalCards: number;
  kuasaiCount: number;
  belumKuasaiCount: number;
  timeSpent: number; // in seconds
  onFinish: () => void;
  onRestart: () => void;
}

const FlashcardResultScreen: React.FC<FlashcardResultScreenProps> = ({
  flashcardSetTitle,
  totalCards,
  kuasaiCount,
  belumKuasaiCount,
  timeSpent,
  onFinish,
  onRestart,
}) => {
  const router = useRouter();

  const getLottieAnimation = () => {
    const masteryRate = kuasaiCount / totalCards;
    if (masteryRate >= 0.9) {
      return require('../../../../assets/animation/celebrate.json');
    } else if (masteryRate >= 0.6) {
      return require('../../../../assets/animation/good-job.json');
    } else {
      return require('../../../../assets/animation/try-again.json');
    }
  };

  const getPerformanceMessage = () => {
    const rate = kuasaiCount / totalCards;
    if (rate >= 0.9) return 'Hebat! Anda telah menguasai hampir semua kad.';
    if (rate >= 0.6) return 'Bagus! Teruskan usaha untuk lebih penguasaan.';
    return 'Teruskan berlatih! Jangan putus asa.';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minit ${secs} saat`;
  };

  const masteryPercentage = Math.round((kuasaiCount / totalCards) * 100);

  return (
    <View className="flex-1 bg-white">
        <View className="items-center">
          {/* Lottie Animation */}
          <View className="w-32 h-32 mb-4">
            <LottieView
              source={getLottieAnimation()}
              autoPlay
              loop
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          
          {/* Performance Message */}
          <Text className="text-xl font-bold text-black text-center mb-2 px-4">
            {getPerformanceMessage()}
          </Text>
          
        </View>

      <View className="px-5 mt-6">
        {/* Progress Cards */}
        <View className="flex-row gap-3 mb-6">
          <ProgressCard
            title="Kuasai"
            count={kuasaiCount}
            total={totalCards}
            color="#10B981"
            icon="checkmark-circle"
          />
          <ProgressCard
            title="Belum"
            count={belumKuasaiCount}
            total={totalCards}
            color="#EF4444"
            icon="close-circle"
          />
        </View>

        {/* Detailed Stats Section */}
        <View className="bg-white p-6 rounded-3xl shadow-lg mb-6 border border-gray-100">
          <Text className="text-xl font-bold text-gray-900 mb-6 text-center">
            Ringkasan Latihan
          </Text>

          <View className="space-y-5">
            <DetailedStatsRow 
              label="Tajuk Set" 
              value={flashcardSetTitle} 
              icon="library"
              iconColor="#8B5CF6"
            />
            <DetailedStatsRow 
              label="Jumlah Kad" 
              value={`${totalCards} kad`} 
              icon="layers"
              iconColor="#06B6D4"
            />
            <DetailedStatsRow 
              label="Masa Dibelanjakan" 
              value={formatTime(timeSpent)} 
              icon="time"
              iconColor="#3B82F6"
            />
            <DetailedStatsRow 
              label="Kadar Kejayaan" 
              value={`${masteryPercentage}%`} 
              icon="trophy"
              iconColor="#F59E0B"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-4 pb-8">
          <Pressable
            onPress={onFinish}
            className="bg-emerald-400 rounded-2xl p-4 items-center"
          >
            <Text className="text-white font-bold text-lg">
              Kembali ke Menu Utama
            </Text>
          </Pressable>

          <Pressable
            onPress={onRestart}
            className="bg-white rounded-2xl p-4 items-center mt-3 border border-emerald-500"
          >
            <Text className="text-emerald-500 font-bold text-lg">
              Ulang Latihan
            </Text>
          </Pressable>

          {/* <Pressable
            onPress={onRestart}
            className="bg-gray-100 rounded-2xl items-center border border-gray-200 mt-4"
          >
            <View className="flex-row items-center space-x-2">
              <Text className="text-gray-700 font-semibold text-lg">
                Ulangi Latihan
              </Text>
            </View>
          </Pressable> */}
        </View>
      </View>
    </View>
  );
};

export default FlashcardResultScreen;