// components/EnhancedSessionCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudySession } from '../../types/SessionType';
import { LinearGradient } from 'expo-linear-gradient';

interface EnhancedSessionCardProps {
  session: StudySession;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9; // Slightly wider for better content distribution

const EnhancedSessionCard: React.FC<EnhancedSessionCardProps> = ({ session, onPress }) => {


  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hari Ini';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Esok';
    } else {
      return date.toLocaleDateString('ms-MY', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Function to format time
  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('ms-MY', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

    const handleMeetingPress = async () => {
      if (session.meetingLink) {
        const supported = await Linking.canOpenURL(session.meetingLink);
        if (supported) {
          await Linking.openURL(session.meetingLink);
        } else {
          Alert.alert('Error', 'Cannot open meeting link');
        }
      }
    };



  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      style={{ width: CARD_WIDTH }}
      className="mr-4 mb-2"
    >
      <View className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Simplified Header */}
        <View className="px-6 py-5">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-gray-900 font-bold text-xl mb-1" numberOfLines={1}>
                {session.title}
              </Text>
              <Text className="text-gray-500 text-sm" numberOfLines={1}>
                {session.description}
              </Text>
            </View>
          </View>

          {/* Tutor Info - With Image Support */}
          <View className="flex-row items-center mb-6">
            {session.tutorImage ? (
              <Image
                source={{ uri: session.tutorImage }}
                className="w-12 h-12 rounded-full mr-4"
                style={{ borderWidth: 2, borderColor: '#10B981' }}
              />
            ) : (
              <LinearGradient
                colors={['#10B981', '#059669']}
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
              >
                <Text className="text-white font-bold text-lg">
                  {session.teacherName ? session.teacherName.charAt(0).toUpperCase() : 'T'}
                </Text>
              </LinearGradient>
            )}
            <View className="flex-1">
              <Text className="text-gray-400 text-xs uppercase tracking-wide">Tutor</Text>
              <Text className="text-gray-800 font-semibold text-base mt-1">
                {session.teacherName || 'Cikgu Farah'}
              </Text>
            </View>
          </View>

          {/* Date and Time - Cleaner Layout */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1 mr-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-purple-50 items-center justify-center mr-3">
                  <Ionicons name="calendar" size={18} color="#8B5CF6" />
                </View>
                <View>
                  <Text className="text-gray-400 text-xs uppercase tracking-wide">Tarikh</Text>
                  <Text className="text-gray-800 font-semibold text-base">
                    {session.date}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3">
                  <Ionicons name="time" size={18} color="#F97316" />
                </View>
                <View>
                  <Text className="text-gray-400 text-xs uppercase tracking-wide">Masa</Text>
                  <Text className="text-gray-800 font-semibold text-base">
                    {session.time}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Button - Rectangle Shape */}
        {session.meetingLink && (
          <TouchableOpacity
            onPress={handleMeetingPress}
            activeOpacity={0.8}
            className="bg-emerald-400 flex-row items-center justify-center py-3 px-6 rounded-xl"
          >
            <Ionicons 
              name="videocam"
              size={18} 
              color="white" 
              style={{ marginRight: 8 }} 
            />
            <Text className="text-white font-semibold text-sm">
              Serta Sesi
            </Text>
            </TouchableOpacity>
            )}
        </View>

        {/* Subtle Bottom Accent */}
        <LinearGradient
          colors={['#8B5CF6', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-1"
        />
      </View>
    </TouchableOpacity>
  );
};

export default EnhancedSessionCard;