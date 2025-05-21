import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

interface Props {
  onDelete: () => void;
}

export const HeaderLeftButton = ({ onDelete }: Props) => (
  <View style={{ flexDirection: 'row', gap: 16, paddingRight: 8 }}>
    <Ionicons name="trash-outline" size={24} color="#EF4444" onPress={onDelete} />
  </View>
);
