import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { Stack, useRouter } from 'expo-router';
import BackButton from '../../../components/custom/customBackButton';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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

  const getPerformanceColors = (): [string, string] => {
    const rate = kuasaiCount / totalCards;
    if (rate >= 0.9) return ['#10B981', '#059669']; // Green gradient
    if (rate >= 0.6) return ['#3B82F6', '#1D4ED8']; // Blue gradient
    return ['#F59E0B', '#D97706']; // Orange gradient
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minit ${secs} saat`;
  };

  const masteryPercentage = Math.round((kuasaiCount / totalCards) * 100);

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header with gradient background */}
      <LinearGradient
        colors={getPerformanceColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-5 pt-12 pb-8 rounded-b-3xl"
      >
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
          <Text className="text-xl font-bold text-white text-center mb-2">
            {getPerformanceMessage()}
          </Text>
          
          {/* Mastery Percentage */}
          <View className="bg-white/20 px-6 py-3 rounded-full">
            <Text className="text-white font-bold text-lg">
              {masteryPercentage}% Dikuasai
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View className="px-5 -mt-6">
        {/* Progress Cards */}
        <View className="flex-row space-x-3 mb-6">
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
            <DetailedStatRow 
              label="Tajuk Set" 
              value={flashcardSetTitle} 
              icon="library"
              iconColor="#8B5CF6"
            />
            <DetailedStatRow 
              label="Jumlah Kad" 
              value={`${totalCards} kad`} 
              icon="layers"
              iconColor="#06B6D4"
            />
            <DetailedStatRow 
              label="Masa Dibelanjakan" 
              value={formatTime(timeSpent)} 
              icon="time"
              iconColor="#3B82F6"
            />
            <DetailedStatRow 
              label="Kadar Kejayaan" 
              value={`${masteryPercentage}%`} 
              icon="trophy"
              iconColor="#F59E0B"
            />
          </View>
        </View>

        {/* Progress Bar */}
        <View className="bg-white p-6 rounded-3xl shadow-lg mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Kemajuan Penguasaan
          </Text>
          <View className="bg-gray-200 h-4 rounded-full overflow-hidden">
            <View 
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full"
              style={{ width: `${masteryPercentage}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-sm text-gray-500">0%</Text>
            <Text className="text-sm font-semibold text-emerald-600">
              {masteryPercentage}%
            </Text>
            <Text className="text-sm text-gray-500">100%</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-4 pb-8">
          <TouchableOpacity
            className="overflow-hidden rounded-2xl shadow-lg"
            onPress={onFinish}
          >
            <LinearGradient
              colors={['#10B981', '#059669'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-5 px-6 items-center"
            >
              <View className="flex-row items-center space-x-2">
                <Ionicons name="home" size={20} color="white" />
                <Text className="text-white font-bold text-lg">
                  Kembali ke Menu Utama
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white py-5 px-6 rounded-2xl items-center shadow-lg border border-gray-200"
            onPress={onRestart}
          >
            <View className="flex-row items-center space-x-2">
              <Ionicons name="refresh" size={20} color="#6B7280" />
              <Text className="text-gray-700 font-semibold text-lg">
                Ulangi Latihan
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const ProgressCard = ({
  title,
  count,
  total,
  color,
  icon,
}: {
  title: string;
  count: number;
  total: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}) => {
  const percentage = Math.round((count / total) * 100);
  
  return (
    <View className="flex-1 bg-white p-4 rounded-2xl shadow-lg">
      <View className="items-center">
        <View 
          className="w-12 h-12 rounded-full items-center justify-center mb-2"
          style={{ backgroundColor: `${color}15` }}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text className="text-2xl font-bold text-gray-900">{count}</Text>
        <Text className="text-sm text-gray-500 mb-1">{title}</Text>
        <Text className="text-xs font-semibold" style={{ color }}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const DetailedStatRow = ({
  label,
  value,
  icon,
  iconColor,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}) => {
  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center space-x-3 flex-1">
        <View 
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text className="text-base text-gray-600 flex-1">{label}</Text>
      </View>
      <Text className="text-base font-bold text-gray-900 ml-2">{value}</Text>
    </View>
  );
};

export default FlashcardResultScreen;