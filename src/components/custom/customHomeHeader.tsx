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

    return (
    <SafeAreaView className="bg-white ">
        <HStack className="justify-between px-4 pb-2">
            <HStack space="md">
                <Avatar size="md">
                    <AvatarFallbackText>Img</AvatarFallbackText>
                    <AvatarImage
                        source={{ 
                            uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                        }}
                    />
                </Avatar>  
                <VStack>
                    <Text size="sm">Selamat Pagi</Text>
                    <Heading size="sm">{customUserData?.userName}</Heading>
                </VStack>           
            </HStack>
            {/* <Icon as={BellIcon} className="text-gray-500 m-2 w-6 h-6" /> */}
            <MaterialIcons name="notifications" size={24} color="gray" style={{margin: 8}} />
        </HStack>
    </SafeAreaView>
  ) 
}

