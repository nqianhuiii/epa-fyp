import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";


export const DetailedStatsRow = ({
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
          className="w-10 h-10 rounded-full items-center justify-center mr-2"
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