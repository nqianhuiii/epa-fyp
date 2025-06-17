// components/SessionCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { Alert, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/ui/card';
import { StudySessionCardProps } from '../../types/SessionType';

const SessionCard: React.FC<StudySessionCardProps> = ({ session }) => {
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

  const formatDateTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="mb-4 mx-4 bg-white  border-t-4 border-purple-500 rounded-xl shadow-sm p-6">

      <Text className="text-lg font-semibold text-gray-800 mb-2" numberOfLines={2}>
        {session.title}
      </Text>

      <View className="flex-row items-center mb-3 bg-emerald-50 py-2 px-3 rounded-lg">
        {session.teacherImage ? (
          <Image
            source={{ uri: session.teacherImage }}
            className="w-12 h-12 rounded-full border-2 border-emerald-500 mr-3"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-500 justify-center items-center mr-3 overflow-hidden">
            <Image
                source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=rohaini&backgroundColor=10b981' }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
            />
          </View>
        )}
        <View>
          <Text className="text-xs text-gray-600">Tutor</Text>
          <Text className="text-base text-emerald-600 font-semibold capitalize">{session.teacherName}</Text>
        </View>
      </View>

      {session.description && (
        <Text className="text-sm text-black leading-5 mb-4" numberOfLines={5}>
          {session.description}
        </Text>
      )}

      <View className="flex-row items-center mb-2">
        <Ionicons name="calendar" size={16} color="#059669" />
        <Text className="text-sm text-gray-700 ml-2">{session.date}</Text>
      </View>

       <View className="flex-row items-center mb-4">
        <Ionicons name="time" size={16} color="#059669" />
        <Text className="text-sm text-gray-700 ml-2">{session.time}</Text>
      </View>


      {/* Meeting Button */}
      {session.meetingLink && (
        <TouchableOpacity
          className="bg-emerald-500 flex-row items-center justify-center py-3 px-4 rounded-xl"
          onPress={handleMeetingPress}
        >
          <Ionicons name="videocam" size={16} color="white" />
          <Text className="text-white text-sm font-medium mx-2">Serta Sesi</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

export default SessionCard;
