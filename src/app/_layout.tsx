import "@/global.css";
import { Stack } from "expo-router";
import { View } from "react-native";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";

export default function Layout(){
  return (
  <GluestackUIProvider mode="light">
    <View className="flex-1 px-4 bg-white">
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      </Stack>
    </View>
  </GluestackUIProvider>
  );
}