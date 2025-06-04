// screens/SessionsListScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudySessionsController } from '../../../hooks/useStudySessionController';
import SessionCard from '../../../components/custom/sessionCard';
import { StudySession } from '../../../types/SessionType'; 
import { Stack } from 'expo-router';
import BackButton from '../../../components/custom/customBackButton';

const SessionsListScreen: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { getStudySessions } = useStudySessionsController();

  const fetchStudySessions = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);
      const result = await getStudySessions();

      if (result.success && result.data) {
        setSessions(result.data);
      } else {
        setError(result.error || 'Failed to fetch study sessions');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudySessions(true);
  };

  useEffect(() => {
    fetchStudySessions();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-600 mt-2">Sedang memuatkan sesi belajar...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-red-500 text-center mt-2 mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-emerald-500 px-6 py-3 rounded-lg"
            onPress={() => fetchStudySessions()}
          >
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (sessions.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="school" size={48} color="#9CA3AF" />
          <Text className="text-gray-500 text-center mt-2 text-lg">
            Tiada sesi pembelajaran tersedia
          </Text>
          <Text className="text-gray-400 text-center mt-1">
            Sila semak semula kemudian untuk sesi yang akan datang
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#10B981']}
            tintColor="#10B981"
          />
        }
      >
        <View className="pt-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          headerTitle: "Sesi Belajar", 
          headerShadowVisible: false,
          headerBackTitle: '',
          headerLeft: () => BackButton()
        }}
      /> 
      {renderContent()}
    </SafeAreaView>
  );
};

export default SessionsListScreen;
