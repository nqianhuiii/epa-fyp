import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ArrowLeftIcon, Icon } from "../ui/icon";

export default function BackButton() {
    return(
        <TouchableOpacity onPress={router.back}>
            <Icon as={ArrowLeftIcon} size="xl" className="text-green-400"/>
        </TouchableOpacity>
    )
}