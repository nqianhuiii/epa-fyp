import { useEffect } from "react";
import { View } from "react-native";
import DashboardIcon from "../../components/custom/dashboardIcon";
import HomeSlider from "../../components/custom/homeSlider";
import { useAuthController } from "../../hooks/useAuthController";
import { useNavigation } from '@react-navigation/native';
import HomeStudySessions from "../../components/custom/HomeStudySession";

export default function Home() {
  const { initializeAuth } = useAuthController();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <HomeSlider />
      <DashboardIcon />
      <HomeStudySessions 
          maxSessions={3} 
          showViewAll={true} 
        />
    </View>
  );
}
