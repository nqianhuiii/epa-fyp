import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { View } from "react-native";
import DashboardIcon from "../../components/custom/dashboardIcon";
import HomeSlider from "../../components/custom/homeSlider";
import { auth } from "../../utils/firebaseConfig";

export default function Home(){
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if(!user){
            router.replace('/(auth)/signin');
        }
      });
      return unsubscribe;
    }, []);
    
    return (
      <View className="flex-1 bg-white">
          <HomeSlider/>
          <DashboardIcon/>
      </View>
    )
}
