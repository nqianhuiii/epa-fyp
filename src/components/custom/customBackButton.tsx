import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";


export default function BackButton() {
    return(
        <TouchableOpacity onPress={router.back}>
            <Ionicons name="arrow-back" size={24} color="#4ade80" />
        </TouchableOpacity>
    )
}