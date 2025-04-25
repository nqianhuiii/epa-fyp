import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from "expo-router";
import CustomHomeHeader from '../../components/custom/customHomeHeader';
// import { SafeAreaView } from 'react-native';

export default function _layout (){
  return (
    // <SafeAreaView className="flex-1">
        <Tabs screenOptions={{ 
            tabBarActiveTintColor: '#34d399', 
            tabBarInactiveTintColor: '#d1d5db',
            tabBarStyle: {
                backgroundColor: '#ffffff', // Tab bar background color (white)
                borderTopWidth: 0,  // Remove the top border
                shadowOpacity: 0.05,   // Remove the shadow (on iOS devices)
                borderTopLeftRadius: 12,  // Round the top-left corner
                borderTopRightRadius: 12, // Round the top-right corner
                elevation: 0,  // Optional: Set elevation to 0 to remove shadow on Android
              },
        }}>
            <Tabs.Screen 
                name="index" 
                options={{
                    title:'Home', 
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
                name="profile"
                options={{
                    title: 'Profile', 
                    headerShown: false,
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="user" color={color}/>
                }}
            />
        </Tabs>
    // </SafeAreaView>
  )
}

