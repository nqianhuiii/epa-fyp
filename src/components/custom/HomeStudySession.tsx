// components/HorizontalStudySessions.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EnhancedSessionCard from './EnhancedSessionCard';
import { StudySession } from '../../types/SessionType';
import { useStudySessionsController } from '../../hooks/useStudySessionController';
import { useRouter } from 'expo-router';

interface HorizontalStudySessionsProps {
  maxSessions?: number;
  showViewAll?: boolean;
  title?: string;
}

const { width } = Dimensions.get('window');

const HorizontalStudySessions: React.FC<HorizontalStudySessionsProps> = ({ 
  maxSessions = 5, 
  showViewAll = true,
  title = "Sesi Bulan Ini"
}) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getStudySessionsThisMonth } = useStudySessionsController();
  const router = useRouter();

  const fetchStudySessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getStudySessionsThisMonth();

      if (result.success && result.data) {
        const limitedSessions = result.data.slice(0, maxSessions);
        setSessions(limitedSessions);
      } else {
        setError(result.error || 'Failed to fetch study sessions');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudySessions();
  }, []);

  const handleViewAll = () => {
    router.push('/screens/studySessions/sessionsListScreen')
  };

  const renderSessionItem = ({ item, index }: { item: StudySession; index: number }) => (
    <EnhancedSessionCard 
      session={item} 
    />
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center py-12 px-8">
      <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons name="school-outline" size={32} color="#9CA3AF" />
      </View>
      <Text className="text-gray-500 text-center text-base font-medium mb-2">
        Tiada Sesi Tersedia
      </Text>
      <Text className="text-gray-400 text-center text-sm">
        Sesi pembelajaran akan dipaparkan di sini apabila tersedia
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View className="flex-row items-center justify-center py-12">
      <ActivityIndicator size="small" color="#4F46E5" />
      <Text className="text-gray-600 ml-3">Memuat sesi belajar...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="items-center justify-center py-12 px-8">
      <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
        <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
      </View>
      <Text className="text-red-500 text-center text-base font-medium mb-2">
        Ralat Memuat Data
      </Text>
      <Text className="text-gray-400 text-center text-sm mb-4">{error}</Text>
      <TouchableOpacity
        className="bg-blue-500 px-6 py-2 rounded-lg"
        onPress={fetchStudySessions}
      >
        <Text className="text-white font-medium">Cuba Lagi</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 mb-4">
        <View className="flex-row items-center mt-6">
          <View className="w-8 h-8 rounded-lg bg-blue-100 items-center justify-center mr-3">
            <Ionicons name="school" size={18} color="#4F46E5" />
          </View>
          <Text className="text-xl font-bold text-gray-800 ">{title}</Text>
        </View>
        {showViewAll && sessions.length > 0 && (
          <TouchableOpacity 
            onPress={handleViewAll}
            className="flex-row items-center mt-6"
          >
            <Text className="text-blue-500 font-semibold text-sm mr-1">Lihat Semua</Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {loading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : sessions.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingHorizontal: 16,
            paddingRight: 32 
          }}
          ItemSeparatorComponent={() => <View className="w-0" />}
          snapToInterval={width * 0.85 + 16} // Card width + margin
          snapToAlignment="start"
          decelerationRate="fast"
          pagingEnabled={false}
        />
      )}

    </View>
  );
};

export default HorizontalStudySessions;