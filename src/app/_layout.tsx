import "@/global.css";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";
import { useAuth } from "../hooks/useAuth";

export default function Layout(){

  const initializing = useAuth();

  if(initializing){
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small"/>
      </View>
    )
  }

  return (
    <GluestackUIProvider mode="light">
      <View className= "flex-1 bg-white">
        <Stack screenOptions={{ headerShown: false }}/>
      </View>
    </GluestackUIProvider>
  );
}