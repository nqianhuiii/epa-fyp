import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export const ProgressCard = ({
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
