import { router, Stack } from "expo-router";
import { SafeAreaView, View } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "../../../components/ui/avatar";
import { Button, ButtonText } from "../../../components/ui/button";
import { Heading } from "../../../components/ui/heading";
import { HStack } from "../../../components/ui/hstack";
import { VStack } from "../../../components/ui/vstack";
import { auth } from "../../../config/firebaseConfig";
import { useAuthStore } from "../../../store/authStore";

export default function Profile(){
    const { customUserData } = useAuthStore();
  
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: true, headerTitle: "Profile"}}/>
        <View className="flex-1 px-4">
            <HStack className="justify-between px-4 py-4">
                <HStack space="md">
                    <Avatar size="xl">
                        <AvatarFallbackText>Img</AvatarFallbackText>
                        <AvatarImage
                            source={{ 
                                uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                            }}
                        />
                    </Avatar>  
                    <VStack space="sm">
                        {/* <Heading size="sm">{customUserData?.userName}</Heading> */}
                        <Heading size="sm">{customUserData?.userName}</Heading>
                        <Button className="border border-blue-400 bg-white mt-10 rounded-lg" onPress={() => router.push('/(tabs)/profile/editProfile')}>
                          <ButtonText className="text-blue-400">Edit</ButtonText>
                        </Button>                
                  </VStack>           
                </HStack>
            </HStack>

            <View className="w-full mb-8">
              <Button className="bg-emerald-400 rounded-lg" onPress={() => auth.signOut()}>
                <ButtonText>Sign Out</ButtonText>
              </Button>
            </View>
        </View>
      </SafeAreaView>
    );
}
