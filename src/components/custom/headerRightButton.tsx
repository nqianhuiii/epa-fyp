import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

interface Props {
  onEdit: () => void;
  onCancel: () => void;
}

export const HeaderRightButton = ({ onEdit, onCancel }: Props) => (
  <View style={{ flexDirection: 'row', gap: 16, paddingRight: 8 }}>
    <Ionicons name="create-outline" size={24} color="#10B981" onPress={onEdit} />
    <Ionicons name="close" size={24} color="#4B5563" onPress={onCancel} />
  </View>
);
