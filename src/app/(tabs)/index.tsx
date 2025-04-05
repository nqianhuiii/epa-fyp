import { Text, View } from "react-native";
import DashboardIcon from "../../components/custom/dashboardIcon";
import HomeSlider from "../../components/custom/homeSlider";

export default function Home(){
    return (
      <View className="flex-1 bg-white">
          <HomeSlider/>
          <DashboardIcon/>
      </View>
    )
}
