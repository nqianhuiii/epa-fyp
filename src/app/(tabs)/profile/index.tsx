import { router, Stack } from "expo-router";
import { SafeAreaView, View } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "../../../components/ui/avatar";
import { Button, ButtonText } from "../../../components/ui/button";
import { Heading } from "../../../components/ui/heading";
import { HStack } from "../../../components/ui/hstack";
import { Text } from "../../../components/ui/text";
import { VStack } from "../../../components/ui/vstack";
import { auth } from "../../../config/firebaseConfig";
import { useAuthStore } from "../../../store/authStore";

export default function Profile(){
    const { customUserData } = useAuthStore();
  
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: true, headerTitle: "Profil"}}/>
        <View className="px-5 py-3">
          <View className="bg-white rounded-xl px-5 py-5">
            <HStack className="justify-between">
              <HStack space="md" className="flex-1">
                <Avatar size="xl">
                  <AvatarFallbackText>Img</AvatarFallbackText>
                  <AvatarImage
                    source={{ 
                      uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                    }}
                  />
                </Avatar>  
                <VStack space="sm" className="p-2 flex-1">
                  <Heading size="md" className="flex-wrap">
                    {customUserData?.fullName}
                  </Heading>
                  <Text size="sm">{customUserData?.userName}</Text>
                </VStack>           
              </HStack>
            </HStack>
          </View>
        </View>
        <View className="w-full mb-3 px-5">    
          <Button className="bg-emerald-400 rounded-xl h-11 mb-3" onPress= {() => router.push('/(tabs)/profile/editProfile')}> 
            <ButtonText>Edit Profil</ButtonText>
          </Button>
          <Button className="border border-emerald-400 bg-white rounded-xl h-11" onPress={() => auth.signOut()}>
            <ButtonText className="text-emerald-400">Log Keluar</ButtonText>
          </Button> 
        </View>
      </SafeAreaView>
    );
}
