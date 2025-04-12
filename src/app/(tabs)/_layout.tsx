import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from "expo-router";
import CustomHomeHeader from '../../components/custom/customHomeHeader';
// import { SafeAreaView } from 'react-native';

export default function _layout (){
  return (
    // <SafeAreaView className="flex-1">
        <Tabs screenOptions={{ tabBarActiveTintColor: '#0D5BC4'}}>
            <Tabs.Screen 
                name="index" 
                options={{
                    // title:'Home', 
                    header: () => <CustomHomeHeader/>,
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="home" color={color}/>
                }}
                
            /> 
            <Tabs.Screen
                name="chatbot"
                options={{
                    title:'Chat Bot', 
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="headphones" color={color}/>
                }}
            />
            <Tabs.Screen
                name="forum"
                options={{
                    title:'Forum', 
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="comments" color={color}/>
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title:'Account', 
                    headerShown: false,
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="user" color={color}/>
                }}
            />
        </Tabs>
    // </SafeAreaView>
  )
}

