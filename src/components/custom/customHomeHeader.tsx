import { MaterialIcons } from "@expo/vector-icons"
import React from 'react'
import { SafeAreaView } from 'react-native'
import { useAuthStore } from "../../store/authStore"
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar'
import { Heading } from '../ui/heading'
import { HStack } from '../ui/hstack'
import { Text } from '../ui/text'
import { VStack } from '../ui/vstack'


export default function CustomHomeHeader(){
    const { customUserData } = useAuthStore();

    const getGreeting = () => {
        const currentHour = new Date();
        const utc = currentHour.getTime() + currentHour.getTimezoneOffset() * 60000;
        const malaysiaTime = new Date(utc + 8 * 60 * 60 * 1000);
        const hours = malaysiaTime.getHours();

        if(hours >= 5 && hours <12) return "Selamat Pagi";
        if(hours >= 12 && hours <18) return "Selamat Petang";
        return "Selemat Malam";
    }

    return (
    <SafeAreaView className="bg-white ">
        <HStack className="justify-between px-4 pb-2">
            <HStack space="md">
                <Avatar size="md">
                    <AvatarFallbackText>Img</AvatarFallbackText>
                    <AvatarImage
                        source={{ 
                        uri: customUserData?.profilePhotoUrl|| 'https://api.dicebear.com/7.x/avataaars/png?seed=rohaini&backgroundColor=10b981'
                        }}
                    />
                </Avatar>  
                <VStack>
                    <Text size="sm">{getGreeting()}</Text>
                    <Heading size="sm">{customUserData?.userName}</Heading>
                </VStack>           
            </HStack>
            {/* <Icon as={BellIcon} className="text-gray-500 m-2 w-6 h-6" /> */}
            {/* <MaterialIcons name="notifications" size={24} color="gray" style={{margin: 8}} /> */}
        </HStack>
    </SafeAreaView>
  ) 
}

