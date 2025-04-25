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
        <Stack.Screen options={{ 
          headerShown: true, 
          headerTitle: "Profile",
          headerShadowVisible: false,
        }}/>
        <View className="px-4 pt-3 pb-4">
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
                          <Heading size="md" className="flex-wrap">Muhammad Ali bin Yaser Ali ali ali Muafakay</Heading>
                          <Text size="sm">{customUserData?.userName}</Text>
                    </VStack>           
                  </HStack>
              </HStack>
          </View>
        </View>

        <View className="px-5 mb-8">           
              <Button className="bg-emerald-400 rounded-xl" onPress={() => router.push('/(tabs)/profile/editProfile')}>
                <ButtonText>Edit Profile</ButtonText>
              </Button>
              <Button className="border border-emerald-400 bg-white h-11 mt-3 rounded-xl" onPress={() => auth.signOut()}>
                  <ButtonText className="text-emerald-400">Sign Out</ButtonText>
              </Button>      
        </View>
      </SafeAreaView>
    );
}
