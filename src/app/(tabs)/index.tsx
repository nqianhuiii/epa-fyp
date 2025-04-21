import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import DashboardIcon from "../../components/custom/dashboardIcon";
import HomeSlider from "../../components/custom/homeSlider";
import { useAuthController } from "../../hooks/useAuthController";


export default function Home(){
    // const router = useRouter();

    const { initializeAuth } = useAuthController();

    useEffect(() => {
      // const unsubscribe = onAuthStateChanged(auth, (user) => {
      //   if(!user){
      //       router.replace('/(auth)/signin');
      //   }
      // });

      const unsubscribe = initializeAuth();

      // return a cleanup function to unsubscribe from the auth state change listener
      return () => unsubscribe();
    }, []);
    
    return (
      <View className="flex-1 bg-white">
          <Stack.Screen name="index" options={{ headerShown: false}}/>
          <HomeSlider/>
          <DashboardIcon/>
      </View>
    )
}
