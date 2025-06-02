import "@/global.css";
import { Stack, router } from "expo-router";
import { View } from "react-native";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import CustomActivityIndicator from "../components/custom/customActivityIndicator";

export default function Layout() {
  const initializing = useAuth();
  const user = useAuthStore((state) => state.user);

  // Handle navigation after the layout is mounted
  useEffect(() => {
    if (!initializing) {
      // Only navigate when authentication state is determined
      const path = user ? '/(tabs)' : '/(auth)/signin';
      router.replace(path);
    }
  }, [initializing, user]);

  if (initializing) {
    return (
      <View className="flex-1 items-center justify-center">
        <CustomActivityIndicator/>
      </View>
    )
  }

  return (
    <GluestackUIProvider mode="light">
      <View className="flex-1 bg-white">
        <Stack screenOptions={{ headerShown: false }}/>
      </View>
    </GluestackUIProvider>
  );
}