import { Stack } from "expo-router";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import BackButton from "./customBackButton";
import { Text } from "../../components/ui/text";

type Props = {
    title?: string;
    message?: string;
    showBackButton?: boolean;
};

export default function LoadingScreenWithHeader({
    title = "Loading", 
    message =  "Please wait...", 
    showBackButton = true
}: Props) {
    return(
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ 
                headerShown: true, 
                headerTitle: title, 
                headerShadowVisible: false,
                headerBackTitle: '',
                headerLeft: () => (showBackButton?  <BackButton/> : null),
            }}/>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size={"small"} color="#10B981" className="mt-8" />
                <Text className="mt-4 text-gray-600">{message}</Text>
            </View>
        </SafeAreaView>        
    )
}


