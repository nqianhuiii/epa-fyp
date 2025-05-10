import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "../../../components/ui/avatar";
import { Button, ButtonText } from "../../../components/ui/button";
import { HStack } from "../../../components/ui/hstack";
import { Text } from "../../../components/ui/text";


export default function Home(){
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Stack.Screen 
          options={{ 
            headerShown: true, 
            headerTitle: "Forum",
            headerShadowVisible: false,
            headerStyle: { 
              backgroundColor: 'white'
            }
          }}
        />
        
        <View className="px-4 py-4">
          <HStack className="justify-between" space="md">
            <Button className="bg-emerald-400 rounded-lg flex-1">
              <ButtonText className="text-white">All Post</ButtonText>
            </Button>
            <Button className="bg-emerald-400 rounded-lg flex-1">
              <ButtonText className="text-white">My Post</ButtonText>
            </Button>
          </HStack>
        </View>

        <ScrollView className="flex-1 pt-5">
          <View className="bg-white rounded-xl px-6 pt-6 pb-4 mb-4 shadow mx-4">
            <HStack space="md" className="items-center">
              <Avatar size="md">
                <AvatarFallbackText>Img</AvatarFallbackText>
                <AvatarImage
                  source={{ 
                    uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                  }}
                />
              </Avatar> 
              <Text className="font-bold">Ahiho</Text>
            </HStack>
            
            <Text className="text-lg font-bold mt-3">How to do this</Text>
            <Text className="mt-1 mb-3">Can someone help to solve this question below, I'm having different layout than expected</Text>
            
            <HStack className="mt-4 items-center">
              <TouchableOpacity 
                  className="flex-row items-center mr-6" 
                  // onPress={() => handleLike(item.id)}
              >
                  <Ionicons name="thumbs-up-outline" size={20} color="#4B5563" />
                  <Text className="ml-2">9 Suka</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                  className="flex-row items-center" 
                  // onPress={() => router.push(`/forum/post/${item.id}`)}
              >
                  <Ionicons name="chatbubble-outline" size={20} color="#4B5563" />
                  <Text className="ml-2">9 Komen</Text>
              </TouchableOpacity>
            </HStack>
          </View>

          <View className="bg-white rounded-xl px-6 pt-4 pb-3 mb-4 shadow mx-4">
            <HStack space="md" className="items-center">
              <Avatar size="md">
                <AvatarFallbackText>Img</AvatarFallbackText>
                <AvatarImage
                  source={{ 
                    uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                  }}
                />
              </Avatar> 
              <Text className="font-bold">Ahiho</Text>
            </HStack>
            
            <Text className="text-lg font-bold mt-3">How to do this</Text>
            <Text className="mt-1 mb-3">Can someone help to solve this question below, I'm having different layout than expected</Text>
            
            <HStack className="mt-4 items-center">
              <TouchableOpacity 
                  className="flex-row items-center mr-6" 
                  // onPress={() => handleLike(item.id)}
              >
                  <Ionicons name="thumbs-up-outline" size={20} color="#4B5563" />
                  <Text className="ml-2">9 Suka</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                  className="flex-row items-center" 
                  // onPress={() => router.push(`/forum/post/${item.id}`)}
              >
                  <Ionicons name="chatbubble-outline" size={20} color="#4B5563" />
                  <Text className="ml-2">9 Komen</Text>
              </TouchableOpacity>
            </HStack>
          </View>
        </ScrollView>

        <TouchableOpacity 
            className="absolute bottom-20 right-6 w-14 h-14 bg-emerald-400 rounded-full items-center justify-center"
            onPress={() => router.push('/(tabs)/forum/createForum')}
        >
            <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
    )
}